import { useState, useEffect, useRef, useCallback } from 'react';
import { instructions, type Stage, type InstructionSimulation } from '../data/instructions';

const STAGES: Stage[] = ['fetch', 'decode', 'execute', 'memory', 'writeback'];

export function useSimulation() {
  const [instrIndex, setInstrIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentInstr: InstructionSimulation = instructions[instrIndex];
  const currentSnapshot = currentInstr.stages[stageIndex];

  const stopPlay = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const nextStage = useCallback(() => {
    setStageIndex(prev => {
      if (prev < STAGES.length - 1) return prev + 1;
      stopPlay();
      return prev;
    });
  }, [stopPlay]);

  const prevStage = useCallback(() => {
    stopPlay();
    setStageIndex(prev => Math.max(0, prev - 1));
  }, [stopPlay]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopPlay();
    } else {
      if (stageIndex === STAGES.length - 1) {
        setStageIndex(0);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, stageIndex, stopPlay]);

  const selectInstruction = useCallback((idx: number) => {
    stopPlay();
    setInstrIndex(idx);
    setStageIndex(0);
  }, [stopPlay]);

  const resetStages = useCallback(() => {
    stopPlay();
    setStageIndex(0);
  }, [stopPlay]);

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = setInterval(() => {
      setStageIndex(prev => {
        if (prev < STAGES.length - 1) return prev + 1;
        stopPlay();
        return prev;
      });
    }, 1200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, stopPlay]);

  return {
    instructions,
    instrIndex,
    stageIndex,
    currentInstr,
    currentSnapshot,
    isPlaying,
    stages: STAGES,
    nextStage,
    prevStage,
    togglePlay,
    selectInstruction,
    resetStages,
  };
}

import { useState, useEffect, useCallback } from 'react';
import type { SignalSnapshot } from '../data/types';
import { instructions } from '../data/instructions';

interface SimulationState {
  instrIndex: number;
  stageIndex: number;
  currentSnapshot: SignalSnapshot;
  currentInstruction: typeof instructions[number];
  selectInstruction: (i: number) => void;
  selectStage: (i: number) => void;
  prevStage: () => void;
  nextStage: () => void;
  resetStages: () => void;
  totalStages: number;
}

export function useSimulation(): SimulationState {
  const [instrIndex, setInstrIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  const currentInstruction = instructions[instrIndex];
  const totalStages = currentInstruction.stages.length;
  const currentSnapshot = currentInstruction.stages[stageIndex];

  const selectInstruction = useCallback((i: number) => {
    setInstrIndex(i);
    setStageIndex(0);
  }, []);

  const prevStage = useCallback(() => {
    setStageIndex(s => Math.max(0, s - 1));
  }, []);

  const nextStage = useCallback(() => {
    setStageIndex(s => Math.min(totalStages - 1, s + 1));
  }, [totalStages]);

  const selectStage = useCallback((i: number) => {
    setStageIndex(Math.max(0, Math.min(totalStages - 1, i)));
  }, [totalStages]);

  const resetStages = useCallback(() => {
    setStageIndex(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextStage();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prevStage, nextStage]);

  return {
    instrIndex,
    stageIndex,
    currentSnapshot,
    currentInstruction,
    selectInstruction,
    selectStage,
    prevStage,
    nextStage,
    resetStages,
    totalStages,
  };
}

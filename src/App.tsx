import { useRef } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { InstructionSelector } from './components/InstructionSelector';
import { CpuDiagram } from './components/CpuDiagram';
import { StageControls } from './components/StageControls';
import { SignalPanel } from './components/SignalPanel';

export default function App() {
  const sim = useSimulation();
  const animKey = useRef(0);
  const prevStage = useRef(sim.stageIndex);
  if (prevStage.current !== sim.stageIndex) {
    prevStage.current = sim.stageIndex;
    animKey.current += 1;
  }

  return (
    // Full viewport, no scroll
    <div className="flex flex-col h-screen overflow-hidden bg-[#0d1117]">

      {/* ── Header / Instruction selector ── 44px ── */}
      <div className="flex items-center gap-3 px-4 shrink-0 border-b border-slate-800"
           style={{ height: 44 }}>
        <span className="text-xs font-semibold text-slate-500 shrink-0 font-mono tracking-wide">
          RISC-V CPU
        </span>
        <div className="w-px h-4 bg-slate-800" />
        <InstructionSelector
          instructions={sim.instructions}
          selectedIndex={sim.instrIndex}
          onSelect={sim.selectInstruction}
        />
      </div>

      {/* ── Main area ── flex-1 ── */}
      <div className="flex flex-1 min-h-0">

        {/* CPU diagram */}
        <div className="flex-1 min-w-0 p-2">
          <CpuDiagram snapshot={sim.currentSnapshot} animKey={animKey.current} />
        </div>

        {/* Signal panel */}
        <div className="w-44 shrink-0 border-l border-slate-800 overflow-hidden">
          <SignalPanel snapshot={sim.currentSnapshot} stageIndex={sim.stageIndex} />
        </div>
      </div>

      {/* ── Stage controls ── 48px ── */}
      <div className="shrink-0 border-t border-slate-800" style={{ height: 48 }}>
        <StageControls
          stages={sim.stages}
          stageIndex={sim.stageIndex}
          snapshot={sim.currentSnapshot}
          isPlaying={sim.isPlaying}
          onPrev={sim.prevStage}
          onNext={sim.nextStage}
          onTogglePlay={sim.togglePlay}
          onReset={sim.resetStages}
        />
      </div>
    </div>
  );
}

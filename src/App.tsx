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
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">

      {/* ── Header / Instruction selector ── 48px ── */}
      <header className="flex items-center shrink-0 bg-white border-b border-slate-200"
              style={{ height: 48 }}>
        {/* Logo area */}
        <div className="flex items-center gap-2.5 px-4 border-r border-slate-200 shrink-0"
             style={{ height: 48 }}>
          <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="white">
              <rect x="2" y="2" width="5" height="5" rx="1"/>
              <rect x="9" y="2" width="5" height="5" rx="1"/>
              <rect x="2" y="9" width="5" height="5" rx="1"/>
              <rect x="9" y="9" width="5" height="5" rx="1"/>
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">RISC-V CPU</span>
        </div>

        {/* Instruction selector fills rest */}
        <div className="flex-1 min-w-0 h-full">
          <InstructionSelector
            instructions={sim.instructions}
            selectedIndex={sim.instrIndex}
            onSelect={sim.selectInstruction}
          />
        </div>
      </header>

      {/* ── Main area ── flex-1 ── */}
      <div className="flex flex-1 min-h-0">

        {/* CPU diagram */}
        <div className="flex-1 min-w-0 p-3">
          <CpuDiagram snapshot={sim.currentSnapshot} animKey={animKey.current} />
        </div>

        {/* Signal sidebar */}
        <div className="w-44 shrink-0 overflow-hidden">
          <SignalPanel snapshot={sim.currentSnapshot} stageIndex={sim.stageIndex} />
        </div>
      </div>

      {/* ── Stage controls ── 52px ── */}
      <footer className="shrink-0 bg-white border-t border-slate-200" style={{ height: 52 }}>
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
      </footer>
    </div>
  );
}

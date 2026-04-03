import { instructions } from './data/instructions';
import { useSimulation } from './hooks/useSimulation';
import InstructionTabs from './components/InstructionTabs';
import StageTabs from './components/StageTabs';
import CpuDiagram from './components/CpuDiagram';
import SignalPanel from './components/SignalPanel';
import EncodingDisplay from './components/EncodingDisplay';

// Extract ALU control value from signal snapshot
function getAluControl(snapshot: ReturnType<typeof useSimulation>['currentSnapshot']): string | undefined {
  const sig = snapshot.signalValues.find(
    s => s.label === 'ALUCtrl' || s.label === 'ALUControl'
  );
  if (!sig) return undefined;
  // Extract 4-bit code from strings like "0000 (ADD)" or "1000 (SUB)"
  const match = sig.value.match(/^(\d{4})/);
  return match ? match[1] : undefined;
}

export default function App() {
  const sim = useSimulation();
  const stages = sim.currentInstruction.stages.map(s => s.stage);
  const alucontrol = getAluControl(sim.currentSnapshot);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          {/* Chip icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="#3B82F6" opacity={0.15} stroke="#3B82F6" strokeWidth={1.5}/>
            <rect x="9" y="9" width="6" height="6" rx="1" fill="#3B82F6"/>
            <line x1="12" y1="2" x2="12" y2="6" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round"/>
            <line x1="12" y1="18" x2="12" y2="22" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round"/>
            <line x1="2" y1="12" x2="6" y2="12" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round"/>
            <line x1="18" y1="12" x2="22" y2="12" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round"/>
            <line x1="8" y1="2" x2="8" y2="5" stroke="#94A3B8" strokeWidth={1} strokeLinecap="round"/>
            <line x1="16" y1="2" x2="16" y2="5" stroke="#94A3B8" strokeWidth={1} strokeLinecap="round"/>
            <line x1="8" y1="19" x2="8" y2="22" stroke="#94A3B8" strokeWidth={1} strokeLinecap="round"/>
            <line x1="16" y1="19" x2="16" y2="22" stroke="#94A3B8" strokeWidth={1} strokeLinecap="round"/>
          </svg>
          <h1 className="text-base font-semibold text-slate-900">RISC-V CPU 可視化</h1>
        </div>

        {/* Encoding display */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400">命令:</span>
            <code className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
              {sim.currentInstruction.instruction}
            </code>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <EncodingDisplay encoding={sim.currentInstruction.encoding} type={sim.currentInstruction.type} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-slate-400">意味:</span>
            <span className="font-mono">{sim.currentInstruction.meaning}</span>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={sim.prevStage}
            disabled={sim.stageIndex === 0}
            className="px-3 py-1 text-xs rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← 前
          </button>
          <span className="text-xs text-slate-400 min-w-[40px] text-center">
            {sim.stageIndex + 1}/{sim.totalStages}
          </span>
          <button
            onClick={sim.nextStage}
            disabled={sim.stageIndex === sim.totalStages - 1}
            className="px-3 py-1 text-xs rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            次 →
          </button>
        </div>
      </header>

      {/* Instruction tabs */}
      <InstructionTabs
        instructions={instructions}
        selectedIndex={sim.instrIndex}
        onSelect={sim.selectInstruction}
      />

      {/* Stage tabs */}
      <StageTabs
        stages={stages}
        stageIndex={sim.stageIndex}
        onSelect={sim.selectStage}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* CPU Diagram */}
        <div className="flex-1 min-h-0 overflow-hidden p-2">
          <CpuDiagram snapshot={sim.currentSnapshot} />
        </div>

        {/* Signal Panel */}
        <SignalPanel
          snapshot={sim.currentSnapshot}
          alucontrol={alucontrol}
        />
      </div>
    </div>
  );
}

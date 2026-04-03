import type { InstructionSimulation, InstrType } from '../data/types';

interface Props {
  instructions: InstructionSimulation[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const TYPE_COLORS: Record<InstrType, string> = {
  R: 'bg-purple-100 text-purple-700',
  I: 'bg-blue-100 text-blue-700',
  S: 'bg-green-100 text-green-700',
  B: 'bg-orange-100 text-orange-700',
};

export default function InstructionTabs({ instructions, selectedIndex, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-white overflow-x-auto">
      <span className="text-xs text-slate-400 mr-1 whitespace-nowrap">命令選択:</span>
      {instructions.map((instr, i) => {
        const isActive = i === selectedIndex;
        return (
          <button
            key={instr.id}
            onClick={() => onSelect(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono whitespace-nowrap border transition-colors ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {instr.instruction}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-sans font-semibold ${
              isActive ? 'bg-white/20 text-white' : TYPE_COLORS[instr.type]
            }`}>
              {instr.type}
            </span>
          </button>
        );
      })}
    </div>
  );
}

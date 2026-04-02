import type { InstructionSimulation } from '../data/instructions';

interface Props {
  instructions: InstructionSimulation[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}

const TYPE_COLOR: Record<string, string> = {
  R: 'text-emerald-400', I: 'text-sky-400', S: 'text-amber-400', B: 'text-violet-400',
};

export function InstructionSelector({ instructions, selectedIndex, onSelect }: Props) {
  const sel = instructions[selectedIndex];
  return (
    <div className="flex items-center gap-3 px-4 h-full">
      {/* Tabs */}
      <div className="flex gap-1">
        {instructions.map((ins, i) => (
          <button key={i} onClick={() => onSelect(i)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all
              ${i === selectedIndex
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}>
            {ins.instruction}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-700" />

      {/* Selected info */}
      <span className={`text-xs font-mono font-semibold ${TYPE_COLOR[sel.type]}`}>
        [{sel.type}型]
      </span>
      <span className="text-xs text-slate-400 truncate">{sel.meaning}</span>
    </div>
  );
}

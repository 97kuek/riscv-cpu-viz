import type { InstructionSimulation } from '../data/instructions';

interface Props {
  instructions: InstructionSimulation[];
  selectedIndex: number;
  onSelect: (i: number) => void;
}

const TYPE_COLOR: Record<string, { pill: string; badge: string }> = {
  R: { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', badge: 'bg-emerald-100 text-emerald-600' },
  I: { pill: 'bg-sky-50 text-sky-700 border-sky-200',             badge: 'bg-sky-100 text-sky-600'         },
  S: { pill: 'bg-amber-50 text-amber-700 border-amber-200',       badge: 'bg-amber-100 text-amber-600'     },
  B: { pill: 'bg-violet-50 text-violet-700 border-violet-200',    badge: 'bg-violet-100 text-violet-600'   },
};

export function InstructionSelector({ instructions, selectedIndex, onSelect }: Props) {
  const sel = instructions[selectedIndex];
  const tc  = TYPE_COLOR[sel.type];

  return (
    <div className="flex items-center gap-3 px-4 h-full overflow-hidden">
      {/* Instruction tabs */}
      <div className="flex gap-1 shrink-0">
        {instructions.map((ins, i) => (
          <button key={i} onClick={() => onSelect(i)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-mono font-medium
              border transition-all duration-150 select-none
              ${i === selectedIndex
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
            `}>
            {ins.instruction}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-slate-200 shrink-0" />

      {/* Type badge */}
      <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${tc.badge}`}>
        {sel.type}型
      </span>

      {/* Meaning */}
      <span className="text-xs text-slate-500 truncate">{sel.meaning}</span>
    </div>
  );
}

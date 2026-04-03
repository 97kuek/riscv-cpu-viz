import type { Stage } from '../data/types';

interface Props {
  stages: Stage[];
  stageIndex: number;
  onSelect: (index: number) => void;
}

const STAGE_LABELS: Record<Stage, string> = {
  fetch:     'FETCH',
  decode:    'DECODE',
  execute:   'EXECUTE',
  memory:    'MEMORY',
  writeback: 'WRITEBACK',
};

export default function StageTabs({ stages, stageIndex, onSelect }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-1">
        {stages.map((stage, i) => {
          const isActive = i === stageIndex;
          const isPast = i < stageIndex;

          return (
            <div key={stage} className="flex items-center gap-1">
              <button
                onClick={() => onSelect(i)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isPast
                    ? 'text-blue-500 hover:bg-blue-50'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                {isPast && (
                  <span className="mr-1 text-blue-500">✓</span>
                )}
                {STAGE_LABELS[stage]}
              </button>
              {i < stages.length - 1 && (
                <span className={`text-slate-300 text-xs select-none ${
                  i < stageIndex ? 'text-blue-300' : ''
                }`}>
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-slate-400 select-none">
        ← → キーでナビゲート
      </div>
    </div>
  );
}

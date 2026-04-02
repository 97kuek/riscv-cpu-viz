import type { Stage, SignalSnapshot } from '../data/instructions';

interface Props {
  stages: Stage[]; stageIndex: number; snapshot: SignalSnapshot;
  isPlaying: boolean;
  onPrev: () => void; onNext: () => void; onTogglePlay: () => void; onReset: () => void;
}

const META: Record<Stage, { label: string; activeClass: string; doneClass: string }> = {
  fetch:     { label: 'Fetch',     activeClass: 'bg-sky-500 text-white',      doneClass: 'bg-sky-100 text-sky-400'       },
  decode:    { label: 'Decode',    activeClass: 'bg-violet-500 text-white',   doneClass: 'bg-violet-100 text-violet-400' },
  execute:   { label: 'Execute',   activeClass: 'bg-amber-500 text-white',    doneClass: 'bg-amber-100 text-amber-400'   },
  memory:    { label: 'Memory',    activeClass: 'bg-orange-500 text-white',   doneClass: 'bg-orange-100 text-orange-400' },
  writeback: { label: 'Writeback', activeClass: 'bg-emerald-500 text-white',  doneClass: 'bg-emerald-100 text-emerald-400' },
};

export function StageControls({ stages, stageIndex, snapshot, isPlaying, onPrev, onNext, onTogglePlay, onReset }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 h-full">

      {/* Stage pills */}
      <div className="flex items-center gap-1 shrink-0">
        {stages.map((s, i) => {
          const m = META[s];
          const active = i === stageIndex;
          const done   = i < stageIndex;
          return (
            <span key={s}
              className={`
                text-[11px] font-semibold px-2.5 py-1 rounded-full select-none
                transition-all duration-200
                ${active ? m.activeClass : done ? m.doneClass : 'bg-slate-100 text-slate-400'}
              `}>
              {m.label}
            </span>
          );
        })}
      </div>

      {/* Grouped button control */}
      <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden shrink-0">
        <button onClick={onReset}
          title="最初に戻る"
          className="px-2.5 py-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50
                     border-r border-slate-200 transition-colors text-sm leading-none">
          ⏮
        </button>
        <button onClick={onPrev} disabled={stageIndex === 0}
          className="flex items-center gap-0.5 px-3 py-1.5 text-xs font-medium text-slate-600
                     hover:bg-slate-50 border-r border-slate-200 transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed">
          ‹ 前へ
        </button>
        <button onClick={onTogglePlay}
          className={`
            flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold
            border-r border-slate-200 transition-all
            ${isPlaying
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-slate-900 text-white hover:bg-slate-700'}
          `}>
          {isPlaying ? '⏸ 停止' : '⏵ 再生'}
        </button>
        <button onClick={onNext} disabled={stageIndex === stages.length - 1}
          className="flex items-center gap-0.5 px-3 py-1.5 text-xs font-medium text-slate-600
                     hover:bg-slate-50 transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed">
          次へ ›
        </button>
      </div>

      <div className="w-px h-4 bg-slate-200 shrink-0" />

      {/* Description */}
      <p key={`desc-${stageIndex}`}
        className="desc-anim text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1 min-w-0">
        {snapshot.description.replace(/\n/g, ' ').replace(/【.*?】/g, '').trim()}
      </p>
    </div>
  );
}

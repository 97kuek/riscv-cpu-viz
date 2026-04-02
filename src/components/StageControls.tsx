import type { Stage, SignalSnapshot } from '../data/instructions';

interface Props {
  stages: Stage[]; stageIndex: number; snapshot: SignalSnapshot;
  isPlaying: boolean;
  onPrev: () => void; onNext: () => void; onTogglePlay: () => void; onReset: () => void;
}

const META: Record<Stage, { label: string; color: string; active: string }> = {
  fetch:     { label: 'Fetch',     color: 'bg-slate-700 text-slate-300', active: 'bg-cyan-500 text-white ring-2 ring-cyan-400/40'    },
  decode:    { label: 'Decode',    color: 'bg-slate-700 text-slate-300', active: 'bg-violet-500 text-white ring-2 ring-violet-400/40' },
  execute:   { label: 'Execute',   color: 'bg-slate-700 text-slate-300', active: 'bg-yellow-500 text-white ring-2 ring-yellow-400/40' },
  memory:    { label: 'Memory',    color: 'bg-slate-700 text-slate-300', active: 'bg-orange-500 text-white ring-2 ring-orange-400/40' },
  writeback: { label: 'Writeback', color: 'bg-slate-700 text-slate-300', active: 'bg-green-500  text-white ring-2 ring-green-400/40'  },
};

export function StageControls({ stages, stageIndex, snapshot, isPlaying, onPrev, onNext, onTogglePlay, onReset }: Props) {
  const cur = stages[stageIndex];

  return (
    <div className="flex items-center gap-4 px-4 h-full">

      {/* Stage pills */}
      <div className="flex items-center gap-1 shrink-0">
        {stages.map((s, i) => (
          <span key={s}
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all duration-200
              ${i === stageIndex ? META[s].active : i < stageIndex ? 'bg-slate-700/60 text-slate-500' : META[s].color}`}>
            {META[s].label}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onReset}
          className="px-2 py-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 text-xs transition-colors">⏮</button>
        <button onClick={onPrev} disabled={stageIndex === 0}
          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs disabled:opacity-30 transition-colors">◀</button>
        <button onClick={onTogglePlay}
          className={`px-3.5 py-1 rounded text-xs font-medium transition-all
            ${isPlaying
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
          {isPlaying ? '⏸ 停止' : '⏵ 再生'}
        </button>
        <button onClick={onNext} disabled={stageIndex === stages.length - 1}
          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs disabled:opacity-30 transition-colors">▶</button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-700 shrink-0" />

      {/* Description – key forces re-render animation */}
      <p key={`${cur}-${stageIndex}`}
        className="desc-anim text-xs text-slate-400 leading-relaxed line-clamp-2 flex-1 min-w-0">
        {snapshot.description.replace(/\n/g, ' ').replace(/【.*?】/g, '').trim()}
      </p>
    </div>
  );
}

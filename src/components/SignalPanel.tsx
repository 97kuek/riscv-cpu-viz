import type { SignalSnapshot } from '../data/instructions';

interface Props { snapshot: SignalSnapshot; stageIndex: number; }

const CTRL_KEYS = ['regwrite','alusrc','memwrite','memtoreg','pcsrc','aluop','alucontrol','btaken'];
const isCtrl = (k: string) => CTRL_KEYS.some(c => k.toLowerCase().includes(c));

export function SignalPanel({ snapshot, stageIndex }: Props) {
  const all = Object.entries(snapshot.signalValues);
  const ctrl = all.filter(([k]) => isCtrl(k));
  const data = all.filter(([k]) => !isCtrl(k));

  return (
    <div className="flex flex-col h-full py-3 px-3 gap-3 overflow-hidden">

      {/* Control signals */}
      {ctrl.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-orange-500/70 uppercase tracking-widest mb-1.5">制御信号</p>
          <div className="space-y-0.5">
            {ctrl.map(([k, v]) => (
              <div key={k} className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">{k}</span>
                <span className={v === '1' ? 'text-orange-300 font-bold' : v === '0' ? 'text-slate-600' : 'text-orange-200'}>
                  {v.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data signals */}
      {data.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-blue-500/70 uppercase tracking-widest mb-1.5">データ</p>
          <div className="space-y-0.5">
            {data.map(([k, v]) => (
              <div key={k} className="flex justify-between items-center text-[11px] font-mono gap-2">
                <span className="text-slate-500 shrink-0">{k}</span>
                <span className="text-blue-300 text-right truncate">{v.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {all.length === 0 && (
        <p className="text-[11px] text-slate-700 mt-2">—</p>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stage badge */}
      <div className="text-[10px] font-mono text-slate-700 text-center">
        {stageIndex + 1} / 5
      </div>
    </div>
  );
}

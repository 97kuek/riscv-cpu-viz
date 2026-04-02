import type { SignalSnapshot } from '../data/instructions';

interface Props { snapshot: SignalSnapshot; stageIndex: number; }

const CTRL_KEYS = ['regwrite','alusrc','memwrite','memtoreg','pcsrc','aluop','alucontrol','btaken'];
const isCtrl = (k: string) => CTRL_KEYS.some(c => k.toLowerCase().includes(c));

function Row({ label, value, ctrl }: { label: string; value: string; ctrl: boolean }) {
  const shortVal = value.split(' ')[0];
  const is1 = shortVal === '1';
  const is0 = shortVal === '0';
  return (
    <div className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
      <span className="text-[11px] font-mono text-slate-500">{label}</span>
      <span className={`text-[11px] font-mono font-semibold
        ${ctrl
          ? is1 ? 'text-orange-600' : is0 ? 'text-slate-300' : 'text-orange-500'
          : 'text-blue-600'}`}>
        {shortVal}
      </span>
    </div>
  );
}

export function SignalPanel({ snapshot, stageIndex }: Props) {
  const all  = Object.entries(snapshot.signalValues);
  const ctrl = all.filter(([k]) => isCtrl(k));
  const data = all.filter(([k]) => !isCtrl(k));

  return (
    <div className="flex flex-col h-full py-3 px-3 gap-3 overflow-hidden bg-white border-l border-slate-200">

      {ctrl.length > 0 && (
        <section>
          <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-widest mb-1.5">
            制御信号
          </p>
          {ctrl.map(([k, v]) => <Row key={k} label={k} value={v} ctrl />)}
        </section>
      )}

      {data.length > 0 && (
        <section>
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-widest mb-1.5">
            データ
          </p>
          {data.map(([k, v]) => <Row key={k} label={k} value={v} ctrl={false} />)}
        </section>
      )}

      {all.length === 0 && (
        <p className="text-[11px] text-slate-300 mt-2">—</p>
      )}

      <div className="flex-1" />

      <p className="text-[10px] font-mono text-slate-300 text-center">{stageIndex + 1} / 5</p>
    </div>
  );
}

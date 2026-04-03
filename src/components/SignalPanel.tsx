import type { SignalSnapshot } from '../data/types';
import AluDiagram from './AluDiagram';

interface Props {
  snapshot: SignalSnapshot;
  alucontrol?: string;
}

export default function SignalPanel({ snapshot, alucontrol }: Props) {
  const dataSignals = snapshot.signalValues.filter(s => s.kind === 'data');
  const controlSignals = snapshot.signalValues.filter(s => s.kind === 'control');

  return (
    <div className="w-72 border-l border-slate-200 bg-white flex flex-col overflow-y-auto">
      {/* Signal Values */}
      <div className="p-4 flex-shrink-0">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          シグナル値
        </h2>

        {dataSignals.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              データ信号
            </div>
            <div className="space-y-1">
              {dataSignals.map((sig, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-500 truncate">{sig.label}</span>
                  <span className="text-xs font-mono font-semibold text-slate-900 whitespace-nowrap">{sig.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {controlSignals.length > 0 && (
          <div>
            <div className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              制御信号
            </div>
            <div className="space-y-1">
              {controlSignals.map((sig, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-500 truncate">{sig.label}</span>
                  <span className="text-xs font-mono font-semibold text-amber-700 whitespace-nowrap">{sig.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {snapshot.signalValues.length === 0 && (
          <p className="text-xs text-slate-400 italic">信号なし</p>
        )}
      </div>

      <div className="border-t border-slate-100" />

      {/* Description */}
      <div className="p-4 flex-shrink-0">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          説明
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {snapshot.description}
        </p>
      </div>

      <div className="border-t border-slate-100" />

      {/* ALU Diagram accordion */}
      <div className="p-4">
        <AluDiagram alucontrol={alucontrol} />
      </div>
    </div>
  );
}

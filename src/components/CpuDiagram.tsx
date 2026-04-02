import { useMemo } from 'react';
import { modules, muxes } from '../data/moduleLayout';
import { wires } from '../data/wireLayout';
import { Module } from './Module';
import { Wire } from './Wire';
import { MuxShape } from './MuxShape';
import type { SignalSnapshot } from '../data/instructions';

interface Props { snapshot: SignalSnapshot; animKey: number; }

export function CpuDiagram({ snapshot, animKey }: Props) {
  const activeW = useMemo(() => new Set(snapshot.activeWires), [snapshot.activeWires]);
  const activeM = useMemo(() => new Set(snapshot.activeModules), [snapshot.activeModules]);

  return (
    <div className="w-full h-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <svg
        viewBox="0 0 900 500"
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* ── Region backgrounds ───────────────────── */}
        {/* Controller */}
        <rect x={6} y={10} width={888} height={76} rx={6}
          fill="#faf5ff" stroke="#e9d5ff" strokeWidth={1} />
        <text x={12} y={22} fill="#a855f7" fontSize={8}
          fontFamily="monospace" fontWeight="700" letterSpacing="0.05em">
          CONTROLLER
        </text>

        {/* Datapath */}
        <rect x={6} y={94} width={888} height={398} rx={6}
          fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1} />
        <text x={12} y={106} fill="#94a3b8" fontSize={8}
          fontFamily="monospace" fontWeight="700" letterSpacing="0.05em">
          DATAPATH
        </text>

        {/* Divider */}
        <line x1={6} y1={90} x2={894} y2={90}
          stroke="#e2e8f0" strokeWidth={1} />

        {/* ── Wires ─────────────────────────────────── */}
        {wires.map(w => (
          <Wire key={w.id} wire={w}
            isActive={activeW.has(w.id)}
            value={activeW.has(w.id)
              ? snapshot.signalValues[w.label] ?? snapshot.signalValues[w.id]
              : undefined}
            animKey={animKey} />
        ))}

        {/* Junction dots */}
        {([[400,290],[570,276],[24,414]] as [number,number][]).map(([jx,jy],i) => (
          <circle key={i} cx={jx} cy={jy} r={2.5}
            fill="#cbd5e1" stroke="#94a3b8" strokeWidth={0.5} />
        ))}

        {/* ── MUXes ─────────────────────────────────── */}
        {muxes.map(m => <MuxShape key={m.id} mux={m} isActive={activeM.has(m.id)} />)}

        {/* MUX selector labels */}
        {[
          [408,265,'0'],[408,314,'1'],
          [728,256,'0'],[728,304,'1'],
          [4,387,'0'], [4,441,'1'],
        ].map(([lx,ly,lt],i)=>(
          <text key={i} x={lx} y={ly} fill="#cbd5e1" fontSize={7}
            fontFamily="monospace" textAnchor="middle">{lt}</text>
        ))}

        {/* ── Modules ───────────────────────────────── */}
        {modules.map(m => <Module key={m.id} module={m} isActive={activeM.has(m.id)} />)}

        {/* ── Port labels ───────────────────────────── */}
        {[
          [270,230,'rs1'],[270,280,'rs2'],[270,332,'rd'],
          [362,240,'RD1'],[362,292,'RD2'],
          [464,262,'A'  ],[464,304,'B'  ],[536,278,'Y'],
          [602,260,'A'  ],[602,300,'WD' ],[680,260,'RD'],
        ].map(([lx,ly,lt],i)=>(
          <text key={i} x={lx} y={ly} fill="#cbd5e1" fontSize={6.5}
            fontFamily="monospace" dominantBaseline="middle">{lt}</text>
        ))}
      </svg>
    </div>
  );
}

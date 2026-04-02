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
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 900 500"
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* ── Region backgrounds ──────────────────── */}
        <rect x={6} y={10} width={888} height={76} rx={6}
          fill="#0d0921" stroke="#2d1b69" strokeWidth={0.8} />
        <text x={12} y={22} fill="#4c1d95" fontSize={8} fontFamily="monospace" fontWeight="bold">
          CONTROLLER
        </text>

        <rect x={6} y={94} width={888} height={398} rx={6}
          fill="#080f1c" stroke="#1a2e48" strokeWidth={0.8} />
        <text x={12} y={106} fill="#1e3a5f" fontSize={8} fontFamily="monospace" fontWeight="bold">
          DATAPATH
        </text>

        {/* ── Wires ───────────────────────────────── */}
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
            fill="#1a2535" stroke="#334155" strokeWidth={0.8} />
        ))}

        {/* ── MUXes ───────────────────────────────── */}
        {muxes.map(m => <MuxShape key={m.id} mux={m} isActive={activeM.has(m.id)} />)}

        {/* MUX input labels */}
        {[
          [408,265,'0'],[408,314,'1'],
          [728,256,'0'],[728,304,'1'],
          [4,387,'0'], [4,441,'1'],
        ].map(([lx,ly,lt],i)=>(
          <text key={i} x={lx} y={ly} fill="#334155" fontSize={7} fontFamily="monospace">{lt}</text>
        ))}

        {/* ── Modules ─────────────────────────────── */}
        {modules.map(m => <Module key={m.id} module={m} isActive={activeM.has(m.id)} />)}

        {/* ── Port micro-labels ───────────────────── */}
        {[
          [270,230,'rs1'],[270,280,'rs2'],[270,332,'rd '],
          [362,240,'→'  ],[362,292,'→'  ],
          [464,262,'A'  ],[464,304,'B'  ],[536,278,'Y'  ],
          [602,260,'A'  ],[602,300,'WD' ],[680,260,'RD' ],
        ].map(([lx,ly,lt],i)=>(
          <text key={i} x={lx} y={ly} fill="#273548" fontSize={6.5}
            fontFamily="monospace" dominantBaseline="middle">{lt}</text>
        ))}
      </svg>
    </div>
  );
}

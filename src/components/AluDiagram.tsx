import { useState } from 'react';

interface Props {
  alucontrol?: string;
}

interface AluOp {
  code: string;
  symbol: string;
  name: string;
}

const ALU_OPS: AluOp[] = [
  { code: '0000', symbol: '+',  name: 'ADD' },
  { code: '1000', symbol: '-',  name: 'SUB' },
  { code: '0110', symbol: '|',  name: 'OR'  },
  { code: '0111', symbol: '&',  name: 'AND' },
  { code: '0010', symbol: '<?', name: 'SLT' },
];

export default function AluDiagram({ alucontrol }: Props) {
  const [open, setOpen] = useState(false);

  const activeIdx = ALU_OPS.findIndex(op => op.code === alucontrol);

  // SVG layout constants
  const svgW = 250;
  const svgH = 200;
  const opH = 26;
  const opY = (i: number) => 20 + i * opH;
  const opX = 55;
  const opW = 70;
  const muxX = 165;
  const muxY1 = 14;
  const muxY2 = 186;
  const muxMidX = 185;
  const outX = 220;
  const outY = 100;

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors w-full text-left py-1"
      >
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
        ALU 内部図
      </button>

      {open && (
        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            width="100%"
            style={{ display: 'block', maxHeight: 220 }}
          >
            {/* Labels */}
            <text x={2} y={104} fontSize={8} fill="#64748B" fontFamily="monospace">SrcA</text>
            <text x={2} y={116} fontSize={8} fill="#64748B" fontFamily="monospace">SrcB</text>

            {/* Operation blocks */}
            {ALU_OPS.map((op, i) => {
              const isActive = i === activeIdx;
              const y = opY(i);
              const fill = isActive ? '#EFF6FF' : '#F8FAFC';
              const stroke = isActive ? '#3B82F6' : '#CBD5E1';
              const textFill = isActive ? '#1D4ED8' : '#64748B';
              const fontWeight = isActive ? 700 : 400;

              return (
                <g key={op.code}>
                  <rect x={opX} y={y} width={opW} height={opH - 3} rx={3} fill={fill} stroke={stroke} strokeWidth={isActive ? 1.5 : 1} />
                  <text
                    x={opX + opW / 2}
                    y={y + (opH - 3) / 2 + 4}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={fontWeight}
                    fill={textFill}
                    fontFamily="ui-monospace, SFMono-Regular, monospace"
                  >
                    {op.symbol}
                  </text>
                  {/* Code label */}
                  <text x={opX - 2} y={y + (opH - 3) / 2 + 4} textAnchor="end" fontSize={7} fill="#94A3B8" fontFamily="monospace">
                    {op.code}
                  </text>
                  {/* Wire from op to mux */}
                  <line
                    x1={opX + opW}
                    y1={y + (opH - 3) / 2}
                    x2={muxX}
                    y2={y + (opH - 3) / 2}
                    stroke={isActive ? '#3B82F6' : '#CBD5E1'}
                    strokeWidth={isActive ? 1.5 : 0.8}
                  />
                  {/* Wire from SrcA/SrcB to op */}
                  <line
                    x1={35}
                    y1={y + (opH - 3) / 2}
                    x2={opX}
                    y2={y + (opH - 3) / 2}
                    stroke={isActive ? '#3B82F6' : '#CBD5E1'}
                    strokeWidth={isActive ? 1.5 : 0.8}
                  />
                </g>
              );
            })}

            {/* Vertical input lines */}
            <line x1={35} y1={20} x2={35} y2={muxY2 - 10} stroke="#CBD5E1" strokeWidth={0.8} />

            {/* MUX trapezoid */}
            <polygon
              points={`${muxX},${muxY1} ${muxX + 15},${muxY1 + 12} ${muxX + 15},${muxY2 - 12} ${muxX},${muxY2}`}
              fill={activeIdx >= 0 ? '#EFF6FF' : '#F8FAFC'}
              stroke={activeIdx >= 0 ? '#3B82F6' : '#CBD5E1'}
              strokeWidth={activeIdx >= 0 ? 1.5 : 1}
            />

            {/* MUX label */}
            <text x={muxX + 7} y={100 + 4} textAnchor="middle" fontSize={8} fill="#64748B" fontFamily="monospace" writingMode="tb">MUX</text>

            {/* Output wire */}
            <line
              x1={muxX + 15}
              y1={outY}
              x2={outX}
              y2={outY}
              stroke={activeIdx >= 0 ? '#3B82F6' : '#CBD5E1'}
              strokeWidth={activeIdx >= 0 ? 1.5 : 1}
            />
            <text x={outX + 2} y={outY + 4} fontSize={8} fill="#64748B" fontFamily="monospace">ALUResult</text>

            {/* ALUControl input */}
            <line x1={muxMidX} y1={muxY2 - 4} x2={muxMidX} y2={196} stroke="#F59E0B" strokeWidth={1.2} />
            <text x={muxMidX - 2} y={svgH - 2} textAnchor="middle" fontSize={7.5} fill="#92400E" fontFamily="monospace">ALUCtrl[3:0]</text>

            {/* Active highlight for selected line in MUX */}
            {activeIdx >= 0 && (
              <circle
                cx={muxX + 7}
                cy={opY(activeIdx) + (opH - 3) / 2}
                r={3}
                fill="#3B82F6"
              />
            )}
          </svg>

          {/* Legend */}
          <div className="mt-1 flex flex-wrap gap-2">
            {ALU_OPS.map(op => (
              <span
                key={op.code}
                className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                  op.code === alucontrol
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {op.code}={op.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

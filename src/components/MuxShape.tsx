import type { MuxDef } from '../data/moduleLayout';

interface Props { mux: MuxDef; isActive: boolean; }

export function MuxShape({ mux, isActive }: Props) {
  const { x, y, width, height } = mux;
  const inset = height * 0.18;
  const pts = `${x},${y} ${x+width},${y+inset} ${x+width},${y+height-inset} ${x},${y+height}`;

  return (
    <g style={{ filter: isActive ? 'drop-shadow(0 2px 6px rgba(59,130,246,0.2))' : 'none', transition: 'filter 0.25s' }}>
      <polygon points={pts}
        fill={isActive ? '#eff6ff' : '#f8fafc'}
        stroke={isActive ? '#3b82f6' : '#e2e8f0'}
        strokeWidth={isActive ? 1.5 : 1}
        style={{ transition: 'fill 0.2s, stroke 0.2s' }} />
      <text x={x + width / 2} y={y + height / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill={isActive ? '#3b82f6' : '#cbd5e1'} fontSize={6.5}
        fontFamily="monospace">
        MUX
      </text>
    </g>
  );
}

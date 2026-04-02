import type { MuxDef } from '../data/moduleLayout';

interface Props { mux: MuxDef; isActive: boolean; }

export function MuxShape({ mux, isActive }: Props) {
  const { x, y, width, height } = mux;
  const inset = height * 0.18;
  const pts = `${x},${y} ${x+width},${y+inset} ${x+width},${y+height-inset} ${x},${y+height}`;

  return (
    <g style={{ filter: isActive ? 'drop-shadow(0 0 4px #3b82f6)' : 'none', transition: 'filter 0.3s' }}>
      <polygon points={pts}
        fill={isActive ? '#0c1e36' : '#090f1a'}
        stroke={isActive ? '#3b82f6' : '#1e3a5f'}
        strokeWidth={isActive ? 1.5 : 1}
        style={{ transition: 'fill 0.25s, stroke 0.25s' }} />
      <text x={x + width / 2} y={y + height / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill={isActive ? '#60a5fa' : '#1e3a5f'} fontSize={6.5} fontFamily="monospace">
        MUX
      </text>
    </g>
  );
}

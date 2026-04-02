import type { WireDef } from '../data/wireLayout';

interface Props {
  wire: WireDef; isActive: boolean; value?: string; animKey: number;
}

export function Wire({ wire, isActive, value, animKey }: Props) {
  const { points, mid, kind } = wire;
  const DATA = '#3b82f6', CTRL = '#f97316', OFF = '#1a2535';

  const color = isActive ? (kind === 'control' ? CTRL : DATA) : OFF;
  const cls   = isActive ? (kind === 'control' ? 'wire-ctrl' : 'wire-data') : 'wire-off';

  // arrow direction from last two points
  const pts = points.trim().split(/\s+/).map(p => p.split(',').map(Number));
  const n = pts.length;
  let angle = 0;
  if (n >= 2) {
    const [ax, ay] = pts[n-2], [bx, by] = pts[n-1];
    angle = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
  }
  const [ex, ey] = pts[n-1] ?? [0, 0];

  const text = value ? `${value}` : wire.label;
  const bw = text.length * 5.4 + 6;

  return (
    <g>
      <polyline key={`${wire.id}-${animKey}`}
        points={points} fill="none"
        stroke={color} strokeWidth={isActive ? 2 : 1.2}
        strokeLinecap="round" strokeLinejoin="round"
        className={cls}
        style={{ transition: 'stroke 0.25s' }} />

      {isActive && (
        <polygon points="-4,-2.5 0,0 -4,2.5"
          fill={color}
          transform={`translate(${ex},${ey}) rotate(${angle})`} />
      )}

      {isActive && (
        <g transform={`translate(${mid[0] - bw/2}, ${mid[1] - 9})`}>
          <rect x={0} y={0} width={bw} height={12} rx={3}
            fill={kind === 'control' ? '#1a0c00' : '#071222'}
            stroke={color} strokeWidth={0.7} opacity={0.95} />
          <text x={bw/2} y={6.5}
            textAnchor="middle" dominantBaseline="middle"
            fill={kind === 'control' ? '#fdba74' : '#93c5fd'}
            fontSize={7} fontFamily="monospace">
            {text}
          </text>
        </g>
      )}
    </g>
  );
}

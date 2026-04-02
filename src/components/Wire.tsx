import type { WireDef } from '../data/wireLayout';

interface Props {
  wire: WireDef; isActive: boolean; value?: string; animKey: number;
}

export function Wire({ wire, isActive, value, animKey }: Props) {
  const { points, mid, kind } = wire;

  // Light-mode wire colors
  const DATA_ON  = '#2563eb';
  const CTRL_ON  = '#ea580c';
  const OFF      = '#e2e8f0';

  const color = isActive ? (kind === 'control' ? CTRL_ON : DATA_ON) : OFF;
  const cls   = isActive ? (kind === 'control' ? 'wire-ctrl' : 'wire-data') : 'wire-off';

  // Arrow direction
  const pts = points.trim().split(/\s+/).map(p => p.split(',').map(Number));
  const n = pts.length;
  let angle = 0;
  if (n >= 2) {
    const [ax, ay] = pts[n-2], [bx, by] = pts[n-1];
    angle = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
  }
  const [ex, ey] = pts[n-1] ?? [0, 0];

  const displayText = value ?? wire.label;
  const bw = displayText.length * 5.4 + 8;

  return (
    <g>
      <polyline key={`${wire.id}-${animKey}`}
        points={points} fill="none"
        stroke={color} strokeWidth={isActive ? 2 : 1.2}
        strokeLinecap="round" strokeLinejoin="round"
        className={cls}
        style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }} />

      {/* Arrowhead */}
      {isActive && (
        <polygon points="-4,-2.5 0,0 -4,2.5"
          fill={color}
          transform={`translate(${ex},${ey}) rotate(${angle})`} />
      )}

      {/* Value badge */}
      {isActive && (
        <g transform={`translate(${mid[0] - bw/2}, ${mid[1] - 9})`}>
          <rect x={0} y={0} width={bw} height={13} rx={3}
            fill="white"
            stroke={color} strokeWidth={0.8}
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))' }} />
          <text x={bw/2} y={6.5}
            textAnchor="middle" dominantBaseline="middle"
            fill={kind === 'control' ? '#c2410c' : '#1d4ed8'}
            fontSize={7} fontFamily="'SF Mono','Consolas',monospace" fontWeight="600">
            {displayText}
          </text>
        </g>
      )}
    </g>
  );
}

import type { ModuleDef } from '../data/moduleLayout';

interface Props { module: ModuleDef; isActive: boolean; }

export function Module({ module, isActive }: Props) {
  const { x, y, width, height, label, isControl } = module;

  const fill   = isActive ? (isControl ? '#eef2ff' : '#eff6ff') : '#ffffff';
  const stroke = isActive ? (isControl ? '#6366f1' : '#3b82f6') : '#e2e8f0';
  const text   = isActive ? (isControl ? '#4338ca' : '#1d4ed8') : '#94a3b8';

  return (
    <g style={{ filter: isActive ? 'drop-shadow(0 2px 8px rgba(59,130,246,0.2))' : 'none', transition: 'filter 0.25s' }}>
      <rect x={x} y={y} width={width} height={height} rx={5}
        fill={fill} stroke={stroke} strokeWidth={isActive ? 1.5 : 1}
        style={{ transition: 'fill 0.2s, stroke 0.2s' }} />
      <text x={x + width / 2} y={y + height / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill={text} fontSize={11}
        fontFamily="'SF Mono','Consolas','Courier New',monospace"
        fontWeight={isActive ? '700' : '500'}
        style={{ transition: 'fill 0.2s' }}>
        {label}
      </text>
    </g>
  );
}

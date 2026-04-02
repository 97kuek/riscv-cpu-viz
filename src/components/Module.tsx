import type { ModuleDef } from '../data/moduleLayout';

interface Props { module: ModuleDef; isActive: boolean; }

export function Module({ module, isActive }: Props) {
  const { x, y, width, height, label, isControl } = module;

  const stroke = isActive
    ? isControl ? '#a78bfa' : '#60a5fa'
    : isControl ? '#3b2a6e' : '#1e3a5f';
  const fill = isActive
    ? isControl ? '#1a1040' : '#0c1e36'
    : isControl ? '#11092a' : '#0a1524';
  const text = isActive
    ? isControl ? '#ddd6fe' : '#bfdbfe'
    : isControl ? '#6d28d9' : '#1e40af';

  return (
    <g style={{ filter: isActive ? `drop-shadow(0 0 5px ${isControl ? '#7c3aed' : '#3b82f6'})` : 'none', transition: 'filter 0.3s' }}>
      <rect x={x} y={y} width={width} height={height} rx={4}
        fill={fill} stroke={stroke} strokeWidth={isActive ? 1.5 : 1}
        style={{ transition: 'fill 0.25s, stroke 0.25s' }} />
      <text x={x + width / 2} y={y + height / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill={text} fontSize={11} fontFamily="monospace" fontWeight="600"
        style={{ transition: 'fill 0.25s' }}>
        {label}
      </text>
    </g>
  );
}

import type { ModuleDef } from '../data/types';

interface Props {
  def: ModuleDef;
  isActive: boolean;
}

export default function Module({ def, isActive }: Props) {
  const { x, y, width: w, height: h, label } = def;

  const fill = isActive ? '#EFF6FF' : 'white';
  const stroke = isActive ? '#3B82F6' : '#CBD5E1';
  const strokeWidth = isActive ? 2 : 1.5;
  const fontWeight = isActive ? 600 : 500;
  const color = isActive ? '#1E293B' : '#64748B';

  // Split label on \n for multi-line
  const lines = label.split('\n');

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {lines.map((line, i) => {
        const totalLines = lines.length;
        const lineHeight = 13;
        const offsetY = (i - (totalLines - 1) / 2) * lineHeight;
        return (
          <text
            key={i}
            x={x + w / 2}
            y={y + h / 2 + offsetY + 4}
            textAnchor="middle"
            fontSize={12}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            fontWeight={fontWeight}
            fill={color}
          >
            {line}
          </text>
        );
      })}
    </g>
  );
}

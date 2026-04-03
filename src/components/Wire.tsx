import type { WireDef } from '../data/types';

interface Props {
  def: WireDef;
  isActive: boolean;
  signalValue?: string;
}

export default function Wire({ def, isActive, signalValue }: Props) {
  const { points, labelPos, kind } = def;

  const pointsStr = points.map(([x, y]) => `${x},${y}`).join(' ');

  let stroke = '#94A3B8';
  let strokeWidth = 1.5;
  let markerId = 'arrow-inactive';

  if (isActive) {
    if (kind === 'data') {
      stroke = '#3B82F6';
      strokeWidth = 2;
      markerId = 'arrow-data';
    } else {
      stroke = '#F59E0B';
      strokeWidth = 1.5;
      markerId = 'arrow-control';
    }
  }

  return (
    <g>
      <polyline
        points={pointsStr}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        markerEnd={`url(#${markerId})`}
      />
      {isActive && signalValue && (
        <g>
          <rect
            x={labelPos[0] - 4}
            y={labelPos[1] - 9}
            width={signalValue.length * 6 + 8}
            height={13}
            rx={3}
            fill="white"
            stroke={kind === 'data' ? '#BFDBFE' : '#FDE68A'}
            strokeWidth={0.8}
          />
          <text
            x={labelPos[0]}
            y={labelPos[1]}
            fontSize={8.5}
            fontWeight={600}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            fill={kind === 'data' ? '#1D4ED8' : '#92400E'}
          >
            {signalValue}
          </text>
        </g>
      )}
    </g>
  );
}

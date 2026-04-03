import type { SignalSnapshot } from '../data/types';
import { modules, muxes, wires } from '../data/layout';
import Module from './Module';
import Wire from './Wire';

interface Props {
  snapshot: SignalSnapshot;
}

function getMuxSelection(snapshot: SignalSnapshot, key: string): '0' | '1' | undefined {
  const sig = snapshot.signalValues.find(s => s.label === key);
  if (!sig) return undefined;
  return sig.value.startsWith('0') ? '0' : '1';
}

export default function CpuDiagram({ snapshot }: Props) {
  const activeWireSet = new Set(snapshot.activeWires);
  const activeModuleSet = new Set(snapshot.activeModules);

  // Build signal value map: label → value
  const signalValueMap = new Map<string, string>();
  snapshot.signalValues.forEach(sv => {
    signalValueMap.set(sv.label, sv.value);
  });

  // MUX selection states
  const aluSrcSel = getMuxSelection(snapshot, 'ALUSrc');
  const memToRegSel = getMuxSelection(snapshot, 'MemToReg');
  const pcSrcSel = getMuxSelection(snapshot, 'PCSrc');

  // Check if a mux is active
  function isMuxActive(muxId: string): boolean {
    if (muxId === 'mux_srcb') return activeModuleSet.has('mux_srcb');
    if (muxId === 'mux_res') return activeModuleSet.has('mux_res');
    if (muxId === 'mux_pc') return activeModuleSet.has('mux_pc');
    return false;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 860 480"
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Arrow markers */}
          <marker
            id="arrow-data"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="#3B82F6" />
          </marker>
          <marker
            id="arrow-control"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="#F59E0B" />
          </marker>
          <marker
            id="arrow-inactive"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="#CBD5E1" />
          </marker>
        </defs>

        {/* Background */}
        <rect x={0} y={0} width={860} height={480} fill="#F8FAFC" />

        {/* Controller region */}
        <rect
          x={8}
          y={8}
          width={844}
          height={76}
          rx={8}
          fill="#FAF5FF"
          stroke="#E9D5FF"
          strokeWidth={1}
        />
        <text x={18} y={22} fontSize={9} fill="#9333EA" fontWeight={600} fontFamily="ui-monospace, monospace" letterSpacing={1}>
          CONTROLLER
        </text>

        {/* Datapath region */}
        <rect
          x={8}
          y={88}
          width={844}
          height={384}
          rx={8}
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth={1}
        />
        <text x={18} y={102} fontSize={9} fill="#94A3B8" fontWeight={600} fontFamily="ui-monospace, monospace" letterSpacing={1}>
          DATAPATH
        </text>

        {/* Wires (render below modules) */}
        {wires.map(wire => (
          <Wire
            key={wire.id}
            def={wire}
            isActive={activeWireSet.has(wire.id)}
            signalValue={
              activeWireSet.has(wire.id) && wire.signalKey
                ? signalValueMap.get(wire.signalKey)
                : undefined
            }
          />
        ))}

        {/* Junction dots at wire branch points */}
        {/* PC to both pcadd4 and imem branch */}
        {activeWireSet.has('w-pc-imem') && activeWireSet.has('w-pc-add4') && (
          <circle cx={68} cy={244} r={3} fill="#3B82F6" />
        )}
        {/* RD2 branch to writedata and mux_srcb */}
        {activeWireSet.has('w-rd2') && activeWireSet.has('w-writedata') && (
          <circle cx={362} cy={252} r={3} fill="#3B82F6" />
        )}
        {/* ALU output branch to dmem and alures */}
        {activeWireSet.has('w-aluout') && activeWireSet.has('w-alures') && (
          <circle cx={540} cy={251} r={3} fill="#3B82F6" />
        )}
        {/* RegWrite / ALUSrc branch */}
        {activeWireSet.has('w-regwrite') && activeWireSet.has('w-alusrc') && (
          <circle cx={415} cy={90} r={3} fill="#F59E0B" />
        )}

        {/* MUX shapes */}
        {muxes.map(mux => {
          const active = isMuxActive(mux.id);
          const fill = active ? '#EFF6FF' : 'white';
          const stroke = active ? '#3B82F6' : '#CBD5E1';
          const strokeWidth = active ? 2 : 1.5;

          if (mux.id === 'mux_srcb') {
            // Trapezoid: wider on left, narrower on right
            return (
              <g key={mux.id}>
                <polygon
                  points="390,218 412,230 412,282 390,294"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
                <text x={399} y={258} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  M
                </text>
                <text x={399} y={268} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  U
                </text>
                <text x={399} y={278} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  X
                </text>
                {aluSrcSel !== undefined && (
                  <g>
                    <circle cx={390} cy={252} r={3.5}
                      fill={aluSrcSel === '0' ? '#3B82F6' : 'white'}
                      stroke="#3B82F6" strokeWidth={1.5} />
                    <circle cx={390} cy={278} r={3.5}
                      fill={aluSrcSel === '1' ? '#3B82F6' : 'white'}
                      stroke="#3B82F6" strokeWidth={1.5} />
                    <text x={386} y={249} textAnchor="end" fontSize={7} fill="#94A3B8" fontFamily="monospace">0</text>
                    <text x={386} y={281} textAnchor="end" fontSize={7} fill="#94A3B8" fontFamily="monospace">1</text>
                  </g>
                )}
              </g>
            );
          }

          if (mux.id === 'mux_res') {
            return (
              <g key={mux.id}>
                <polygon
                  points="698,216 720,228 720,280 698,292"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
                <text x={707} y={254} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  M
                </text>
                <text x={707} y={264} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  U
                </text>
                <text x={707} y={274} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  X
                </text>
                {memToRegSel !== undefined && (
                  <g>
                    <circle cx={698} cy={228} r={3.5}
                      fill={memToRegSel === '0' ? '#3B82F6' : 'white'}
                      stroke="#3B82F6" strokeWidth={1.5} />
                    <circle cx={698} cy={254} r={3.5}
                      fill={memToRegSel === '1' ? '#3B82F6' : 'white'}
                      stroke="#3B82F6" strokeWidth={1.5} />
                    <text x={694} y={225} textAnchor="end" fontSize={7} fill="#94A3B8" fontFamily="monospace">0</text>
                    <text x={694} y={257} textAnchor="end" fontSize={7} fill="#94A3B8" fontFamily="monospace">1</text>
                  </g>
                )}
              </g>
            );
          }

          if (mux.id === 'mux_pc') {
            // Vertical MUX on left side
            return (
              <g key={mux.id}>
                <polygon
                  points="10,338 32,350 32,414 10,426"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
                <text x={19} y={381} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  M
                </text>
                <text x={19} y={391} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  U
                </text>
                <text x={19} y={401} textAnchor="middle" fontSize={8} fill={active ? '#1D4ED8' : '#94A3B8'} fontFamily="monospace">
                  X
                </text>
                {pcSrcSel !== undefined && (
                  <g>
                    <circle cx={10} cy={358} r={3.5}
                      fill={pcSrcSel === '0' ? '#3B82F6' : 'white'}
                      stroke="#3B82F6" strokeWidth={1.5} />
                    <circle cx={10} cy={402} r={3.5}
                      fill={pcSrcSel === '1' ? '#3B82F6' : 'white'}
                      stroke="#3B82F6" strokeWidth={1.5} />
                    <text x={14} y={355} fontSize={7} fill="#94A3B8" fontFamily="monospace">0</text>
                    <text x={14} y={405} fontSize={7} fill="#94A3B8" fontFamily="monospace">1</text>
                  </g>
                )}
              </g>
            );
          }

          return null;
        })}

        {/* Module boxes */}
        {modules.map(mod => (
          <Module
            key={mod.id}
            def={mod}
            isActive={activeModuleSet.has(mod.id)}
          />
        ))}

        {/* Port labels */}
        {/* Regfile ports */}
        <text x={232} y={216} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="monospace">A1</text>
        <text x={232} y={240} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="monospace">A2</text>
        <text x={232} y={293} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="monospace">A3</text>
        <text x={333} y={216} fontSize={8} fill="#94A3B8" fontFamily="monospace">RD1</text>
        <text x={333} y={252} fontSize={8} fill="#94A3B8" fontFamily="monospace">RD2</text>
        <text x={232} y={165} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="monospace">WD3</text>

        {/* ALU ports */}
        <text x={430} y={228} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="monospace">A</text>
        <text x={430} y={260} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="monospace">B</text>
        <text x={514} y={255} fontSize={8} fill="#94A3B8" fontFamily="monospace">Y</text>

        {/* Dmem ports */}
        <text x={558} y={233} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="monospace">A</text>
        <text x={558} y={271} textAnchor="end" fontSize={8} fill="#94A3B8" fontFamily="monospace">WD</text>
        <text x={642} y={240} fontSize={8} fill="#94A3B8" fontFamily="monospace">RD</text>

        {/* ImmExt output label */}
        <text x={333} y={393} fontSize={8} fill="#94A3B8" fontFamily="monospace">Ext</text>

        {/* Stage indicator at top right */}
        <rect x={760} y={92} width={86} height={20} rx={4} fill="white" stroke="#E2E8F0" strokeWidth={1} />
        <text x={803} y={105} textAnchor="middle" fontSize={9} fill="#64748B" fontFamily="ui-monospace, monospace" fontWeight={600}>
          {snapshot.stage.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

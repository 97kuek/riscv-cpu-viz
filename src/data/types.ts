export type Stage = 'fetch' | 'decode' | 'execute' | 'memory' | 'writeback';
export type WireKind = 'data' | 'control';
export type InstrType = 'R' | 'I' | 'S' | 'B';

export interface SignalSnapshot {
  stage: Stage;
  activeWires: string[];
  activeModules: string[];
  signalValues: { label: string; value: string; kind: WireKind }[];
  description: string;
}

export interface InstructionSimulation {
  id: string;
  instruction: string;
  type: InstrType;
  encoding: string;
  meaning: string;
  stages: SignalSnapshot[];
}

export interface ModuleDef {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MuxDef {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WireDef {
  id: string;
  label: string;
  kind: WireKind;
  points: [number, number][];
  labelPos: [number, number];
}

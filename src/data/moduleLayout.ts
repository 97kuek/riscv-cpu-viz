export interface ModuleDef {
  id: string;
  label: string;
  x: number; y: number; width: number; height: number;
  isControl?: boolean;
}

export interface MuxDef {
  id: string;
  x: number; y: number; width: number; height: number;
}

// viewBox: 0 0 900 500
// Controller: y 14..86  |  Datapath: y 96..490

export const modules: ModuleDef[] = [
  // Controller
  { id: 'maindec', label: 'maindec', x: 395, y: 18, width: 118, height: 64, isControl: true },
  { id: 'aludec',  label: 'aludec',  x: 564, y: 18, width: 100, height: 64, isControl: true },

  // Datapath
  { id: 'pc',      label: 'PC',      x:  48, y: 255, width:  62, height: 52 },
  { id: 'imem',    label: 'imem',    x: 142, y: 225, width:  80, height: 116 },
  { id: 'regfile', label: 'regfile', x: 268, y: 204, width: 100, height: 152 },
  { id: 'immext',  label: 'immext',  x: 268, y: 394, width: 100, height: 42  },
  { id: 'alu',     label: 'ALU',     x: 462, y: 218, width:  80, height: 116 },
  { id: 'dmem',    label: 'dmem',    x: 600, y: 208, width:  86, height: 126 },
  { id: 'pcadd4',  label: '+4',      x:  48, y: 374, width:  62, height: 32  },
  { id: 'pcaddbr', label: '+imm',    x:  48, y: 420, width:  62, height: 32  },
];

export const muxes: MuxDef[] = [
  { id: 'mux-srcb',   x: 428, y: 244, width: 24, height: 80 },
  { id: 'mux-result', x: 748, y: 234, width: 24, height: 80 },
  { id: 'mux-pc',     x:  12, y: 368, width: 24, height: 92 },
];

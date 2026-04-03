import type { ModuleDef, MuxDef, WireDef } from './types';

// viewBox: 0 0 860 480
// Controller region: y=8..84
// Datapath region: y=88..472

export const modules: ModuleDef[] = [
  // Controller
  { id: 'maindec',  label: 'Main\nDecoder', x: 360, y: 20,  width: 110, height: 54 },
  { id: 'aludec',   label: 'ALU\nDecoder',  x: 530, y: 20,  width: 90,  height: 54 },

  // Datapath
  { id: 'pc',       label: 'PC',            x: 30,  y: 220, width: 56,  height: 48 },
  { id: 'imem',     label: 'Instr\nMem',    x: 120, y: 196, width: 76,  height: 100 },
  { id: 'regfile',  label: 'Register\nFile', x: 234, y: 180, width: 96,  height: 144 },
  { id: 'immext',   label: 'Imm\nExt',      x: 234, y: 370, width: 96,  height: 40 },
  { id: 'alu',      label: 'ALU',           x: 432, y: 196, width: 80,  height: 110 },
  { id: 'dmem',     label: 'Data\nMem',     x: 560, y: 188, width: 80,  height: 116 },
  { id: 'pcadd4',   label: 'PC+4',          x: 30,  y: 344, width: 56,  height: 28 },
  { id: 'pcaddbr',  label: 'PC+Imm',        x: 30,  y: 388, width: 56,  height: 28 },
];

export const muxes: MuxDef[] = [
  { id: 'mux_srcb', x: 390, y: 218, width: 22, height: 76 },
  { id: 'mux_res',  x: 698, y: 216, width: 22, height: 76 },
  { id: 'mux_pc',   x: 10,  y: 338, width: 22, height: 88 },
];

// Wire definitions - right-angle paths connecting modules
export const wires: WireDef[] = [
  // ─── DATA wires ───

  // PC output → instruction memory input
  {
    id: 'w-pc-imem',
    label: 'PC[31:0]',
    kind: 'data',
    points: [[86, 244], [120, 244]],
    labelPos: [100, 238],
    signalKey: 'PC',
  },

  // Instruction memory → regfile (rs1)
  {
    id: 'w-rs1',
    label: 'rs1[4:0]',
    kind: 'data',
    points: [[196, 218], [214, 218], [214, 212], [234, 212]],
    labelPos: [208, 208],
  },

  // Instruction memory → regfile (rs2)
  {
    id: 'w-rs2',
    label: 'rs2[4:0]',
    kind: 'data',
    points: [[196, 236], [218, 236], [218, 236], [234, 236]],
    labelPos: [208, 230],
  },

  // Instruction memory → regfile (rd / write dest)
  {
    id: 'w-rd',
    label: 'rd[4:0]',
    kind: 'data',
    points: [[196, 256], [222, 256], [222, 290], [234, 290]],
    labelPos: [208, 252],
  },

  // Instruction memory → immext (immediate field)
  {
    id: 'w-imm',
    label: 'imm',
    kind: 'data',
    points: [[196, 272], [226, 272], [226, 390], [234, 390]],
    labelPos: [210, 340],
  },

  // Regfile RD1 → ALU srcA
  {
    id: 'w-srca',
    label: 'SrcA',
    kind: 'data',
    points: [[330, 216], [380, 216], [380, 224], [432, 224]],
    labelPos: [355, 210],
    signalKey: 'SrcA',
  },

  // Regfile RD2 → mux_srcb (and dmem write data)
  {
    id: 'w-rd2',
    label: 'RD2',
    kind: 'data',
    points: [[330, 252], [362, 252], [362, 252], [390, 252]],
    labelPos: [354, 246],
  },

  // RD2 branch to dmem (write data)
  {
    id: 'w-writedata',
    label: 'WriteData',
    kind: 'data',
    points: [[362, 252], [362, 268], [560, 268]],
    labelPos: [440, 262],
    signalKey: 'WriteData',
  },

  // ImmExt output → mux_srcb lower input
  {
    id: 'w-immext',
    label: 'Ext',
    kind: 'data',
    points: [[330, 390], [374, 390], [374, 278], [390, 278]],
    labelPos: [360, 350],
    signalKey: 'ImmExt',
  },

  // mux_srcb output → ALU srcB
  {
    id: 'w-srcb',
    label: 'SrcB',
    kind: 'data',
    points: [[412, 256], [432, 256]],
    labelPos: [421, 248],
    signalKey: 'SrcB',
  },

  // ALU output → dmem address input
  {
    id: 'w-aluout',
    label: 'ALUResult',
    kind: 'data',
    points: [[512, 251], [540, 251], [540, 230], [560, 230]],
    labelPos: [524, 245],
    // no signalKey: shown on w-alures instead to avoid duplicate labels
  },

  // ALU result bypass → mux_res input 0 (MemToReg=0 selects this)
  // Routes ABOVE Data Mem to avoid overlap
  {
    id: 'w-alures',
    label: 'ALURes',
    kind: 'data',
    points: [[512, 251], [545, 251], [545, 180], [714, 180], [714, 228], [698, 228]],
    labelPos: [630, 174],
    signalKey: 'ALUResult',
  },

  // Data memory read data → mux_res input 1 (MemToReg=1 selects this)
  {
    id: 'w-readdata',
    label: 'ReadData',
    kind: 'data',
    points: [[640, 236], [672, 236], [672, 254], [698, 254]],
    labelPos: [655, 247],
    signalKey: 'ReadData',
  },

  // mux_res output → writeback result
  {
    id: 'w-result',
    label: 'Result',
    kind: 'data',
    points: [[720, 254], [750, 254], [750, 160], [282, 160], [282, 180]],
    labelPos: [740, 168],
    signalKey: 'Result',
  },

  // PC+4 → mux_pc
  {
    id: 'w-pcadd4',
    label: 'PC+4',
    kind: 'data',
    points: [[30, 358], [10, 358]],
    labelPos: [18, 352],
  },

  // PC+Imm → mux_pc
  {
    id: 'w-pcaddbr',
    label: 'PC+Imm',
    kind: 'data',
    points: [[30, 402], [10, 402]],
    labelPos: [12, 396],
  },

  // mux_pc → PC input
  {
    id: 'w-pcnext',
    label: 'PCNext',
    kind: 'data',
    points: [[21, 338], [21, 200], [30, 200], [30, 220]],
    labelPos: [26, 210],
  },

  // PC to pcadd4 (PC value feed)
  {
    id: 'w-pc-add4',
    label: 'PC',
    kind: 'data',
    points: [[58, 230], [68, 230], [68, 358], [86, 358]],
    labelPos: [72, 290],
  },

  // ─── CONTROL wires ───

  // Instruction memory → maindec (opcode)
  {
    id: 'w-op',
    label: 'op[6:0]',
    kind: 'control',
    points: [[196, 206], [210, 206], [210, 47], [360, 47]],
    labelPos: [270, 41],
  },

  // Instruction memory → aludec (funct3)
  {
    id: 'w-funct3',
    label: 'funct3',
    kind: 'control',
    points: [[196, 214], [206, 214], [206, 35], [530, 35]],
    labelPos: [360, 29],
  },

  // Instruction memory → aludec (funct7)
  {
    id: 'w-funct7',
    label: 'funct7',
    kind: 'control',
    points: [[196, 222], [202, 222], [202, 24], [530, 24]],
    labelPos: [360, 18],
  },

  // maindec → regfile (RegWrite)
  {
    id: 'w-regwrite',
    label: 'RegWrite',
    kind: 'control',
    points: [[415, 74], [415, 90], [282, 90], [282, 180]],
    labelPos: [340, 85],
  },

  // maindec → mux_srcb (ALUSrc)
  {
    id: 'w-alusrc',
    label: 'ALUSrc',
    kind: 'control',
    points: [[415, 74], [415, 90], [401, 90], [401, 218]],
    labelPos: [406, 150],
  },

  // maindec → dmem (MemWrite)
  {
    id: 'w-memwrite',
    label: 'MemWrite',
    kind: 'control',
    points: [[470, 74], [470, 100], [600, 100], [600, 188]],
    labelPos: [535, 95],
  },

  // maindec → mux_res (MemToReg)
  {
    id: 'w-memtoreg',
    label: 'MemToReg',
    kind: 'control',
    points: [[450, 74], [450, 95], [709, 95], [709, 216]],
    labelPos: [580, 89],
  },

  // maindec → aludec (ALUOp)
  {
    id: 'w-aluop',
    label: 'ALUOp',
    kind: 'control',
    points: [[470, 47], [530, 47]],
    labelPos: [498, 41],
  },

  // aludec → ALU (ALUControl)
  {
    id: 'w-alucontrol',
    label: 'ALUCtrl',
    kind: 'control',
    points: [[575, 74], [575, 120], [512, 120], [512, 196]],
    labelPos: [540, 115],
    signalKey: 'ALUCtrl',
  },

  // ALU zero/branch → pcsrc logic → mux_pc
  {
    id: 'w-btaken',
    label: 'Branch',
    kind: 'control',
    points: [[472, 306], [472, 330], [21, 330], [21, 338]],
    labelPos: [246, 325],
  },

  // PCSrc control → mux_pc selector
  {
    id: 'w-pcsrc',
    label: 'PCSrc',
    kind: 'control',
    points: [[435, 74], [435, 86], [2, 86], [2, 382], [10, 382]],
    labelPos: [220, 81],
  },
];

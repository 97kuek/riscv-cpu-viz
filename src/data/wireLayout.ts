export type WireKind = 'data' | 'control';
export interface WireDef {
  id: string; label: string; kind: WireKind;
  points: string;
  mid: [number, number];
}

// viewBox 900 × 500
// Coord reference (x, y):
//  pc:       48,255  w62 h52   → R(110,281)
//  imem:     142,225 w80 h116  → L(142,283) R(222,283) Bot(182,341)
//  regfile:  268,204 w100 h152 → L-rs1(268,230) L-rs2(268,280) L-rd(268,332)
//                                R-rd1(368,238) R-rd2(368,290)
//  immext:   268,394 w100 h42  → R(368,415)
//  alu:      462,218 w80 h116  → L-A(462,260) L-B(462,302) R(542,276) Bot(502,334)
//  dmem:     600,208 w86 h126  → L-A(600,258) L-WD(600,298) R(686,258)
//  maindec:  395,18  w118 h64  → L(395,50) Bot-* distributed
//  aludec:   564,18  w100 h64  → L(564,50) Bot(614,82)
//  mux-srcb: 428,244 w24 h80   → L0(428,264) L1(428,312) R(452,284)
//  mux-result:748,234 w24 h80  → L0(748,254) L1(748,302) R(772,274)
//  mux-pc:   12,368  w24 h92   → T(24,368) Bot(24,460) R(36,414)
//  pcadd4:   48,374  w62 h32   → R(110,390)
//  pcaddbr:  48,420  w62 h32   → R(110,436)

export const wires: WireDef[] = [
  // PC → imem
  { id: 'w-pc-imem', label: 'PC', kind: 'data',
    points: '110,281 142,281', mid: [126,275] },

  // imem → regfile (instruction fields)
  { id: 'w-rs1', label: 'rs1', kind: 'data',
    points: '222,262 246,262 246,230 268,230', mid: [246,248] },
  { id: 'w-rs2', label: 'rs2', kind: 'data',
    points: '222,283 248,283 248,280 268,280', mid: [248,278] },
  { id: 'w-rd',  label: 'rd',  kind: 'data',
    points: '222,304 250,304 250,332 268,332', mid: [250,318] },

  // imem → immext
  { id: 'w-imm-raw', label: 'imm', kind: 'data',
    points: '182,341 182,400 268,400 268,415', mid: [225,400] },

  // instruction → controller (control path goes up)
  { id: 'w-op',     label: 'op[6:0]',     kind: 'control',
    points: '222,268 256,268 256,132 368,132 368,50 395,50',
    mid: [310,132] },
  { id: 'w-funct3', label: 'funct3',       kind: 'control',
    points: '222,278 258,278 258,116 535,116 535,50 564,50',
    mid: [396,116] },
  { id: 'w-funct7', label: 'funct7',       kind: 'control',
    points: '222,292 260,292 260,100 648,100 648,50 664,50',
    mid: [464,100] },

  // maindec → datapath (control signals)
  { id: 'w-regwrite',  label: 'regwrite',  kind: 'control',
    points: '395,42 316,42 316,204', mid: [355,42] },
  { id: 'w-alusrc',    label: 'alusrc',    kind: 'control',
    points: '432,82 432,164 440,164 440,244', mid: [432,164] },
  { id: 'w-memwrite',  label: 'memwrite',  kind: 'control',
    points: '460,82 460,172 643,172 643,208', mid: [552,172] },
  { id: 'w-memtoreg',  label: 'memtoreg', kind: 'control',
    points: '484,82 484,180 760,180 760,234', mid: [622,180] },
  { id: 'w-pcsrc',     label: 'pcsrc',    kind: 'control',
    points: '395,60 24,60 24,368', mid: [210,60] },

  // maindec → aludec
  { id: 'w-aluop', label: 'aluop', kind: 'control',
    points: '513,50 564,50', mid: [538,44] },

  // aludec → ALU
  { id: 'w-alucontrol', label: 'aluctl', kind: 'control',
    points: '614,82 614,198 502,198 502,218', mid: [560,198] },

  // regfile → ALU
  { id: 'w-srca', label: 'srca', kind: 'data',
    points: '368,238 412,238 412,260 462,260', mid: [412,244] },
  { id: 'w-rd2-mux', label: 'rd2', kind: 'data',
    points: '368,290 400,290 400,312 428,312', mid: [400,300] },

  // rd2 → dmem writedata
  { id: 'w-rd2', label: 'wdata', kind: 'data',
    points: '400,290 400,354 576,354 576,298 600,298', mid: [488,354] },

  // immext → srcb mux
  { id: 'w-immext', label: 'imm', kind: 'data',
    points: '368,415 418,415 418,328 428,328', mid: [418,415] },

  // srcb mux → ALU
  { id: 'w-srcb', label: 'srcb', kind: 'data',
    points: '452,284 462,284 462,302', mid: [456,290] },

  // ALU → dmem addr
  { id: 'w-aluout', label: 'aluout', kind: 'data',
    points: '542,276 570,276 570,258 600,258', mid: [558,270] },

  // ALU output → result mux (bypass)
  { id: 'w-aluout-result', label: 'aluout', kind: 'data',
    points: '570,276 570,374 728,374 728,254 748,254', mid: [650,374] },

  // btaken → pcsrc logic
  { id: 'w-btaken', label: 'btaken', kind: 'control',
    points: '502,334 502,472 24,472 24,460', mid: [263,472] },

  // dmem → result mux
  { id: 'w-readdata', label: 'rdata', kind: 'data',
    points: '686,258 716,258 716,302 748,302', mid: [700,278] },

  // result mux → regfile writeback
  { id: 'w-result', label: 'result', kind: 'data',
    points: '772,274 800,274 800,486 318,486 318,356', mid: [560,486] },

  // PC adders → mux-pc
  { id: 'w-pc-next0', label: 'PC+4',   kind: 'data',
    points: '110,390 36,390 36,388', mid: [73,386] },
  { id: 'w-pc-next1', label: 'PC+imm', kind: 'data',
    points: '110,436 36,436 36,440', mid: [73,440] },
  { id: 'w-pc-sel',   label: 'nextPC', kind: 'data',
    points: '36,414 48,414 48,307 48,281', mid: [36,350] },
];

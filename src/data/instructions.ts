export type Stage = 'fetch' | 'decode' | 'execute' | 'memory' | 'writeback';

export interface SignalSnapshot {
  stage: Stage;
  activeWires: string[];
  activeModules: string[];
  signalValues: Record<string, string>;
  description: string;
}

export interface InstructionSimulation {
  instruction: string;
  type: 'R' | 'I' | 'S' | 'B';
  encoding: string;
  meaning: string;
  stages: SignalSnapshot[];
}

// Initial register values: x0=0, x1=1, x2=5, x3=3, x4=0
// Memory: mem[5]=0xDEADBEEF (word at address 5*4=20)

export const instructions: InstructionSimulation[] = [
  // ──────────────────────────────────────────────────────────────────
  // ADD x1, x2, x3   (R型)
  // ──────────────────────────────────────────────────────────────────
  {
    instruction: 'add x1, x2, x3',
    type: 'R',
    encoding: '0000000_00011_00010_000_00001_0110011',
    meaning: 'x1 ← x2 + x3 = 5 + 3 = 8',
    stages: [
      {
        stage: 'fetch',
        activeWires: ['w-pc-imem'],
        activeModules: ['pc', 'imem'],
        signalValues: {
          PC: '0x00000000',
          instr: '0x003100B3',
        },
        description:
          '【Fetch】PC=0x00000000 を命令メモリ(imem)に送り、\nadd x1, x2, x3 の機械語 0x003100B3 を取得します。\n次のサイクルのために PC+4 が計算されます。',
      },
      {
        stage: 'decode',
        activeWires: ['w-instr-bus', 'w-rs1', 'w-rs2', 'w-rd', 'w-op', 'w-funct3', 'w-funct7',
                      'w-regwrite', 'w-alusrc', 'w-memwrite', 'w-memtoreg', 'w-pcsrc', 'w-aluop'],
        activeModules: ['imem', 'regfile', 'maindec', 'aludec'],
        signalValues: {
          'op[6:0]': '0110011 (R型)',
          'funct3': '000',
          'funct7': '0000000',
          regwrite: '1',
          alusrc: '0',
          memwrite: '0',
          memtoreg: '0',
          pcsrc: '0',
          aluop: '10',
          'rs1 (x2)': '0x00000005',
          'rs2 (x3)': '0x00000003',
        },
        description:
          '【Decode】命令をデコードします。\n・op=0110011 → R型命令\n・maindec: regwrite=1, alusrc=0 (レジスタ使用), memwrite=0, memtoreg=0\n・regfileからrs1=x2=5, rs2=x3=3 を読み出します。',
      },
      {
        stage: 'execute',
        activeWires: ['w-srca', 'w-rd2-mux', 'w-srcb', 'w-alucontrol', 'w-aluout', 'w-aluout-result', 'w-btaken'],
        activeModules: ['alu', 'aludec', 'mux-srcb'],
        signalValues: {
          alucontrol: '0000 (ADD)',
          srca: '0x00000005',
          srcb: '0x00000003',
          aluout: '0x00000008',
          btaken: '0',
        },
        description:
          '【Execute】ALU演算を行います。\n・aludec → alucontrol=0000 (ADD)\n・srca=x2=5, srcb=x3=3 (alusrc=0 なのでレジスタ値)\n・aluout = 5 + 3 = 8 = 0x00000008\n・beqでないのでbtaken=0',
      },
      {
        stage: 'memory',
        activeWires: [],
        activeModules: [],
        signalValues: {
          memwrite: '0 (書き込みなし)',
          aluout: '0x00000008',
        },
        description:
          '【Memory】R型命令はメモリアクセスしません。\n・memwrite=0 のためdmemへの書き込みは無効\n・このステージでは何も起こりません。',
      },
      {
        stage: 'writeback',
        activeWires: ['w-aluout-result', 'w-result'],
        activeModules: ['regfile', 'mux-result'],
        signalValues: {
          memtoreg: '0 (ALU結果を選択)',
          result: '0x00000008',
          'x1 (書き込み先)': '0x00000008',
        },
        description:
          '【Writeback】演算結果をレジスタに書き戻します。\n・memtoreg=0 → result muxはaluout=8を選択\n・result=0x00000008 → x1に書き込み\n・x1 の値が 1 → 8 に更新されます。',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // SUB x1, x2, x3   (R型)
  // ──────────────────────────────────────────────────────────────────
  {
    instruction: 'sub x1, x2, x3',
    type: 'R',
    encoding: '0100000_00011_00010_000_00001_0110011',
    meaning: 'x1 ← x2 - x3 = 5 - 3 = 2',
    stages: [
      {
        stage: 'fetch',
        activeWires: ['w-pc-imem'],
        activeModules: ['pc', 'imem'],
        signalValues: { PC: '0x00000004', instr: '0x403100B3' },
        description:
          '【Fetch】PC=0x00000004。imemから sub x1, x2, x3 の機械語 0x403100B3 を取得します。',
      },
      {
        stage: 'decode',
        activeWires: ['w-instr-bus', 'w-rs1', 'w-rs2', 'w-rd', 'w-op', 'w-funct3', 'w-funct7',
                      'w-regwrite', 'w-alusrc', 'w-memwrite', 'w-memtoreg', 'w-pcsrc', 'w-aluop'],
        activeModules: ['imem', 'regfile', 'maindec', 'aludec'],
        signalValues: {
          'op[6:0]': '0110011 (R型)',
          'funct3': '000',
          'funct7': '0100000',
          regwrite: '1',
          alusrc: '0',
          memwrite: '0',
          memtoreg: '0',
          pcsrc: '0',
          aluop: '10',
          'rs1 (x2)': '0x00000005',
          'rs2 (x3)': '0x00000003',
        },
        description:
          '【Decode】op=0110011 → R型。\n・funct7=0100000 はSUBを示す\n・regwrite=1, alusrc=0\n・rs1=x2=5, rs2=x3=3 を読み出し',
      },
      {
        stage: 'execute',
        activeWires: ['w-srca', 'w-rd2-mux', 'w-srcb', 'w-alucontrol', 'w-aluout', 'w-aluout-result'],
        activeModules: ['alu', 'aludec', 'mux-srcb'],
        signalValues: {
          alucontrol: '0001 (SUB)',
          srca: '0x00000005',
          srcb: '0x00000003',
          aluout: '0x00000002',
          btaken: '0',
        },
        description:
          '【Execute】alucontrol=0001 (SUB)。\nsrca=5, srcb=3 → aluout = 5 - 3 = 2',
      },
      {
        stage: 'memory',
        activeWires: [],
        activeModules: [],
        signalValues: { memwrite: '0', aluout: '0x00000002' },
        description: '【Memory】R型命令のためメモリアクセスなし。',
      },
      {
        stage: 'writeback',
        activeWires: ['w-aluout-result', 'w-result'],
        activeModules: ['regfile', 'mux-result'],
        signalValues: {
          memtoreg: '0',
          result: '0x00000002',
          'x1 (書き込み先)': '0x00000002',
        },
        description:
          '【Writeback】result=aluout=2 → x1 に書き込み。\nx1 の値が 1 → 2 に更新。',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // LW x1, 0(x2)   (I型)
  // ──────────────────────────────────────────────────────────────────
  {
    instruction: 'lw x1, 0(x2)',
    type: 'I',
    encoding: '000000000000_00010_010_00001_0000011',
    meaning: 'x1 ← mem[x2 + 0] = mem[5] = 0xDEADBEEF',
    stages: [
      {
        stage: 'fetch',
        activeWires: ['w-pc-imem'],
        activeModules: ['pc', 'imem'],
        signalValues: { PC: '0x00000008', instr: '0x00012083' },
        description: '【Fetch】PC=0x00000008。imemから lw x1, 0(x2) の機械語 0x00012083 を取得。',
      },
      {
        stage: 'decode',
        activeWires: ['w-instr-bus', 'w-rs1', 'w-rd', 'w-imm-raw', 'w-op', 'w-funct3',
                      'w-regwrite', 'w-alusrc', 'w-memwrite', 'w-memtoreg', 'w-pcsrc', 'w-aluop'],
        activeModules: ['imem', 'regfile', 'immext', 'maindec', 'aludec'],
        signalValues: {
          'op[6:0]': '0000011 (I型ロード)',
          'funct3': '010',
          regwrite: '1',
          alusrc: '1 (即値使用)',
          memwrite: '0',
          memtoreg: '1 (readdata選択)',
          pcsrc: '0',
          aluop: '00',
          'imm (sign拡張)': '0x00000000',
          'rs1 (x2)': '0x00000005',
        },
        description:
          '【Decode】op=0000011 → ロード命令(I型)。\n・maindec: regwrite=1, alusrc=1(即値使用), memtoreg=1(readdata選択)\n・immextが即値0を符号拡張: imm=0\n・rs1=x2=5 を読み出し',
      },
      {
        stage: 'execute',
        activeWires: ['w-srca', 'w-immext', 'w-srcb', 'w-alucontrol', 'w-aluout'],
        activeModules: ['alu', 'immext', 'mux-srcb'],
        signalValues: {
          alucontrol: '0000 (ADD)',
          srca: '0x00000005',
          srcb: '0x00000000',
          aluout: '0x00000005',
        },
        description:
          '【Execute】アドレス計算。\n・alusrc=1 → srcb=即値=0\n・aluout = srca + srcb = 5 + 0 = 5 (ロードアドレス)',
      },
      {
        stage: 'memory',
        activeWires: ['w-aluout', 'w-readdata'],
        activeModules: ['dmem'],
        signalValues: {
          memwrite: '0',
          'アドレス': '0x00000005',
          readdata: '0xDEADBEEF',
        },
        description:
          '【Memory】データメモリから読み込み。\n・アドレス=aluout=5\n・memwrite=0 (読み取り専用)\n・readdata = mem[5] = 0xDEADBEEF',
      },
      {
        stage: 'writeback',
        activeWires: ['w-readdata', 'w-result'],
        activeModules: ['regfile', 'mux-result'],
        signalValues: {
          memtoreg: '1 (readdata選択)',
          result: '0xDEADBEEF',
          'x1 (書き込み先)': '0xDEADBEEF',
        },
        description:
          '【Writeback】readdata を x1 に書き込み。\n・memtoreg=1 → result muxはreaddataを選択\n・result=0xDEADBEEF → x1 に書き込み',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // SW x1, 0(x2)   (S型)
  // ──────────────────────────────────────────────────────────────────
  {
    instruction: 'sw x1, 0(x2)',
    type: 'S',
    encoding: '0000000_00001_00010_010_00000_0100011',
    meaning: 'mem[x2 + 0] ← x1 = mem[5] ← 1',
    stages: [
      {
        stage: 'fetch',
        activeWires: ['w-pc-imem'],
        activeModules: ['pc', 'imem'],
        signalValues: { PC: '0x0000000C', instr: '0x00112023' },
        description: '【Fetch】PC=0x0000000C。imemから sw x1, 0(x2) の機械語を取得。',
      },
      {
        stage: 'decode',
        activeWires: ['w-instr-bus', 'w-rs1', 'w-rs2', 'w-imm-raw', 'w-op', 'w-funct3',
                      'w-alusrc', 'w-memwrite', 'w-pcsrc', 'w-aluop'],
        activeModules: ['imem', 'regfile', 'immext', 'maindec', 'aludec'],
        signalValues: {
          'op[6:0]': '0100011 (S型)',
          'funct3': '010',
          regwrite: '0 (書き込みなし)',
          alusrc: '1 (即値使用)',
          memwrite: '1',
          memtoreg: 'x (don\'t care)',
          pcsrc: '0',
          aluop: '00',
          'imm (sign拡張)': '0x00000000',
          'rs1 (x2)': '0x00000005',
          'rs2 (x1)': '0x00000001',
        },
        description:
          '【Decode】op=0100011 → ストア命令(S型)。\n・maindec: regwrite=0, memwrite=1, alusrc=1\n・rs1=x2=5 (ベースアドレス), rs2=x1=1 (書き込みデータ)\n・immextが即値0を符号拡張',
      },
      {
        stage: 'execute',
        activeWires: ['w-srca', 'w-immext', 'w-srcb', 'w-alucontrol', 'w-aluout'],
        activeModules: ['alu', 'immext', 'mux-srcb'],
        signalValues: {
          alucontrol: '0000 (ADD)',
          srca: '0x00000005',
          srcb: '0x00000000',
          aluout: '0x00000005',
        },
        description: '【Execute】アドレス計算。\naluout = srca + imm = 5 + 0 = 5 (ストアアドレス)',
      },
      {
        stage: 'memory',
        activeWires: ['w-aluout', 'w-rd2'],
        activeModules: ['dmem'],
        signalValues: {
          memwrite: '1',
          'アドレス': '0x00000005',
          writedata: '0x00000001',
        },
        description:
          '【Memory】データメモリに書き込み。\n・アドレス=aluout=5\n・writedata=x1=1 を mem[5] に書き込み\n・memwrite=1 なので書き込みが有効',
      },
      {
        stage: 'writeback',
        activeWires: [],
        activeModules: [],
        signalValues: {
          regwrite: '0 (書き込みなし)',
        },
        description: '【Writeback】S型命令はレジスタへの書き込みなし。\nregwrite=0 のため何も起こりません。',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // BEQ x1, x2, 8   (B型)
  // ──────────────────────────────────────────────────────────────────
  {
    instruction: 'beq x1, x2, 8',
    type: 'B',
    encoding: '0000000_00010_00001_000_01000_1100011',
    meaning: 'if x1 == x2 then PC ← PC + 8 (x1=1, x2=5 なので不成立)',
    stages: [
      {
        stage: 'fetch',
        activeWires: ['w-pc-imem'],
        activeModules: ['pc', 'imem'],
        signalValues: { PC: '0x00000010', instr: '0x00208463' },
        description: '【Fetch】PC=0x00000010。imemから beq x1, x2, 8 の機械語を取得。',
      },
      {
        stage: 'decode',
        activeWires: ['w-instr-bus', 'w-rs1', 'w-rs2', 'w-imm-raw', 'w-op', 'w-funct3',
                      'w-alusrc', 'w-memwrite', 'w-pcsrc', 'w-aluop'],
        activeModules: ['imem', 'regfile', 'immext', 'maindec', 'aludec'],
        signalValues: {
          'op[6:0]': '1100011 (B型)',
          'funct3': '000',
          regwrite: '0',
          alusrc: '0 (レジスタ)',
          memwrite: '0',
          memtoreg: 'x',
          pcsrc: '0 (まだ未確定)',
          aluop: '01',
          'imm (sign拡張)': '0x00000008',
          'rs1 (x1)': '0x00000001',
          'rs2 (x2)': '0x00000005',
        },
        description:
          '【Decode】op=1100011 → 分岐命令(B型)。\n・alusrc=0 (比較にレジスタを使用)\n・immextが分岐オフセット8を符号拡張\n・rs1=x1=1, rs2=x2=5 を読み出し',
      },
      {
        stage: 'execute',
        activeWires: ['w-srca', 'w-rd2-mux', 'w-srcb', 'w-alucontrol', 'w-btaken', 'w-pcsrc'],
        activeModules: ['alu', 'aludec', 'mux-srcb', 'mux-pc', 'pcaddbr'],
        signalValues: {
          alucontrol: '1000 (SUB/比較)',
          srca: '0x00000001',
          srcb: '0x00000005',
          aluout: '0xFFFFFFFC',
          btaken: '0 (x1 ≠ x2)',
          pcsrc: '0 (PC+4 選択)',
          'branch target': '0x00000018',
        },
        description:
          '【Execute】比較演算。\n・srca=x1=1, srcb=x2=5\n・aluout = 1 - 5 ≠ 0 → btaken=0 (分岐不成立)\n・branch target = PC + imm = 0x10 + 8 = 0x18\n・pcsrc=0 → PC+4=0x14 を次PCに選択',
      },
      {
        stage: 'memory',
        activeWires: [],
        activeModules: [],
        signalValues: { memwrite: '0', '分岐': '不成立 (PC+4へ)' },
        description: '【Memory】B型命令はメモリアクセスなし。\n分岐は不成立のため通常シーケンシャル実行。',
      },
      {
        stage: 'writeback',
        activeWires: ['w-pc-sel', 'w-pc-next0'],
        activeModules: ['pc', 'mux-pc', 'pcadd4'],
        signalValues: {
          regwrite: '0',
          pcsrc: '0',
          nextPC: '0x00000014 (PC+4)',
        },
        description:
          '【Writeback】レジスタ書き込みなし。\n・pcsrc=0 → PC ← PC+4 = 0x14\n（もし x1=x2 なら pcsrc=1 で PC ← 0x18 に分岐）',
      },
    ],
  },
];

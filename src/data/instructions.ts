import type { InstructionSimulation } from './types';

// Register initial state: x1=1, x2=4, x3=3, x4=0
// Memory: mem[12] = 0xDEADBEEF (byte address, x2=4, 4+8=12)

export const instructions: InstructionSimulation[] = [
  // ─────────────────────────────────────────────
  // R-type: ADD x1, x2, x3  (x1 ← x2 + x3 = 4 + 3 = 7)
  // ─────────────────────────────────────────────
  {
    id: 'add',
    instruction: 'add x1,x2,x3',
    type: 'R',
    encoding: '0000000 00011 00010 000 00001 0110011',
    meaning: 'x1 ← x2 + x3 = 4 + 3 = 7',
    stages: [
      {
        stage: 'fetch',
        activeModules: ['pc', 'imem'],
        activeWires: ['w-pc-imem', 'w-pc-add4'],
        signalValues: [
          { label: 'PC',       value: '0x00000000', kind: 'data' },
          { label: 'Instr',    value: '0x003100B3', kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'PCが指すアドレス (0x00000000) から命令メモリを読み出します。\n取得した命令は 0x003100B3 (ADD x1,x2,x3) です。\nPC+4 の計算も同時に開始します。',
      },
      {
        stage: 'decode',
        activeModules: ['imem', 'regfile', 'maindec', 'aludec'],
        activeWires: ['w-op', 'w-funct3', 'w-funct7', 'w-rs1', 'w-rs2', 'w-rd', 'w-regwrite', 'w-alusrc', 'w-aluop', 'w-alucontrol'],
        signalValues: [
          { label: 'op',        value: '0110011 (R型)',  kind: 'control' },
          { label: 'funct3',    value: '000',            kind: 'control' },
          { label: 'funct7[5]', value: '0',              kind: 'control' },
          { label: 'RegWrite',  value: '1',              kind: 'control' },
          { label: 'ALUSrc',    value: '0 (rs2使用)',    kind: 'control' },
          { label: 'ALUOp',     value: '10 (R型演算)',   kind: 'control' },
          { label: 'ALUCtrl',   value: '0000 (ADD)',     kind: 'control' },
          { label: 'rs1=x2',    value: '4',              kind: 'data' },
          { label: 'rs2=x3',    value: '3',              kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: '命令デコーダがop=0110011をR型と識別します。\nMainDecoderはRegWrite=1, ALUSrc=0, MemWrite=0を出力します。\nALUDecoderはfunct3=000, funct7=0からALUControl=0000(ADD)を決定します。\nRegisterFileからrs1=x2=4, rs2=x3=3を読み出します。',
      },
      {
        stage: 'execute',
        activeModules: ['alu', 'aludec', 'mux_srcb'],
        activeWires: ['w-srca', 'w-rd2', 'w-srcb', 'w-alucontrol', 'w-aluout', 'w-alures'],
        signalValues: [
          { label: 'SrcA',      value: '4 (x2)',         kind: 'data' },
          { label: 'SrcB',      value: '3 (x3)',         kind: 'data' },
          { label: 'ALUCtrl',   value: '0000 (ADD)',     kind: 'control' },
          { label: 'ALUResult', value: '7 (= 4 + 3)',    kind: 'data' },
          { label: 'Zero',      value: '0',              kind: 'control' },
          { label: 'Branch',    value: '0',              kind: 'control' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'ALUSrc=0なのでMUXはrs2の値(x3=3)を選択します。\nALUはSrcA=4とSrcB=3を加算し、結果 ALUResult=7 を出力します。\nZeroフラグは0(非ゼロ)なのでブランチは発生しません。',
      },
      {
        stage: 'memory',
        activeModules: [],
        activeWires: [],
        signalValues: [
          { label: 'MemWrite',  value: '0 (書き込みなし)', kind: 'control' },
          { label: 'MemRead',   value: '0 (読み出しなし)', kind: 'control' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'R型命令はメモリアクセスを行いません。\nMemWrite=0のためデータメモリへの書き込みは発生しません。\nこのステージはスキップされます。',
      },
      {
        stage: 'writeback',
        activeModules: ['regfile', 'mux_res'],
        activeWires: ['w-alures', 'w-result', 'w-regwrite'],
        signalValues: [
          { label: 'MemToReg',  value: '0 (ALU結果)',    kind: 'control' },
          { label: 'Result',    value: '7',              kind: 'data' },
          { label: 'RegWrite',  value: '1',              kind: 'control' },
          { label: 'rd=x1',     value: '← 7',           kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '7', changed: true },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'MemToReg=0なのでMUXはALUの結果(7)を選択します。\nRegWrite=1により、rd=x1レジスタに7が書き込まれます。\nx1の値が1から7に更新されます。',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // I-type: LW x1, 8(x2)  (x1 ← mem[x2+8] = mem[12] = 0xDEADBEEF)
  // ─────────────────────────────────────────────
  {
    id: 'lw',
    instruction: 'lw x1,8(x2)',
    type: 'I',
    encoding: '000000001000 00010 010 00001 0000011',
    meaning: 'x1 ← mem[x2+8] = mem[12] = 0xDEADBEEF',
    stages: [
      {
        stage: 'fetch',
        activeModules: ['pc', 'imem'],
        activeWires: ['w-pc-imem', 'w-pc-add4'],
        signalValues: [
          { label: 'PC',        value: '0x00000000', kind: 'data' },
          { label: 'Instr',     value: '0x00812083', kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'PCが指すアドレスから命令メモリを読み出します。\n取得した命令は 0x00812083 (LW x1,8(x2)) です。\nI型即値命令で、メモリからの読み出しを行います。',
      },
      {
        stage: 'decode',
        activeModules: ['imem', 'regfile', 'maindec', 'aludec', 'immext'],
        activeWires: ['w-op', 'w-funct3', 'w-rs1', 'w-rd', 'w-imm', 'w-immext', 'w-regwrite', 'w-alusrc', 'w-memtoreg', 'w-aluop', 'w-alucontrol'],
        signalValues: [
          { label: 'op',        value: '0000011 (I型)', kind: 'control' },
          { label: 'funct3',    value: '010 (LW)',       kind: 'control' },
          { label: 'RegWrite',  value: '1',              kind: 'control' },
          { label: 'ALUSrc',    value: '1 (即値使用)',   kind: 'control' },
          { label: 'MemToReg',  value: '1 (メモリ→RD)', kind: 'control' },
          { label: 'ALUOp',     value: '00 (アドレス加算)', kind: 'control' },
          { label: 'ALUCtrl',   value: '0000 (ADD)',     kind: 'control' },
          { label: 'ImmExt',    value: '8 (0x008)',      kind: 'data' },
          { label: 'rs1=x2',    value: '4',              kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'op=0000011からI型ロード命令と識別します。\nALUSrc=1なのでMUXは符号拡張された即値(8)を選択します。\nMemToReg=1でメモリの読み出しデータをレジスタに書き戻します。\nImmExtが即値フィールドを符号拡張して8を出力します。',
      },
      {
        stage: 'execute',
        activeModules: ['alu', 'mux_srcb', 'immext'],
        activeWires: ['w-srca', 'w-immext', 'w-srcb', 'w-alucontrol', 'w-aluout'],
        signalValues: [
          { label: 'SrcA',      value: '4 (x2)',         kind: 'data' },
          { label: 'SrcB',      value: '8 (即値)',        kind: 'data' },
          { label: 'ALUCtrl',   value: '0000 (ADD)',     kind: 'control' },
          { label: 'ALUResult', value: '12 (メモリアドレス)', kind: 'data' },
          { label: 'Zero',      value: '0',              kind: 'control' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'ALUSrc=1なのでMUXは即値(8)を選択します。\nALUがベースアドレスx2=4と即値8を加算し、メモリアドレス12を計算します。\nこのアドレスはデータメモリのアドレス入力に送られます。',
      },
      {
        stage: 'memory',
        activeModules: ['dmem'],
        activeWires: ['w-aluout', 'w-readdata'],
        signalValues: [
          { label: 'MemWrite',  value: '0',              kind: 'control' },
          { label: 'Addr',      value: '12 (0x0C)',      kind: 'data' },
          { label: 'ReadData',  value: '0xDEADBEEF',    kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'ALUが計算したアドレス12をデータメモリに送ります。\nMemWrite=0なので読み出し操作となります。\nアドレス12のメモリから 0xDEADBEEF が読み出されます。',
      },
      {
        stage: 'writeback',
        activeModules: ['regfile', 'mux_res'],
        activeWires: ['w-readdata', 'w-result', 'w-regwrite', 'w-memtoreg'],
        signalValues: [
          { label: 'MemToReg',  value: '1 (メモリ選択)',  kind: 'control' },
          { label: 'ReadData',  value: '0xDEADBEEF',     kind: 'data' },
          { label: 'Result',    value: '0xDEADBEEF',     kind: 'data' },
          { label: 'RegWrite',  value: '1',              kind: 'control' },
          { label: 'rd=x1',     value: '← 0xDEADBEEF',  kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '0xDEADBEEF', changed: true },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'MemToReg=1なのでMUXはメモリ読み出しデータを選択します。\nResult=0xDEADBEEFがレジスタファイルに書き込まれます。\nrd=x1の値が0xDEADBEEFに更新されます。',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // S-type: SW x3, 8(x2)  (mem[x2+8] ← x3 = 3)
  // ─────────────────────────────────────────────
  {
    id: 'sw',
    instruction: 'sw x3,8(x2)',
    type: 'S',
    encoding: '0000000 00011 00010 010 01000 0100011',
    meaning: 'mem[x2+8] = mem[12] ← x3 = 3',
    stages: [
      {
        stage: 'fetch',
        activeModules: ['pc', 'imem'],
        activeWires: ['w-pc-imem', 'w-pc-add4'],
        signalValues: [
          { label: 'PC',        value: '0x00000000', kind: 'data' },
          { label: 'Instr',     value: '0x00312423', kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'PCが指すアドレスから命令メモリを読み出します。\n取得した命令は 0x00312423 (SW x3,8(x2)) です。\nS型ストア命令で、レジスタの値をメモリに書き込みます。',
      },
      {
        stage: 'decode',
        activeModules: ['imem', 'regfile', 'maindec', 'aludec', 'immext'],
        activeWires: ['w-op', 'w-funct3', 'w-rs1', 'w-rs2', 'w-imm', 'w-immext', 'w-alusrc', 'w-memwrite', 'w-aluop', 'w-alucontrol'],
        signalValues: [
          { label: 'op',        value: '0100011 (S型)', kind: 'control' },
          { label: 'funct3',    value: '010 (SW)',       kind: 'control' },
          { label: 'RegWrite',  value: '0 (書き込みなし)', kind: 'control' },
          { label: 'ALUSrc',    value: '1 (即値使用)',   kind: 'control' },
          { label: 'MemWrite',  value: '1 (書き込み)',   kind: 'control' },
          { label: 'ALUCtrl',   value: '0000 (ADD)',     kind: 'control' },
          { label: 'ImmExt',    value: '8 (0x008)',      kind: 'data' },
          { label: 'rs1=x2',    value: '4 (ベースアドレス)', kind: 'data' },
          { label: 'rs2=x3',    value: '3 (書き込みデータ)', kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'op=0100011からS型ストア命令と識別します。\nRegWrite=0でレジスタへの書き戻しは行いません。\nMemWrite=1でデータメモリへの書き込みが有効になります。\nS型即値(上位7bit + 下位5bit)を結合して8を生成します。',
      },
      {
        stage: 'execute',
        activeModules: ['alu', 'mux_srcb', 'immext'],
        activeWires: ['w-srca', 'w-immext', 'w-srcb', 'w-alucontrol', 'w-aluout', 'w-rd2', 'w-writedata'],
        signalValues: [
          { label: 'SrcA',      value: '4 (x2)',         kind: 'data' },
          { label: 'SrcB',      value: '8 (即値)',        kind: 'data' },
          { label: 'ALUCtrl',   value: '0000 (ADD)',     kind: 'control' },
          { label: 'ALUResult', value: '12 (書き込みアドレス)', kind: 'data' },
          { label: 'WriteData', value: '3 (x3)',         kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'ALUがベースアドレスx2=4と即値8を加算し、書き込みアドレス12を計算します。\n同時にrs2=x3=3がWriteDataとしてデータメモリへ送られます。\nアドレスと書き込みデータの両方が次のメモリステージに準備されます。',
      },
      {
        stage: 'memory',
        activeModules: ['dmem'],
        activeWires: ['w-aluout', 'w-writedata'],
        signalValues: [
          { label: 'MemWrite',  value: '1 (書き込み有効)', kind: 'control' },
          { label: 'Addr',      value: '12 (0x0C)',      kind: 'data' },
          { label: 'WriteData', value: '3 (x3の値)',     kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'MemWrite=1によりデータメモリへの書き込みが実行されます。\nALUが計算したアドレス12にx3の値(3)が書き込まれます。\nmem[12] = 3 となります。',
      },
      {
        stage: 'writeback',
        activeModules: [],
        activeWires: [],
        signalValues: [
          { label: 'RegWrite',  value: '0 (書き込みなし)', kind: 'control' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'S型命令はレジスタへの書き戻しを行いません。\nRegWrite=0のためレジスタファイルへの書き込みは発生しません。\nこのステージはスキップされます。',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // B-type: BEQ x1, x2, L  (x1=1, x2=4 → 1≠4 → not taken)
  // ─────────────────────────────────────────────
  {
    id: 'beq',
    instruction: 'beq x1,x2,L',
    type: 'B',
    encoding: '0000000 00010 00001 000 00000 1100011',
    meaning: 'if(x1==x2) PC←PC+imm  →  1≠4 分岐なし',
    stages: [
      {
        stage: 'fetch',
        activeModules: ['pc', 'imem'],
        activeWires: ['w-pc-imem', 'w-pc-add4'],
        signalValues: [
          { label: 'PC',        value: '0x00000000', kind: 'data' },
          { label: 'Instr',     value: '0x00208063', kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'PCが指すアドレスから命令メモリを読み出します。\n取得した命令は 0x00208063 (BEQ x1,x2,L) です。\nB型条件分岐命令で、2つのレジスタが等しければ分岐します。',
      },
      {
        stage: 'decode',
        activeModules: ['imem', 'regfile', 'maindec', 'aludec', 'immext'],
        activeWires: ['w-op', 'w-funct3', 'w-rs1', 'w-rs2', 'w-imm', 'w-immext', 'w-alusrc', 'w-pcsrc', 'w-aluop', 'w-alucontrol'],
        signalValues: [
          { label: 'op',        value: '1100011 (B型)', kind: 'control' },
          { label: 'funct3',    value: '000 (BEQ)',      kind: 'control' },
          { label: 'RegWrite',  value: '0',              kind: 'control' },
          { label: 'ALUSrc',    value: '0 (rs2使用)',    kind: 'control' },
          { label: 'Branch',    value: '1 (分岐命令)',   kind: 'control' },
          { label: 'ALUOp',     value: '01 (引き算)',    kind: 'control' },
          { label: 'ALUCtrl',   value: '1000 (SUB)',     kind: 'control' },
          { label: 'rs1=x1',    value: '1',              kind: 'data' },
          { label: 'rs2=x2',    value: '4',              kind: 'data' },
          { label: 'ImmExt',    value: 'L (分岐オフセット)', kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'op=1100011からB型分岐命令と識別します。\nBranch=1フラグが設定されます。\nALUOp=01によりALUDecoderはSUB(引き算)を選択します。\nrs1=x1=1, rs2=x2=4が読み出され、差分の計算に使われます。',
      },
      {
        stage: 'execute',
        activeModules: ['alu', 'mux_srcb', 'pcaddbr'],
        activeWires: ['w-srca', 'w-rd2', 'w-srcb', 'w-alucontrol', 'w-aluout', 'w-btaken', 'w-immext', 'w-pcaddbr'],
        signalValues: [
          { label: 'SrcA',      value: '1 (x1)',         kind: 'data' },
          { label: 'SrcB',      value: '4 (x2)',         kind: 'data' },
          { label: 'ALUCtrl',   value: '1000 (SUB)',     kind: 'control' },
          { label: 'ALUResult', value: '-3 (= 1 - 4)',   kind: 'data' },
          { label: 'Zero',      value: '0 (等しくない)', kind: 'control' },
          { label: 'Branch',    value: '1',              kind: 'control' },
          { label: 'PCSrc',     value: '0 (分岐なし)',   kind: 'control' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'ALUがSrcA=1からSrcB=4を引き算します。\n結果=-3≠0なのでZeroフラグは0になります。\nBranch AND Zero = 1 AND 0 = 0 なので PCSrc=0、分岐は発生しません。\nPC+Immも計算されますが使用されません。',
      },
      {
        stage: 'memory',
        activeModules: [],
        activeWires: [],
        signalValues: [
          { label: 'MemWrite',  value: '0',              kind: 'control' },
          { label: 'PCSrc',     value: '0 (PC+4選択)',   kind: 'control' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'B型命令はメモリアクセスを行いません。\n分岐が成立しなかったため、次のPCはPC+4となります。\nPCSrc=0によりPC Multiplexerは PC+4 を選択します。',
      },
      {
        stage: 'writeback',
        activeModules: ['mux_pc', 'pcadd4'],
        activeWires: ['w-pcadd4', 'w-pcsrc', 'w-pcnext'],
        signalValues: [
          { label: 'RegWrite',  value: '0',              kind: 'control' },
          { label: 'PCSrc',     value: '0 (PC+4)',       kind: 'control' },
          { label: 'NextPC',    value: 'PC + 4',         kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'B型命令はレジスタへの書き戻しを行いません。\nx1=1 ≠ x2=4 なので分岐条件が成立せず、PC+4が次のPCに選択されます。\nMUXがPC+4を出力し、次の命令フェッチに使用されます。',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // B-type: BEQ x2, x2, L  (x2=4, x2=4 → 4==4 → taken)
  // ─────────────────────────────────────────────
  {
    id: 'beq-taken',
    instruction: 'beq x2,x2,L',
    type: 'B',
    encoding: '0000000 00010 00010 000 01000 1100011',
    meaning: 'if(x2==x2) PC←PC+16  →  4=4 分岐あり',
    stages: [
      {
        stage: 'fetch',
        activeModules: ['pc', 'imem'],
        activeWires: ['w-pc-imem', 'w-pc-add4'],
        signalValues: [
          { label: 'PC',        value: '0x00000000', kind: 'data' },
          { label: 'Instr',     value: '0x00210463', kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'PCが指すアドレスから命令メモリを読み出します。\n取得した命令は BEQ x2,x2,L です。\nB型条件分岐命令で、x2とx2を比較します（必ず等しい）。',
      },
      {
        stage: 'decode',
        activeModules: ['imem', 'regfile', 'maindec', 'aludec', 'immext'],
        activeWires: ['w-op', 'w-funct3', 'w-rs1', 'w-rs2', 'w-imm', 'w-immext', 'w-alusrc', 'w-pcsrc', 'w-aluop', 'w-alucontrol'],
        signalValues: [
          { label: 'op',        value: '1100011 (B型)', kind: 'control' },
          { label: 'funct3',    value: '000 (BEQ)',      kind: 'control' },
          { label: 'RegWrite',  value: '0',              kind: 'control' },
          { label: 'ALUSrc',    value: '0 (rs2使用)',    kind: 'control' },
          { label: 'Branch',    value: '1 (分岐命令)',   kind: 'control' },
          { label: 'ALUOp',     value: '01 (引き算)',    kind: 'control' },
          { label: 'ALUCtrl',   value: '1000 (SUB)',     kind: 'control' },
          { label: 'rs1=x2',    value: '4',              kind: 'data' },
          { label: 'rs2=x2',    value: '4',              kind: 'data' },
          { label: 'ImmExt',    value: '16 (分岐先)',    kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'op=1100011からB型分岐命令と識別します。\nBranch=1フラグが設定されます。\nrs1=x2=4, rs2=x2=4 が読み出されます（同じレジスタ）。\nALUOp=01によりALUはSUBを実行して等値を判定します。',
      },
      {
        stage: 'execute',
        activeModules: ['alu', 'mux_srcb', 'pcaddbr'],
        activeWires: ['w-srca', 'w-rd2', 'w-srcb', 'w-alucontrol', 'w-aluout', 'w-btaken', 'w-immext', 'w-pcaddbr'],
        signalValues: [
          { label: 'SrcA',      value: '4 (x2)',         kind: 'data' },
          { label: 'SrcB',      value: '4 (x2)',         kind: 'data' },
          { label: 'ALUCtrl',   value: '1000 (SUB)',     kind: 'control' },
          { label: 'ALUResult', value: '0 (= 4 - 4)',    kind: 'data' },
          { label: 'Zero',      value: '1 (等しい!)',    kind: 'control' },
          { label: 'Branch',    value: '1',              kind: 'control' },
          { label: 'PCSrc',     value: '1 (分岐あり!)',  kind: 'control' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'ALUがSrcA=4からSrcB=4を引き算します。\n結果=0なのでZeroフラグは1になります。\nBranch AND Zero = 1 AND 1 = 1 → PCSrc=1、分岐が発生します！\nPC+Imm=PC+16が次のPCアドレスとして計算されます。',
      },
      {
        stage: 'memory',
        activeModules: [],
        activeWires: [],
        signalValues: [
          { label: 'MemWrite',  value: '0',              kind: 'control' },
          { label: 'PCSrc',     value: '1 (PC+Imm選択)', kind: 'control' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'B型命令はメモリアクセスを行いません。\n分岐が成立したため、次のPCはPC+16となります。\nPCSrc=1によりPC MultiplexerはPC+Immを選択します。',
      },
      {
        stage: 'writeback',
        activeModules: ['mux_pc', 'pcaddbr'],
        activeWires: ['w-pcaddbr', 'w-pcsrc', 'w-pcnext'],
        signalValues: [
          { label: 'RegWrite',  value: '0',              kind: 'control' },
          { label: 'PCSrc',     value: '1 (PC+Imm)',     kind: 'control' },
          { label: 'NextPC',    value: 'PC + 16',        kind: 'data' },
        ],
        registerState: [
          { name: 'x1', value: '1' },
          { name: 'x2', value: '4' },
          { name: 'x3', value: '3' },
        ],
        description: 'B型命令はレジスタへの書き戻しを行いません。\nx2=4 == x2=4 で分岐条件が成立し、PC+16が次のPCに選択されます。\nMUXがPC+Immを選択し、分岐先の命令フェッチに使用されます。',
      },
    ],
  },
];

# RISC-V CPU 信号可視化 — 教育用 Web アプリ

RISC-V シングルサイクル実装における命令実行時の内部信号の流れを、ステージ別アニメーションでインタラクティブに学習できる教育用 Web アプリです。

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)

---

## 画面構成

```
┌─────────────────────────────────────────────────────────────┐
│  ヘッダー (固定)                                              │
├─────────────────────────────────────────────────────────────┤
│  命令選択パネル (add / sub / lw / sw / beq)                  │
├──────────────────────────────────────┬──────────────────────┤
│                                      │                      │
│   CPU 図 (SVG)                       │  信号値サマリー       │
│   • Controller 層 (maindec, aludec)  │  • 制御信号テーブル  │
│   • Datapath 層 (PC→imem→…→regfile) │  • データ信号テーブル│
│   • アクティブ線のフロー アニメーション│  • レジスタファイル  │
│                                      │                      │
├─────────────────────────────────────────────────────────────┤
│  ステージ制御パネル                                           │
│  [⏮] [◀ 前へ] [⏵ 自動再生] [次へ ▶]                        │
│  Fetch → Decode → Execute → Memory → Writeback              │
│  ─ 現在ステージの日本語説明文 ─                              │
└─────────────────────────────────────────────────────────────┘
```

---

## サポート命令

| 命令 | 型 | 動作 |
|------|----|------|
| `add x1, x2, x3` | R | x1 ← x2 + x3 |
| `sub x1, x2, x3` | R | x1 ← x2 − x3 |
| `lw x1, 0(x2)`   | I | x1 ← mem[x2+0] |
| `sw x1, 0(x2)`   | S | mem[x2+0] ← x1 |
| `beq x1, x2, 8`  | B | if x1==x2: PC←PC+8 |

**初期レジスタ値:** x0=0, x1=1, x2=5, x3=3, x4=0  
**初期メモリ:** mem[5] = 0xDEADBEEF

---

## ビジュアル仕様

- **データ線** ： 青 (`#3b82f6`)、アクティブ時に `stroke-dashoffset` フローアニメーション + グロー
- **制御線** ： オレンジ (`#f97316`)、同上
- **信号値バッジ** ： アクティブワイヤーの中間点付近に `name=value` ラベルを表示
- **モジュール** ： ヘッダーバー付きカード、アクティブ時に `drop-shadow` グロー
- **Controller 層** ： 紫系配色 (maindec, aludec)
- **Datapath 層** ： 青系配色 (PC, imem, regfile, ALU, dmem など)

---

## ファイル構成

```
src/
├── App.tsx                        # ルートレイアウト
├── index.css                      # グローバルスタイル + アニメーション keyframes
├── main.tsx
├── components/
│   ├── CpuDiagram.tsx             # SVG メインコンポーネント
│   ├── Wire.tsx                   # 信号線 (アニメーション + バッジ)
│   ├── Module.tsx                 # モジュール矩形
│   ├── MuxShape.tsx               # MUX 台形
│   ├── StageControls.tsx          # ステージ制御パネル
│   ├── SignalPanel.tsx            # 信号値サマリー
│   └── InstructionSelector.tsx   # 命令選択
├── data/
│   ├── instructions.ts            # 命令×ステージのスナップショット定義
│   ├── moduleLayout.ts            # モジュール・MUX 座標定義
│   └── wireLayout.ts              # ワイヤー座標・ラベル・種別定義
└── hooks/
    └── useSimulation.ts           # シミュレーション状態管理
```

---

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動 (http://localhost:5173)
npm run dev

# プロダクションビルド
npm run build

# ビルド成果物のプレビュー
npm run preview
```

**必要環境:** Node.js 18 以上

---

## 使い方

1. 上部の **命令選択** から学習したい命令をクリック
2. **[⏵ 自動再生]** で 5 ステージを自動進行（1.2 秒/ステージ）  
   または **[次へ ▶]** で手動で一ステージずつ確認
3. CPU 図上でアクティブな線（青 = データ、オレンジ = 制御）と信号値バッジを確認
4. 右サイドバーの **信号値サマリー** で制御信号・データ信号の値を確認
5. 下部の **説明文** でそのステージで何が起きているかを読む

---

## 技術スタック

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| React | 19 | UI フレームワーク |
| TypeScript | 5.9 | 型安全な開発 |
| Tailwind CSS | 4 | スタイリング |
| Vite | 8 | ビルドツール / 開発サーバー |

アニメーションは CSS `stroke-dashoffset` + `@keyframes` のみで実装（追加ライブラリ不要）。

---

## RISC-V 仕様準拠

制御信号値は *Patterson & Hennessy — Computer Organization and Design (RISC-V Edition)* に基づいています。

| 命令 | alucontrol | regwrite | alusrc | memwrite | memtoreg |
|------|-----------|----------|--------|----------|----------|
| add  | 000       | 1        | 0      | 0        | 0        |
| sub  | 001       | 1        | 0      | 0        | 0        |
| lw   | 000       | 1        | 1      | 0        | 1        |
| sw   | 000       | 0        | 1      | 1        | x        |
| beq  | 001       | 0        | 0      | 0        | x        |

# CLAUDE.md

このプロジェクトで作業する AI アシスタント向けのガイドです。

## 概要

単一サイクル RISC-V CPU の信号フローを可視化する React + TypeScript + Vite アプリ。
R / I / S / B 型命令の 5 ステージ（Fetch → Decode → Execute → Memory → Writeback）を
インタラクティブに表示する。**パイプラインではなく単一サイクル構成**。

## コマンド

```bash
npm run dev      # 開発サーバー起動（localhost:5173）
npm run build    # 本番ビルド（tsc + vite build）
npm run preview  # ビルド結果プレビュー
```

## ディレクトリ構造

```
src/
├── App.tsx                      # レイアウト・状態ルート
├── data/
│   ├── types.ts                 # 共通型定義
│   ├── layout.ts                # SVG 座標（モジュール・ワイヤ）
│   └── instructions.ts         # 命令ごとのシミュレーションデータ
├── components/
│   ├── CpuDiagram.tsx           # メイン SVG ダイアグラム
│   ├── Module.tsx               # モジュールボックス
│   ├── Wire.tsx                 # ワイヤ（polyline）
│   ├── AluDiagram.tsx           # ALU 内部図（アコーディオン）
│   ├── SignalPanel.tsx          # 右パネル（シグナル値・説明）
│   ├── InstructionTabs.tsx      # 命令選択タブ
│   └── StageTabs.tsx            # ステージナビゲーション
└── hooks/
    └── useSimulation.ts         # instrIndex / stageIndex 状態管理
```

## データの流れ

```
instructions.ts（真実のソース）
  └─ useSimulation（instrIndex, stageIndex を保持）
       └─ currentSnapshot: SignalSnapshot
            ├─ activeWires[]   → Wire.tsx でハイライト
            ├─ activeModules[] → Module.tsx でハイライト
            ├─ signalValues[]  → SignalPanel.tsx で表示
            └─ description     → SignalPanel.tsx で表示
```

## SVG 座標系

- viewBox: `0 0 860 480`
- Controller 領域: y = 8〜84（紫系背景）
- Datapath 領域: y = 88〜472（スレート系背景）
- ワイヤは**直角折れ線のみ**（斜め線禁止）

## カラーパレット

| 対象 | 非アクティブ | アクティブ |
|------|-------------|-----------|
| データワイヤ | `#94A3B8` 1.5px | `#3B82F6` 2px |
| 制御ワイヤ | `#94A3B8` 1.5px | `#F59E0B` 1.5px |
| モジュール枠 | `#CBD5E1` | `#3B82F6` |
| モジュール塗り | white | `#EFF6FF` |

## 命令データの追加

`src/data/instructions.ts` に `InstructionSimulation` を追加する：

```typescript
{
  id: 'unique-id',
  instruction: 'sub x1, x2, x3',
  type: 'R',
  encoding: '0100000 00011 00010 000 00001 0110011',
  meaning: 'x1 ← x2 - x3',
  stages: [
    {
      stage: 'fetch',
      activeModules: ['pc', 'imem'],
      activeWires: ['w-pc-imem'],
      signalValues: [
        { label: 'PC', value: '0x00000000', kind: 'data' },
      ],
      description: '説明テキスト（日本語）',
    },
    // decode, execute, memory, writeback ...
  ],
}
```

`activeModules` / `activeWires` の ID は `src/data/layout.ts` の定義と一致させること。

## ワイヤ・モジュールの追加

`src/data/layout.ts` の `modules` / `wires` 配列に追記する。
追加後は `instructions.ts` の該当ステージの `activeWires` / `activeModules` に ID を含める。

```typescript
// モジュール
{ id: 'new-mod', label: 'New\nMod', x: 100, y: 200, width: 80, height: 50 }

// ワイヤ
{ id: 'w-new', label: 'SigName', kind: 'data',
  points: [[100, 220], [180, 220]], labelPos: [140, 214] }
```

## デプロイ

```bash
npm run build
npx gh-pages -d dist   # gh-pages ブランチに push → GitHub Pages 公開
```

base パス `/riscv-cpu-viz/` は `vite.config.ts` に設定済み。

# CLAUDE.md - AIアシスタント向けガイド

このファイルは、このプロジェクトで作業するAIアシスタントのための参照ガイドです。

## プロジェクト概要

RISC-V CPU の5段パイプライン（Fetch / Decode / Execute / Memory / Writeback）における信号フローを可視化する Web アプリケーションです。ユーザーが命令とステージを選択すると、対応するモジュールと配線がハイライトされます。

## 技術スタック

- React 18 + TypeScript（strict モード）
- Vite（ビルドツール）
- Tailwind CSS v3
- Pure SVG（アニメーションライブラリ・外部グラフライブラリなし）

## ディレクトリ構造

```
src/
├── main.tsx              # エントリポイント
├── App.tsx               # メインレイアウト・状態管理のルート
├── index.css             # Tailwind CSS インポート
├── data/
│   ├── types.ts          # 共通型定義
│   ├── layout.ts         # SVGレイアウト（モジュール位置・ワイヤ経路）
│   └── instructions.ts   # 命令シミュレーションデータ
├── components/
│   ├── InstructionTabs.tsx  # 命令選択ピルボタン
│   ├── StageTabs.tsx        # ステージ進捗ナビゲーション
│   ├── CpuDiagram.tsx       # メインSVGダイアグラム
│   ├── AluDiagram.tsx       # ALU内部図（アコーディオン）
│   ├── SignalPanel.tsx      # 右パネル（シグナル値・説明）
│   ├── Wire.tsx             # SVGワイヤ描画コンポーネント
│   └── Module.tsx           # SVGモジュールボックス描画
└── hooks/
    └── useSimulation.ts     # シミュレーション状態管理フック
```

## 重要な設計方針

### 座標系
- SVG viewBox: `0 0 860 480`
- コントローラ領域: y=8〜84（紫系背景）
- データパス領域: y=88〜472（スレート系背景）
- すべての座標はピクセル単位で `layout.ts` に定義

### データの流れ
1. `instructions.ts` の `InstructionSimulation[]` が真実のソース
2. `useSimulation` フックが `instrIndex` と `stageIndex` を管理
3. `currentSnapshot: SignalSnapshot` が `activeWires[]` と `activeModules[]` を持つ
4. `CpuDiagram` はこれらのセットを参照してハイライトを決定

### カラーパレット
- データ配線（active）: `#3B82F6`（blue-500）
- 制御配線（active）: `#F59E0B`（amber-500）
- 非アクティブ配線: `#CBD5E1`（slate-300）
- アクティブモジュール: `#EFF6FF` fill、`#3B82F6` stroke
- 非アクティブモジュール: white fill、`#E2E8F0` stroke

## 命令データの追加方法

`src/data/instructions.ts` に新しい `InstructionSimulation` オブジェクトを追加します：

```typescript
{
  id: 'unique-id',
  instruction: 'mnemonic text',
  type: 'R' | 'I' | 'S' | 'B',  // InstrType
  encoding: 'binary encoding string',
  meaning: '動作の説明',
  stages: [
    {
      stage: 'fetch',
      activeModules: ['pc', 'imem'],      // layout.ts の ModuleDef id
      activeWires: ['w-pc-imem'],         // layout.ts の WireDef id
      signalValues: [
        { label: 'PC', value: '0x00', kind: 'data' },
      ],
      description: 'このステージの説明（日本語）',
    },
    // ... decode, execute, memory, writeback
  ],
}
```

## ワイヤ・モジュールの追加方法

### モジュール追加（`src/data/layout.ts`）
```typescript
// modules 配列に追加
{ id: 'new-module', label: 'New\nModule', x: 100, y: 200, width: 80, height: 40 }
```

### ワイヤ追加（`src/data/layout.ts`）
```typescript
// wires 配列に追加
{
  id: 'w-new-wire',
  label: 'SignalName',
  kind: 'data',  // or 'control'
  points: [[x1, y1], [x2, y2], [x3, y3]],  // 直角折れ線
  labelPos: [lx, ly],  // ラベル表示位置
}
```

### 注意事項
- ワイヤは必ず直角折れ線（水平・垂直のみ）を使用
- モジュールIDは `InstructionSimulation.stages[].activeModules` で参照
- ワイヤIDは `InstructionSimulation.stages[].activeWires` で参照

## ビルド・開発コマンド

```bash
npm install       # 依存関係インストール
npm run dev       # 開発サーバー起動（http://localhost:5173）
npm run build     # 本番ビルド（tsc + vite build）
npm run preview   # ビルド結果プレビュー
```

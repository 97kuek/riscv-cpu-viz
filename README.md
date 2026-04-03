# RISC-V CPU 可視化

単一サイクル RISC-V プロセッサの内部信号フローをインタラクティブに可視化する Web アプリです。

**デモ**: https://97kuek.github.io/riscv-cpu-viz/

---

## 概要

命令とステージを選ぶと、CPU内で**どのモジュールが動き、どの信号が流れるか**をブロック図上でハイライト表示します。データ信号（青）と制御信号（黄）を色で区別し、右パネルに各信号の値と日本語の解説を表示します。

<img src="docs/screenshot.png" alt="スクリーンショット" />

## 対応命令

| 命令 | 型 | 動作 |
|------|-----|------|
| `add x1, x2, x3` | R | x1 ← x2 + x3 |
| `lw x1, 8(x2)` | I | x1 ← mem[x2 + 8] |
| `sw x3, 8(x2)` | S | mem[x2 + 8] ← x3 |
| `beq x1, x2, L` | B | x1 == x2 なら PC + imm へ分岐 |

各命令について **Fetch / Decode / Execute / Memory / Writeback** の5ステージを順に確認できます。

## 使い方

1. 上部の命令タブで命令を選択
2. ステージタブをクリック、または **← →** キーでステージを切り替え
3. 青いモジュール・ワイヤがそのステージでアクティブな箇所
4. 右パネルでシグナル値・説明・ALU内部図を確認

## ローカル開発

```bash
git clone https://github.com/97kuek/riscv-cpu-viz.git
cd riscv-cpu-viz
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # 本番ビルド
npm run preview   # ビルド結果プレビュー
```

## 技術スタック

- React 18 + TypeScript + Vite
- Tailwind CSS v3
- Pure SVG（外部グラフライブラリなし）

## デプロイ

`gh-pages` ブランチに GitHub Pages としてデプロイされています。

```bash
npm run build
npx gh-pages -d dist
```

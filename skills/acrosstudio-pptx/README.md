# acrosstudio-pptx スキル

Acrosstudio ブランドの提案書・パーツ資料・打合せ資料を pptxgenjs で作成するスキルです。

## ディレクトリ構成

```
acrosstudio-pptx/
├── SKILL.md                  ★ スキル本体（差し替え可能）
├── README.md                 このファイル
├── assets/
│   ├── logo_black.png        通常スライド右上ロゴ
│   ├── logo_white.png        表紙・章扉右下ロゴ
│   └── cover_texture.jpg     表紙・章扉背景
├── examples/
│   ├── proposal_full.js      提案書フル
│   ├── proposal_section.js   提案セクション単体
│   ├── io_summary.js         入出力整理
│   ├── cost_estimate.js      運用費試算
│   ├── meeting_doc.js        打合せ資料
│   ├── roi_excel.py          ROI試算Excel
│   └── visual_samples/       各スライドのサンプル画像
└── reference/
    ├── design_rules.md       配色・フォント・座標の詳細ルール
    ├── content_patterns.md   言葉遣い・禁止語・構成パターン
    ├── document_types.md     文書タイプ別の構成
    └── visual_examples.md    視覚サンプル参照ガイド

## SKILL.md を差し替える方法

1. このフォルダの `SKILL.md` を新しいものに置き換える
2. zip を再作成して Claude のスキル設定からインストール

SKILL.md 以外のファイル（assets・examples・reference）は共通リソースのため、
通常は差し替え不要です。

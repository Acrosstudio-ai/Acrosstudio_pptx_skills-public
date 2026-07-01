# エンゲージメント・ワークスペース契約

これは `acrosstudio-engagement` オーケストレーターの正本契約です。オーケストレーターは作業ディレクトリ `engagement/` を作成し、番号付き成果物をそこへ書き出します。**バンド**はエンゲージメントのステージごとに既存スキルをグループ化したものです。各バンドは成果物番号の範囲とスキルのセットを持ちます。オーケストレーターはエンゲージメントに合ったスキルだけを実行します。

## バンド体系

| バンド | ステージ | スキル（エンゲージメントに合ったものを実行） | 成果物ファイル名 |
| --- | --- | --- | --- |
| `00` | インテーク | `acrosstudio-intake` | `engagement/00-intake.md` |
| `10`〜`19` | 診断 | `strat-situation-assessment`、`strat-growth-barriers`、`strat-assumption-audit` | `engagement/1x-<skill>.md` |
| `20`〜`29` | 選択・採算 | `strat-strategic-options`、`strat-business-case`、`strat-pricing`、`strat-portfolio-review` | `engagement/2x-<skill>.md` |
| `30`〜`39` | 実行 | `strat-operating-model`、`strat-initiative-prioritizer`、`strat-transformation-roadmap` | `engagement/3x-<skill>.md` |
| `40`〜`49` | コミュニケーション | `strat-narrative`、`strat-decision-memo`、`strat-stakeholder-alignment` | `engagement/4x-<skill>.md` |
| — | 成果物 | `acrosstudio-pptx`（`engagement/*.md` を読み込む） | `*.pptx` / `*.xlsx` |

## 契約のルール

- 各成果物は、戦略スキルの通常出力（`# <フレームワーク> — <対象>` で始まり `## 要点` / `## 確認事項` で締めくくる分析）をバンドのファイル名で保存したものです。
- バンド内では、エンゲージメントに必要なスキルのみを実行し、実行順に番号を振ります（例：`10-situation-assessment.md`、`11-growth-barriers.md`）。
- バンドを省略することは有効です。成果物作成ステップは存在する `engagement/*.md` ファイルを読み込みます。
- 貴社の数値を勝手に作成しません。オーケストレーターはすべての `## 確認事項` 項目を利用者へ差し戻し、成果物を作成する前に確認を取ります。

## 実施例（架空）

このマッピングは例示のみを目的とします。架空の貴社「**株式会社ミドリ精工**」（精密部品メーカー）の成長戦略ご提案を用います。数値は作成しておらず、このウォークスルーはオーケストレーションの各ステップが成果物ファイル名にどう対応するかのみを示します。

| ステップ | 実行スキル | バンド | 書き出す成果物 |
| --- | --- | --- | --- |
| 1. インテーク | `acrosstudio-intake` | `00` | `engagement/00-intake.md` |
| 2. 現状診断 | `strat-situation-assessment` | `10`〜`19` | `engagement/10-situation-assessment.md` |
| 3. 成長の選択肢整理 | `strat-strategic-options` | `20`〜`29` | `engagement/20-strategic-options.md` |
| 4. 有力オプションの採算構築 | `strat-business-case` | `20`〜`29` | `engagement/21-business-case.md` |
| 5. 展開フェーズ計画 | `strat-transformation-roadmap` | `30`〜`39` | `engagement/30-transformation-roadmap.md` |
| 6. 主要メッセージ構築 | `strat-narrative` | `40`〜`49` | `engagement/40-narrative.md` |
| 7. 成果物作成 | `acrosstudio-pptx` | 成果物 | `midori-seiko-growth-proposal.pptx`（＋`midori-seiko-business-case.xlsx`） |

このウォークスルーに関する補足：

- ステップ 3 と 4 はどちらも選択・採算バンドに属するため、そのバンドの範囲内で実行順に番号を取ります（`20` → `21`）。
- 診断バンドでは `strat-situation-assessment` のみを実行します。`strat-growth-barriers` と `strat-assumption-audit` はこのエンゲージメントでは不要なため省略します。これは有効です。成果物作成ステップは存在する成果物のみを読み込みます。
- 各バンド終了後、オーケストレーターはそのバンドの `## 確認事項`（例：ミドリ精工の確定売上高や回収期間の前提。いずれも例示・確認前）を集約し、利用者の確認を得てから次のバンドへ進みます。未確認の数値を推測で埋めることはしません。
- ステップ 7 はすべての `engagement/*.md` 成果物を `acrosstudio-pptx` へ渡し、ワークスペースの内容から複合成果物を組み立てます。

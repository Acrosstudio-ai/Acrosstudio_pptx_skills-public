# 視覚サンプル参照

`examples/visual_samples/` に過去資料の代表的なスライド画像を配置。
新規資料作成時に「**こういう見た目を目指す**」 という参照に。

## サンプル一覧

### 提案書フル（フル提案書サンプル）

| ファイル | 内容 |
|---|---|
| `proposal_full_cover.jpg` | 表紙（テクスチャ背景、白ロゴ右下、Ver/日付左下） |
| `proposal_full_proposal.jpg` | 提案セクション（リード文、3 カード効果） |
| `proposal_full_pricing.jpg` | 概算金額感（3 案 × 4 項目テーブル） |
| `proposal_full_steps.jpg` | 進め方（4 STEP 横並びカード） |

### パーツ資料

| ファイル | 内容 |
|---|---|
| `io_summary_sample.jpg` | 入出力整理（3 カラム：入力/AI 処理/出力） |
| `cost_estimate_sample.jpg` | 運用費試算（2 カラム：クラウド/オンプレ） |
| `roi_summary_sample.jpg` | ROI 試算 Excel のサマリシート |
| `roi_theme_sample.jpg` | ROI 試算 Excel のテーマシート（内訳・効果・ROI） |
| `proposal_section_sample.jpg` | 提案セクション単体（章番号 + リード + 内容 + 入出力 + 効果） |
| `meeting_cover_sample.jpg` | 打合せ資料の表紙（タイトル + メタ情報） |
| `meeting_keypoints_sample.jpg` | 議事録の要点・決定事項（番号バッジ） |
| `meeting_options_sample.jpg` | 検討資料の選択肢比較（3 カード、推奨は MAGENTA ヘッダー） |

## 使い方

新しい資料を作成する際の参照フロー：

1. **作成する文書タイプを確認** → `reference/document_types.md`
2. **デザインルールを確認** → `reference/design_rules.md`
3. **コンテンツルールを確認** → `reference/content_patterns.md`
4. **視覚サンプルで見た目を確認** ← ここで `visual_samples/` を参照
5. **examples の該当スクリプトをベースに改変**

## サンプルの見方

各サンプル画像で注目すべき点：

### 表紙（proposal_full_cover.jpg）
- テクスチャ背景を全面に配置
- タイトルの位置（中央左寄り）
- 白ロゴの位置（右下）
- Ver / 日付の位置（左下）
- 通常スライドと違って**黒ロゴ・コピーライトを表示しない**

### 提案セクション（proposal_full_proposal.jpg）
- 章番号付きタイトル（「3.1 提案 1 ─ XXX」）
- リード文（黒字、太字、14pt）
- 内容セクション（リード + 3 ポイント）
- 入力・出力の 2 カラム
- 期待される効果の 3 カード（タイトル + 本文）

### 概算金額感（proposal_full_pricing.jpg）
- 3 案 × 4 項目のテーブル
- ヘッダー：NAVY 背景、白字
- 数値は右揃え、3 桁カンマ区切り
- 注記（GRAY_MID、11pt）

### 進め方（proposal_full_steps.jpg）
- 4 STEP 横並び
- 各 STEP に番号（円形バッジ）+ タイトル + 期間 + 内容
- 矢印で次へ繋ぐ

### 入出力整理（io_summary_sample.jpg）
- タイトル：「01 故障予知保全 ─ 入力と出力の整理」
- ユーザー欄（「保全担当の方」）
- リード文（NAVY_LIGHT 帯）
- 3 カラム：入力（CLIENT 青ヘッダー）/ AI 処理（NAVY ヘッダー）/ 出力（MAGENTA ヘッダー）

### 運用費試算（cost_estimate_sample.jpg）
- 前提（NAVY_LIGHT 帯）
- 2 カラム：クラウド構成（CLIENT 青）/ オンプレ構成（MAGENTA）
- 各カラムに内訳項目 + 月額・年額合計
- 注記（11pt、GRAY_MID）

### ROI Excel サマリ（roi_summary_sample.jpg）
- 4 テーマの ROI 一覧
- ヘッダー行：NAVY 背景
- データ行：薄いグレー背景
- 留意事項（複数行の注記）

### ROI Excel テーマシート（roi_theme_sample.jpg）
- 投資コスト → 年間運用保守 内訳 → 効果項目 → ROI 試算 の順
- 入力セル：黄色背景
- 計算セル：グレー背景
- 結果セル：NAVY 背景 + 白字

## 注意点

- サンプルは **架空のサンプル案件（製造装置・PC 修理）のもの**
- 他業界の案件に流用する際は、**コンテンツの中身は変える**が、**デザインは維持**
- 客先固有名（型式 WX-1 等）はサンプル内でも抽象化済み

## 新規案件での参照優先順位

1. **同じ業界・同じ規模**の過去案件があれば、それを最優先で参照
2. なければ、**最も近い文書タイプ**のサンプルを参照
3. **デザインは厳密に守る**、コンテンツは案件に合わせて柔軟に

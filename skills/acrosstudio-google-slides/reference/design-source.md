# Acrosstudio デザインの正本と Slides への適用

デザインの正本は同じ公開リポジトリの `skills/acrosstudio-pptx/` です。別の Google スライドテンプレートではありません。以下は原本を固定した版で取得するための手順であり、ブランド規則の独立したコピーではありません。

## 原本を取得する

QM の pack importer は画像入りの PPTX スキルを除外しますが、それはデザインを捨てる理由にはなりません。公開リポジトリから規則・例・画像を一緒に取得します。GitHub トークンは不要です。独立した `.skill` バンドルから利用する場合も同じ手順です。

```bash
design_work=$(mktemp -d) && \
git clone --quiet --no-checkout https://github.com/Acrosstudio-ai/Acrosstudio_pptx_skills-public "$design_work/source" && \
git -C "$design_work/source" checkout --quiet --detach c1b1c61789e92c930fb9e71606c0a398c8b7af3f && \
DESIGN_DIR="$design_work/source/skills/acrosstudio-pptx"
```

`DESIGN_DIR` の絶対パス配下をファイル読み取りツールで開きます。原本の改訂を取り込むときは、この固定コミットと下記の画像 URL を同じ版へ更新し、表示を再検証します。可変の `main` へ無断で追従しません。

| 原本 | 使用目的 |
| --- | --- |
| `SKILL.md` | 絶対ルール、配色・文字・マスター・余白・内容の規約。矛盾時の優先元。 |
| `reference/design_rules.md` | 詳細な位置・寸法・マスター・章扉・アジェンダ。 |
| `reference/content_patterns.md` | Acrosstudio の文体、表現、推測しない数値の扱い。 |
| `reference/document_types.md` | 提案書・打合せ資料などの構成。 |
| `examples/proposal_full.js`、`proposal_section.js`、`meeting_doc.js` など | 依頼に最も近いレイアウトの土台。値が絶対ルールと異なれば絶対ルールを優先。 |
| `assets/logo_black.png`、`logo_white.png`、`cover_texture.jpg` | 実際に使うロゴと表紙・章扉の背景。 |

原本の規則を読み、例と画像を見てから Slides のリクエストを組み立てます。Google 出力のために元の pptxgenjs を実行する必要はありません。原本内の Claude 専用パスや納品ツールではなく、このスキルの Google 接続・納品手順を使います。

## 同じ画像を Google スライドに入れる

`createImage.url` には、同じ固定版にある公開画像 URL を指定できます。Google が取得する URL に認証情報や顧客情報を付けません。

- 黒ロゴ：`https://raw.githubusercontent.com/Acrosstudio-ai/Acrosstudio_pptx_skills-public/c1b1c61789e92c930fb9e71606c0a398c8b7af3f/skills/acrosstudio-pptx/assets/logo_black.png`
- 白ロゴ：`https://raw.githubusercontent.com/Acrosstudio-ai/Acrosstudio_pptx_skills-public/c1b1c61789e92c930fb9e71606c0a398c8b7af3f/skills/acrosstudio-pptx/assets/logo_white.png`
- 表紙テクスチャ：`https://raw.githubusercontent.com/Acrosstudio-ai/Acrosstudio_pptx_skills-public/c1b1c61789e92c930fb9e71606c0a398c8b7af3f/skills/acrosstudio-pptx/assets/cover_texture.jpg`

Google が画像を取得できなければ原因を報告して確認を待ち、ロゴや背景を省略した完成品を渡しません。表紙・章扉はテクスチャを最背面の画像として配置し、その上に原本の白文字・白ロゴを置きます。通常ページは原本の黒ロゴとコピーライトを使います。

## 座標と文字サイズを変換する

Google Slides の `pageSize` を読みます。原本のワイド画面は 13.333333 × 7.5 inch です。Google の既定のワイド画面は物理寸法が異なるため、インチに 72 を掛けるだけで終わらせず、実際のページ幅に合わせます。

```javascript
const widthPt = pageSize.width.unit === 'EMU' ? pageSize.width.magnitude / 12700 : pageSize.width.magnitude
const heightPt = pageSize.height.unit === 'EMU' ? pageSize.height.magnitude / 12700 : pageSize.height.magnitude
if (Math.abs(widthPt / heightPt - 16 / 9) > 0.01) throw new Error('ワイド画面と異なるため、レイアウト変更の範囲を確認してください')
const ptPerInch = widthPt / 13.333333
const positionPt = inch => inch * ptPerInch
const fontPt = originalPt => originalPt * ptPerInch / 72
```

原本の x・y・w・h・余白には `positionPt`、文字サイズには `fontPt` を使い、同じ比率を保ちます。`createShape` / `createImage` の `elementProperties.size` と `transform.translateX/translateY` は pt に変換し、`scaleX: 1`、`scaleY: 1`、`unit: "PT"` を指定します。元の数値を別の独自レイアウトに置き換えません。

色は原本の HEX を Google の `rgbColor`（各成分 0〜1）へ変換します。文字は `updateTextStyle`、背景・枠は `updateShapeProperties`、段落配置は `updateParagraphStyle` で設定します。見出し・リード文・本文の文字サイズ差、日英フォントの使い分け、余白も同じ倍率で引き継ぎます。指定フォントが実際に使われているかはサムネイルまたはブラウザーで確認し、無断で代替フォントに置き換えません。

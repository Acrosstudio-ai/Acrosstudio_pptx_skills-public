# デザインルール詳細

Acrosstudio 資料のデザイン仕様。コードに直接落とせる粒度で記述。

## 1. 配色

### カラーパレット

| 名前 | HEX | RGB | 用途 |
|---|---|---|---|
| NAVY | `#073763` | (7, 55, 99) | メインカラー、見出し、強調 |
| NAVY_LIGHT | `#DCE6F0` | (220, 230, 240) | 背景帯、リード文枠、アジェンダ現在地 |
| CLIENT | `#2C7DA6` | (44, 125, 166) | 顧客コーポレートカラーのフォールバック専用（スライド要素の色付けには使わない） |
| CLIENT_LIGHT | `#D9E5EC` | (217, 229, 236) | 使用禁止（CLIENT同様、スライド要素の色付けには使わない） |
| MAGENTA | `#A22B94` | (162, 43, 148) | After 側・提案側・効果カード左バーのみ |
| MAGENTA_LIGHT | `#F4E4F0` | (244, 228, 240) | 出力カード背景補助、注意喚起の薄ピンク |
| GRAY_BG | `#F5F5F5` | (245, 245, 245) | 一般背景 |
| GRAY_LINE | `#BFBFBF` | (191, 191, 191) | 罫線・カード枠 |
| GRAY_MID | `#595959` | (89, 89, 89) | 補足・注記の文字 |
| TEXT_DARK | `#262626` | (38, 38, 38) | 本文の文字 |
| WHITE | `#FFFFFF` | (255, 255, 255) | 背景・カード塗りつぶし |
| RED | `#C92A2A` | (201, 42, 42) | 警告・否定・×マーク（注意して使用） |

### 配色の使い分け

- **NAVY**：Acrosstudio のブランドカラー＝**主色**。タイトル、章番号、見出し、強調枠線、矢印、進行系アクセント。迷ったら NAVY。
- **MAGENTA（ピンク）**：Before↔After 対比の After・提案側と、効果カード左バーのみ。Before・現状・入力側は NAVY。`CLIENT`（青）は顧客コーポレートカラーのフォールバック定数であり、スライド要素の色付けには使わない。
- **NAVY_LIGHT**：リード文の背景帯、控えめな強調、アジェンダの現在地ハイライト。
- **GRAY_MID**：注記、補足、コピーライト。
- **MAGENTA_LIGHT**：注意喚起の薄ピンク枠のみ。
- **RED**：避ける。どうしても警告を示すときのみ。

#### MAGENTA を使ってよい箇所（これ以外では使わない）
1. 入力 ↔ 出力 の対比における**出力側**ヘッダー
2. 従来 ↔ 提案／Before ↔ After の対比における**提案・After 側**
3. 「期待される効果」3 カードの**左アクセントバー＋枠線**

❌ 次のような“汎用アクセント”としての MAGENTA は誤り → すべて NAVY にする：
- プロセス矢印・ステップ間矢印
- 章番号の下線や装飾
- 「追加機能」「STEP」ブロックの帯（Acrosstudio の提供物は NAVY）
- ロードマップ／ガントの一部フェーズだけを紫にする（CLIENT→NAVY→NAVY の進行で表現）

> 紫を置く前に必ず自問：「これは対比か、効果か？」どちらでもなければ NAVY。

#### 顧客コーポレートカラー（CLIENT_BRAND）
提案書は Acrosstudio が出す資料。スライド全体の基調は NAVY で統一する。顧客のコーポレートカラーが指定されている場合は、`CLIENT_BRAND` 定数として定義しロゴ横などごく小面積のアクセントに留める。`CLIENT`（`#2C7DA6`）はこの定数のフォールバック値に過ぎず、スライド要素の色付けには使わない。

```javascript
// 顧客カラーは 1 箇所で定義。未指定なら CLIENT にフォールバック
const CLIENT_BRAND = "XXXXXX" || "2C7DA6";
```

- **使わない**：カードヘッダー・入力カード・比較元側の帯・タイトル・章番号・Acrosstudio の提供物・ロゴ/コピーライト。
- **取得**：①ユーザー指定 → ②`web_search`（"{企業名} brand color hex" / ロゴ・ブランドガイド）→ ③不明ならユーザーに確認（推測で確定しない）。
- **可読性**：明るい/淡い顧客カラーは白文字が乗らない。小面積に留め、**必ず PDF 化して可読性を視覚確認**する。

## 2. フォント

### 種類
- **日本語**: BIZ UDPGothic
- **英数字**: Arial（パワーポイントで利用可能な標準フォント）

### サイズ基準

| 用途 | 標準サイズ | 範囲 |
|---|---|---|
| スライドタイトル | 22pt | 22 |
| 章番号付きタイトル（例：「1. 背景」） | 22pt | 22 |
| セクション大見出し | 16pt | 14〜16 |
| セクション見出し | 14pt | 13〜15 |
| カードタイトル | 13pt | 12〜14 |
| **リード文** | **14pt（太字、TEXT_DARK）** | 14 |
| 本文 | 12pt | 11〜13 |
| 表内本文 | 12pt | 11〜13 |
| 注記・補足 | 11pt（GRAY_MID） | 10〜11 |
| コピーライト | 8pt（GRAY_MID） | 8 |

### 太字の使い方
- **太字にするもの**：タイトル、見出し、リード文、ラベル、合計値、強調語
- **太字にしないもの**：本文、補足、注記

## 3. スライドサイズ

### 標準
- **LAYOUT_WIDE**: 13.33 × 7.5 inch（PowerPoint 標準ワイドスクリーン）
- pptxgenjs では `pres.layout = "LAYOUT_WIDE"`

### 旧サイズへの注意
- 過去の資料で 10 × 5.625 inch（LAYOUT_16x9）の場合あり
- LAYOUT_WIDE へスケール変換する場合：座標を **1.333 倍**

## 4. マスター要素（全スライド共通）

### 黒ロゴ（通常スライド右上）

```javascript
{ image: {
    path: "assets/logo_black.png",
    x: 10.427, y: 0.10, w: 2.903, h: 0.792  // 絶対ルール固定値。変更禁止
  }
}
```

### コピーライト（通常スライド右下）

```javascript
{ text: {
    text: "Copyright 2026. Acrosstudio, Inc. <Confidential>",
    options: {
      x: 7.332, y: 7.092, w: 5.599, h: 0.293,
      fontSize: 8, fontFace: "Arial", color: "595959",
      align: "right", valign: "middle",
    }
  }
}
```

年は作成年（例：2026）を入れる。

### スライドマスター定義例（pptxgenjs）

```javascript
pres.defineSlideMaster({
  title: "MASTER",
  background: { color: "FFFFFF" },
  objects: [
    { image: { path: "assets/logo_black.png", x: 10.427, y: 0.10, w: 2.903, h: 0.792 } },  // 絶対ルール固定値
    { text: {
        text: "Copyright 2026. Acrosstudio, Inc. <Confidential>",
        options: {
          x: 7.332, y: 7.092, w: 5.599, h: 0.293,
          fontSize: 8, fontFace: "Arial", color: "595959",
          align: "right", valign: "middle",
        }
      }
    },
  ],
});
```

## 5. 表紙ルール

### 構成要素
- **背景**: `assets/cover_texture.jpg`（テクスチャ画像、背景全面）
- **白ロゴ**: 右下（座標例：x: 10.5, y: 6.5, w: 1.5, h: 0.6）
- **Ver / 日付**: 左下（例：「Ver 0.1 / 2026-05-12」）
- **タイトル**: 中央左寄り（白文字 or NAVY 文字、フォントサイズ大きめ 36〜44pt）

### 表紙のスライドマスター
表紙は通常マスターと別に定義（コピーライト・黒ロゴを表示しない）：

```javascript
pres.defineSlideMaster({
  title: "MASTER_COVER",
  background: { path: "assets/cover_texture.jpg" },
  // 通常のロゴ・コピーライトは入れない
});
```

## 5.5 章扉・アジェンダ（任意）

### 章扉（セクション扉）
標準フル提案書では省略可。挿入する場合は**表紙と同じ仕様**で統一する（テクスチャ背景＋白文字＋白ロゴ右下、コピーライト・黒ロゴなし）。**ネイビー一色塗りの独自背景やマゼンタ下線などの独自装飾は作らない。**

```javascript
function buildDivider(num, title) {
  const s = pres.addSlide({ masterName: "MASTER_COVER" }); // 表紙と同じテクスチャ背景
  // 章番号（白・大）
  s.addText(num, {
    x: 0.90, y: 2.55, w: 3.0, h: 1.0,
    fontSize: 54, bold: true, fontFace: FONT_EN, color: C.WHITE, valign: "middle",
  });
  // 章タイトル（白）
  s.addText(title, {
    x: 0.90, y: 3.55, w: 11.0, h: 0.9,
    fontSize: 28, bold: true, fontFace: FONT_JP, color: C.WHITE, valign: "middle",
  });
  // 白ロゴ右下
  s.addImage({ path: "assets/logo_white.png", x: 11.30, y: 6.85, w: 1.50, h: 0.406 });
}
```

### アジェンダ（目次）
任意。通常マスター（白背景＋黒ロゴ＋コピーライト）上に、規約内要素だけで作る。**MAGENTA は使わない**（対比でも効果でもないため）。各章を 1 行カードで縦並びにし、左に NAVY 番号バッジ、現在地は NAVY_LIGHT でハイライト。

```javascript
function buildAgenda(currentNum) {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  addSlideTitle(s, "本日のアジェンダ");
  addSubMessage(s, "本提案は以下の流れでご説明いたします。");

  const items = [
    { num: "1", title: "弊社理解", body: "..." },
    { num: "2", title: "ご提案内容", body: "..." },
    { num: "3", title: "スケジュールおよびお見積り", body: "..." },
    { num: "4", title: "今後の進め方", body: "..." },
  ];
  const rowH = 1.00, startY = 2.20;
  items.forEach((it, i) => {
    const y = startY + i * (rowH + 0.15);
    const isCur = it.num === String(currentNum);
    s.addShape("rect", { x: 0.533, y, w: 12.264, h: rowH,
      fill: { color: isCur ? C.NAVY_LIGHT : C.WHITE },
      line: { color: isCur ? C.NAVY : C.GRAY_LINE, width: isCur ? 1.2 : 0.7 } });
    s.addShape("rect", { x: 0.533, y, w: 1.10, h: rowH, fill: { color: C.NAVY }, line: { type: "none" } });
    s.addText(it.num, { x: 0.533, y, w: 1.10, h: rowH,
      fontSize: 30, bold: true, fontFace: FONT_EN, color: C.WHITE, align: "center", valign: "middle" });
    s.addText(it.title, { x: 1.90, y: y + 0.14, w: 10.6, h: 0.45,
      fontSize: 17, bold: true, fontFace: FONT_JP, color: C.NAVY, valign: "middle" });
    s.addText(it.body, { x: 1.90, y: y + 0.58, w: 10.6, h: 0.40,
      fontSize: 12, fontFace: FONT_JP, color: C.GRAY_MID, valign: "middle" });
  });
}
```

> 章扉・アジェンダは標準構成では**任意**。入れる/入れないはユーザーの指示に従い、勝手に独自デザインの章扉を量産しない。

## 6. スライドタイトルのスタイル

### 標準的なタイトル（章番号付き）

```javascript
function addSlideTitle(s, text) {
  // 縦線（NAVY）
  s.addShape("rect", {
    x: 0.267, y: 0.40, w: 0.08, h: 0.666,
    fill: { color: "073763" }, line: { color: "073763", width: 0 },
  });
  // タイトル本体
  s.addText(text, {
    x: 0.533, y: 0.333, w: 10.50, h: 0.80,
    fontSize: 22, bold: true, fontFace: "BIZ UDPGothic", color: "073763",
    valign: "middle",
  });
}
```

例：「1.  背景と過去の検討」「3.1  提案 1 ─ 受領時の状態記録自動化」

## 7. リード文（サブメッセージ）のスタイル

スライドタイトルの直下に置く 1〜2 行の説明文。

```javascript
function addSubMessage(s, text) {
  s.addText(text, {
    x: 0.533, y: 1.226, w: 10.797, h: 0.666,
    fontSize: 14, fontFace: "BIZ UDPGothic", color: "262626",
    bold: true,  // リード文は太字
    align: "left", valign: "middle",
  });
}
```

**重要**：リード文の色は **TEXT_DARK（黒字）** に統一。グレーは使わない。

## 8. カードのスタイル

### 基本構造（オブジェクト数を最小化する）

カード本体の枠は「複数の子要素を内包するコンテナ」なので rect でよい。**ヘッダー帯は rect と text を重ねず、text に `fill` を直接指定して 1 オブジェクトにする**（環境で描画確認済み）。

```javascript
// カード本体（白背景 + 色付き枠線）= 子要素を内包するコンテナなので rect でOK
s.addShape("rect", {
  x, y, w, h,
  fill: { color: "FFFFFF" },
  line: { color: "073763", width: 1.5 },  // 強調なら 1.5、控えめなら 0.7
});

// ❌ 旧：ヘッダー帯（rect）＋ ヘッダーテキスト の 2 オブジェクト重ね → 座標二重管理
// s.addShape("rect", { x, y, w, h: 0.55, fill: { color: "073763" }, line: { type: "none" } });
// s.addText("ヘッダー", { x, y, w, h: 0.55, color: "FFFFFF", ... });

// ✅ 新：ヘッダー帯はテキスト 1 個に fill を直接指定
s.addText("ヘッダー", {
  x, y, w, h: 0.55,
  fontSize: 15, bold: true, fontFace: "BIZ UDPGothic", color: "FFFFFF",
  fill: { color: "073763" }, line: { type: "none" },
  align: "center", valign: "middle",
  inset: 0.2,  // 左寄せヘッダーの内側余白（margin は効かない）
});
```

> 原則：「その rect は文字を載せるためだけにあるか？」が Yes なら text の `fill` に統合する。
> rect を残すのは、①文字を載せない純粋な装飾（縦アクセントバー・区切り線・矢印）②複数の子要素を内包するカード枠、のみ。
> 角丸ヘッダーは `shape: "roundRect", rectRadius: 0.05` を text に付ければ rect 不要。

### カードの色使い分け
- **入力カード**: NAVY のヘッダー
- **AI 処理カード**: NAVY のヘッダー
- **出力カード**: NAVY のヘッダー（入力↔出力の色分けは行わない）
- **クラウド構成**: NAVY のヘッダー
- **オンプレ構成**: NAVY のヘッダー
- **対比（Before vs After）**: NAVY（現状・Before）vs MAGENTA（新提案・After）

> **すべてのカードヘッダーは NAVY が基本。** MAGENTA は Before↔After 対比の After 側のみ。

## 9. 表（テーブル）のスタイル

### ヘッダー行
- 背景: NAVY
- 文字色: WHITE
- フォント: 12pt、太字、中央揃え

### データ行
- 背景: WHITE（ストライプにするなら GRAY_BG を交互）
- 文字色: TEXT_DARK
- フォント: 12pt
- 罫線: GRAY_LINE、thin

```javascript
const cols = ["項目", "金額", "備考"];
const headerStyle = {
  bold: true, color: "FFFFFF", fill: { color: "073763" },
  align: "center", valign: "middle", fontSize: 12,
};
```

## 10. 効果セクション（3 カード形式）

期待される効果は **3 カード**で表現。各カードに「タイトル + 説明」。

```javascript
// 3 カード横並び
const eCardW = 3.999;
const eCardGap = 0.10;
effects.forEach((eff, i) => {
  const ex = 0.533 + i * (eCardW + eCardGap);
  // カード本体（MAGENTA 枠線）
  s.addShape("rect", {
    x: ex, y, w: eCardW, h: 1.30,
    fill: { color: "FFFFFF" }, line: { color: "A22B94", width: 1.0 },
  });
  // 左の MAGENTA 縦線（アクセント）
  s.addShape("rect", {
    x: ex, y, w: 0.10, h: 1.30,
    fill: { color: "A22B94" }, line: { color: "A22B94", width: 0 },
  });
  // タイトル
  s.addText(eff.title, {
    x: ex + 0.25, y: y + 0.10, w: eCardW - 0.35, h: 0.40,
    fontSize: 13, bold: true, fontFace: "BIZ UDPGothic", color: "073763",
    valign: "middle",
  });
  // 本文
  s.addText(eff.body, {
    x: ex + 0.25, y: y + 0.50, w: eCardW - 0.35, h: 0.75,
    fontSize: 11, fontFace: "BIZ UDPGothic", color: "262626",
    valign: "top",
  });
});
```

## 11. 内容セクション（リード + ポイント構造）

「内容」 セクションは 1 段落の長文ではなく、構造化する：

```javascript
// 内容セクション枠
s.addShape("rect", {
  x: 0.533, y: 1.95, w: 12.264, h: 1.40,
  fill: { color: "DCE6F0" }, line: { color: "073763", width: 0.5 },
});
// ラベル「内容」
s.addText("内容", {
  x: 0.866, y: 2.05, w: 1.333, h: 0.32,
  fontSize: 11, bold: true, fontFace: "BIZ UDPGothic", color: "073763",
  valign: "middle",
});
// リード文（1 行で何をするか）
s.addText(content.lead, {
  x: 0.866, y: 2.35, w: 11.597, h: 0.40,
  fontSize: 14, bold: true, fontFace: "BIZ UDPGothic", color: "073763",
  valign: "middle",
});
// 3 ポイント（横並び）
const pW = (12.264 - 0.30) / 3;
content.points.forEach((p, i) => {
  const px = 0.533 + i * (pW + 0.05);
  s.addText("● " + p, {
    x: px + 0.20, y: 2.80, w: pW - 0.30, h: 0.50,
    fontSize: 12, fontFace: "BIZ UDPGothic", color: "262626",
    valign: "top",
  });
});
```

## 12. 矢印・図形

### 右向き矢印（プロセスフローで使用）

```javascript
s.addShape("rightTriangle", {
  x: 5.0, y: 3.5, w: 0.16, h: 0.30,
  fill: { color: "073763" }, line: { color: "073763", width: 0 },
  rotate: 90,
});
```

### 業務フローのボックス

```javascript
s.addShape("roundRect", {
  x: 0.5, y: 2.5, w: 1.5, h: 0.6,
  fill: { color: "D9E5EC" }, line: { color: "2C7DA6", width: 1 },
  rectRadius: 0.05,
});
```

## 13. 余白・余白の取り方

### 標準余白
- 左右マージン: 0.533 inch ずつ
- 上：タイトル領域 0〜1.20、コンテンツ 1.20〜
- 下：コピーライト領域 7.09〜7.50

### コンテンツ領域
- y: 1.20 〜 7.00 程度（コピーライトと重ならない範囲）
- 高さ 5.80 程度を使える

### カード間ギャップ
- カード間: 0.10〜0.20 inch
- セクション間: 0.20〜0.40 inch

## 14. Excel（xlsx）のスタイル

### 配色
PowerPoint と同じカラーパレットを使用。

### スタイル
- **入力セル**：黄色背景（`#FFF2CC`）+ 青字（`#0070C0`）+ 太字
- **計算セル**：グレー背景（`#F2F2F2`）
- **結果セル**：NAVY 背景 + 白字 + 太字
- **ヘッダー行**：NAVY 背景 + 白字 + 中央揃え
- **罫線**：thin、グレー（#999999）

### 数式
- 数値書式: `#,##0`（千の位区切り）
- パーセント: `0.0%`
- 年: `0.0"年"`

## 15. 注意点

### 避けるべきこと
- ❌ ピクセル単位での座標ずれ（pptxgenjs は inch 単位）
- ❌ フォントサイズの不統一（同種要素は同じサイズに）
- ❌ コピーライト・ロゴと本文の重なり
- ❌ カラーパレット外の色を使う
- ❌ BIZ UDPGothic 以外の日本語フォント

### 推奨
- ✅ pptxgenjs で `pres.layout = "LAYOUT_WIDE"` を必ず指定
- ✅ マスターを定義して、共通要素は一元管理
- ✅ 座標は変数として持つ（colW, colY 等）
- ✅ ビルド後に必ず PDF 化 → 画像確認

## 16. 章番号付与のパターン

提案書では章番号でスライドの位置づけを明確に示す。

### 標準的な章番号体系

| 章 | 内容例 | サンプルタイトル |
|---|---|---|
| 1. 背景 | 案件背景・課題 | 「1. 背景と過去の検討」 |
| 1.1 | 詳細セクション | 「1.1 業務フロー」「1.2 過去の検討経緯」 |
| 2. 方向性 | 提案の全体像 | 「2. 本提案の方向性」 |
| 3. 提案 | 個別提案 | 「3. ご提案」 |
| 3.1 | 提案 1 | 「3.1 提案 1 ─ ◯◯」 |
| 3.2 | 提案 2 | 「3.2 提案 2 ─ ×××」 |
| 3.3 | 提案 3 | 「3.3 提案 3 ─ △△△」 |
| 4. 金額 | 概算金額 | 「4. 概算金額感」 |
| 5. 進め方 | 次のステップ | 「5. 進め方・次のステップ」 |
| Appendix | 補足 | 「Appendix  今後の展開候補」 |

### 章番号のスタイル

```javascript
function addChapterTitle(s, num, title) {
  // 縦線（NAVY）
  s.addShape("rect", {
    x: 0.267, y: 0.40, w: 0.08, h: 0.666,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
  });
  // 章番号 + タイトル
  s.addText(`${num}  ${title}`, {
    x: 0.533, y: 0.333, w: 10.50, h: 0.80,
    fontSize: 22, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
}

// 使い方
addChapterTitle(s, "3.1", "提案 1 ─ 受領時の状態記録自動化");
addChapterTitle(s, "1.", "背景と過去の検討");
addChapterTitle(s, "Appendix", "今後の展開候補");
```

### 区切り記号
- 章番号と本文の間：「**全角スペース 2 個**」 推奨
- 「─」（全角ダッシュ）でサブタイトルと区切り
- 例：「3.1  提案 1 ─ 受領時の状態記録自動化」

## 17. 表紙レイアウトの詳細

### 全体構成（座標）

| 要素 | 座標（inch） | 内容 |
|---|---|---|
| 背景 | 背景全面（スライド全体） | テクスチャ画像 |
| メインタイトル | x: 0.667, y: 2.50, w: 10.0, h: 1.20 | 大きく、太字、NAVY |
| サブタイトル | x: 0.667, y: 3.80, w: 10.0, h: 0.50 | やや小さく、TEXT_DARK |
| 白ロゴ | x: 11.5, y: 6.55, w: 1.466, h: 0.50 | 右下 |
| Ver / 日付 | x: 0.667, y: 6.80, w: 4.0, h: 0.40 | 左下 |

### タイトルのフォントサイズ
- メインタイトル：36〜44pt
- サブタイトル：18〜22pt
- Ver / 日付：12〜14pt

### 表紙の例（pptxgenjs）

```javascript
function buildCover(data) {
  // 表紙用マスター（コピーライト・黒ロゴなし）
  const s = pres.addSlide({ masterName: "MASTER_COVER" });

  // メインタイトル
  s.addText(data.title, {
    x: 0.667, y: 2.50, w: 10.0, h: 1.20,
    fontSize: 40, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });

  // サブタイトル
  if (data.subtitle) {
    s.addText(data.subtitle, {
      x: 0.667, y: 3.80, w: 10.0, h: 0.50,
      fontSize: 20, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "middle",
    });
  }

  // Ver / 日付（左下）
  s.addText(`Ver ${data.version}  /  ${data.date}`, {
    x: 0.667, y: 6.80, w: 4.0, h: 0.40,
    fontSize: 12, fontFace: FONT_EN, color: C.TEXT_DARK,
    valign: "middle",
  });

  // 白ロゴ（右下）
  s.addImage({
    path: "assets/logo_white.png",
    x: 11.5, y: 6.55, w: 1.466, h: 0.50,
  });
}
```

### 表紙マスターの定義（コピーライト・黒ロゴなし）

```javascript
pres.defineSlideMaster({
  title: "MASTER_COVER",
  background: { path: "assets/cover_texture.jpg" },
  // 通常のロゴ・コピーライトは入れない
});
```

## 18. 進め方・スケジュールのスタイル

### 4 STEP の横並び（進め方スライド）

```javascript
const steps = [
  { num: "STEP 1", title: "要件定義", period: "約 2 ヶ月", desc: "..." },
  { num: "STEP 2", title: "開発", period: "約 3〜4 ヶ月", desc: "..." },
  { num: "STEP 3", title: "実環境検証", period: "約 2〜3 ヶ月", desc: "..." },
  { num: "STEP 4", title: "運用・展開", period: "継続", desc: "..." },
];

const stepW = (12.264 - 0.30 * 3) / 4;
steps.forEach((step, i) => {
  const x = 0.533 + i * (stepW + 0.30);
  const y = 2.0;

  // カード本体
  s.addShape("rect", {
    x, y, w: stepW, h: 3.5,
    fill: { color: C.WHITE }, line: { color: C.NAVY, width: 1.5 },
  });

  // 番号バッジ
  s.addShape("ellipse", {
    x: x + (stepW / 2) - 0.4, y: y - 0.4, w: 0.8, h: 0.8,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
  });
  s.addText(String(i + 1), {
    x: x + (stepW / 2) - 0.4, y: y - 0.4, w: 0.8, h: 0.8,
    fontSize: 22, bold: true, fontFace: FONT_EN, color: C.WHITE,
    align: "center", valign: "middle",
  });

  // STEP ラベル
  s.addText(step.num, {
    x, y: y + 0.6, w: stepW, h: 0.40,
    fontSize: 12, fontFace: FONT_EN, color: C.NAVY,
    align: "center", valign: "middle",
  });

  // タイトル
  s.addText(step.title, {
    x, y: y + 1.0, w: stepW, h: 0.50,
    fontSize: 16, bold: true, fontFace: FONT_JP, color: C.NAVY,
    align: "center", valign: "middle",
  });

  // 期間
  s.addText(step.period, {
    x, y: y + 1.5, w: stepW, h: 0.40,
    fontSize: 12, fontFace: FONT_JP, color: C.GRAY_MID,
    align: "center", valign: "middle",
  });

  // 説明
  s.addText(step.desc, {
    x: x + 0.20, y: y + 2.0, w: stepW - 0.40, h: 1.30,
    fontSize: 11, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
  });

  // 矢印（次の STEP へ）
  if (i < steps.length - 1) {
    s.addShape("rightTriangle", {
      x: x + stepW + 0.05, y: y + 1.6, w: 0.20, h: 0.30,
      fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
      rotate: 90,
    });
  }
});
```

### スケジュールガントチャート

```javascript
// ヘッダー：月
const months = ["5月", "6月", "7月", "8月", "9月", "10月", "11月"];
const cellW = 0.7;
const startX = 4.5;

months.forEach((m, i) => {
  s.addShape("rect", {
    x: startX + i * cellW, y: 1.5, w: cellW, h: 0.5,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
  });
  s.addText(m, {
    x: startX + i * cellW, y: 1.5, w: cellW, h: 0.5,
    fontSize: 11, bold: true, color: C.WHITE,
    align: "center", valign: "middle",
  });
});

// 各フェーズの行（フェーズ名は案件に応じた一般的な名称でよい）
const phases = [
  { name: "要求整理・提案", start: 0, end: 1, status: "進行中" },
  { name: "要件定義",       start: 1, end: 3, status: "本提案範囲" },
  { name: "開発",           start: 3, end: 7, status: "概算範囲" },
];

phases.forEach((p, i) => {
  const rowY = 2.0 + i * 0.7;
  // フェーズ名
  s.addText(p.name, {
    x: 0.533, y: rowY, w: 3.7, h: 0.7,
    fontSize: 12, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
  // バー
  s.addShape("rect", {
    x: startX + p.start * cellW, y: rowY + 0.10, w: (p.end - p.start) * cellW, h: 0.50,
    fill: { color: p.status === "本提案範囲" ? C.MAGENTA : C.NAVY },
    line: { width: 0 },
  });
  s.addText(p.status, {
    x: startX + p.start * cellW, y: rowY + 0.10, w: (p.end - p.start) * cellW, h: 0.50,
    fontSize: 11, color: C.WHITE, bold: true,
    align: "center", valign: "middle",
  });
});
```

## 19. 業務フロー比較（Before / After）

現状業務と提案後業務を 2 行で対比。

```javascript
// Before（現状）
const beforeY = 2.0;
s.addText("【現状】", {
  x: 0.533, y: beforeY, w: 2.0, h: 0.40,
  fontSize: 13, bold: true, fontFace: FONT_JP, color: C.GRAY_MID,
});
const beforeSteps = ["受付", "目視確認", "手入力", "保管"];
beforeSteps.forEach((step, i) => {
  const x = 2.7 + i * 2.3;
  // ボックス（グレー）
  s.addShape("roundRect", {
    x, y: beforeY, w: 1.8, h: 0.60,
    fill: { color: C.GRAY_BG }, line: { color: C.GRAY_MID, width: 1 },
    rectRadius: 0.05,
  });
  s.addText(step, {
    x, y: beforeY, w: 1.8, h: 0.60,
    fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK,
    align: "center", valign: "middle",
  });
  // 矢印
  if (i < beforeSteps.length - 1) {
    s.addShape("rightTriangle", {
      x: x + 1.85, y: beforeY + 0.15, w: 0.16, h: 0.30,
      fill: { color: C.GRAY_MID }, line: { color: C.GRAY_MID, width: 0 },
      rotate: 90,
    });
  }
});

// After（提案後）
const afterY = beforeY + 1.0;
s.addText("【提案後】", {
  x: 0.533, y: afterY, w: 2.0, h: 0.40,
  fontSize: 13, bold: true, fontFace: FONT_JP, color: C.MAGENTA,
});
const afterSteps = ["受付", "AI 自動評価", "確認・修正", "保管"];
afterSteps.forEach((step, i) => {
  const x = 2.7 + i * 2.3;
  s.addShape("roundRect", {
    x, y: afterY, w: 1.8, h: 0.60,
    fill: { color: C.NAVY_LIGHT }, line: { color: C.NAVY, width: 1.5 },
    rectRadius: 0.05,
  });
  s.addText(step, {
    x, y: afterY, w: 1.8, h: 0.60,
    fontSize: 12, fontFace: FONT_JP, color: C.NAVY,
    bold: i === 1,  // AI 部分を強調
    align: "center", valign: "middle",
  });
  if (i < afterSteps.length - 1) {
    s.addShape("rightTriangle", {
      x: x + 1.85, y: afterY + 0.15, w: 0.16, h: 0.30,
      fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
      rotate: 90,
    });
  }
});
```

## 20. 提案セクションの推奨レイアウト

「提案 N」 のスライドの構成（提案書サンプル共通パターン）：

```
[章番号 + タイトル + サブタイトル]
（例：「3.1  提案 1 ─ 受領時の状態記録自動化」）

[リード文]（14pt、太字、黒字）
（例：「VLM がパーティクル画像を「言語化」 し、受付業務を効率化します。」）

[内容セクション]（NAVY_LIGHT 帯）
- ラベル「内容」
- リード（このセクションで何をするか、14pt 黒字太字）
- 3 ポイント横並び（12pt）

[入力 / 出力]（2 カラム）
- 入力（左、NAVY ヘッダー）4〜5 項目
- 出力（右、NAVY ヘッダー）3〜4 項目

[期待される効果]（3 カード横並び）
- カード 1：タイトル + 本文
- カード 2：タイトル + 本文
- カード 3：タイトル + 本文
```

各部の縦座標目安：
- タイトル: 0.40〜1.20
- リード文: 1.226〜1.892
- 内容セクション: 1.95〜3.35
- 入力 / 出力ヘッダー: 3.55〜3.95
- 入力 / 出力本体: 3.95〜5.50
- 効果カード: 5.65〜7.00

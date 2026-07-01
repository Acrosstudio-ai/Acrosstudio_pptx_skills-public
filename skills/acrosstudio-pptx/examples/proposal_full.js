// テクノリペア株式会社 御中（架空のサンプル企業）
// 修理工程における AI / VLM 活用ご提案（たたき台）
// 10 枚構成（表紙＋アジェンダ＋本文 8 枚）

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";  // 13.33 x 7.5 inch (PowerPoint 標準ワイドスクリーン)

// ─── カラー ───
const C = {
  NAVY:        "073763",
  NAVY_LIGHT:  "DCE6F0",
  CLIENT:      "2C7DA6",
  CLIENT_LIGHT:"D9E5EC",
  MAGENTA:     "A22B94",
  MAGENTA_LIGHT:"F4E4F0",
  GRAY_BG:     "F5F5F5",
  GRAY_LINE:   "BFBFBF",
  GRAY_MID:    "595959",
  TEXT_DARK:   "262626",
  WHITE:       "FFFFFF",
  GREEN:       "2D7D2D",
  AMBER:       "D97706",
  RED:         "C92A2A",
};

const FONT_JP = "BIZ UDPGothic";
const FONT_EN = "Arial";

// ─── スライドマスター（通常スライド用：白背景 + 右上ロゴ + 右下コピーライト）───
pres.defineSlideMaster({
  title: "MASTER_LIGHT",
  background: { color: C.WHITE },
  objects: [
    // 右上ロゴ（絶対ルール固定値。変更禁止）
    { image: {
        path: "assets/logo_black.png",
        x: 10.427, y: 0.10, w: 2.903, h: 0.792,
      }
    },
    // 右下コピーライト
    { text: {
        text: "Copyright 2026. Acrosstudio, Inc. <Confidential>",
        options: {
          x: 7.332, y: 7.092, w: 5.599, h: 0.293,
          fontSize: 8, fontFace: "Arial", color: C.GRAY_MID,
          align: "right", valign: "middle",
        }
      }
    },
  ],
});

// ─── 表紙・章扉用マスター（テクスチャ背景、ロゴ・コピーライトなし）───
pres.defineSlideMaster({
  title: "MASTER_COVER",
  background: { path: "assets/cover_texture.jpg" },
});

// ─── 共通要素 ───
function addSlideTitle(s, title) {
  s.addShape("rect", {
    x: 0.267, y: 0.4, w: 0.08, h: 0.666,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
  });
  s.addText(title, {
    x: 0.533, y: 0.333, w: 11.33, h: 0.8,
    fontSize: 22, bold: true, fontFace: FONT_JP, color: C.NAVY,
    align: "left", valign: "middle",
  });
}

function addSubMessage(s, text) {
  s.addText(text, {
    x: 0.533, y: 1.226, w: 10.797, h: 0.666,
    fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
    align: "left", valign: "middle",
  });
}

// addFooter は廃止（スライドマスターのコピーライトに置き換え）
function addFooter(_s) {
  // no-op
}

// 色帯付き見出し：rect と text を重ねず、addText に fill+inset を直接指定（単一オブジェクト）
function addSectionHeader(s, x, y, w, text, color) {
  s.addText(text, {
    x, y, w, h: 0.48,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.WHITE,
    fill: { color: color || C.NAVY }, line: { type: "none" },
    align: "left", valign: "middle", inset: 0.2,
  });
}

// ════════════════════════════════════════════════════════════════════════
// Slide 1：表紙
// ════════════════════════════════════════════════════════════════════════
function buildCover() {
  const s = pres.addSlide();

  // 背景：テクスチャ画像（フルスクリーン）
  s.addImage({
    path: "assets/cover_texture.jpg",
    x: 0, y: 0, w: 13.33, h: 7.5,
  });

  // 客先名：左上、白文字
  s.addText("テクノリペア株式会社 御中", {
    x: 0.60, y: 0.50, w: 8.00, h: 0.40,
    fontSize: 16, fontFace: FONT_JP, color: C.WHITE,
  });

  // タイトル（中央〜左寄せ）
  s.addText("PC 修理工程における", {
    x: 0.60, y: 2.80, w: 12.00, h: 0.70,
    fontSize: 28, bold: true, fontFace: FONT_JP, color: C.WHITE,
    align: "left", valign: "middle",
  });
  s.addText("AI / VLM 活用 ご提案", {
    x: 0.60, y: 3.55, w: 12.00, h: 0.85,
    fontSize: 38, bold: true, fontFace: FONT_JP, color: C.WHITE,
    align: "left", valign: "middle",
  });

  // 左下：Ver / 日付
  s.addText("Ver 0.1   2026 年 5 月   ─   議論用たたき台", {
    x: 0.60, y: 6.85, w: 8.00, h: 0.40,
    fontSize: 14, fontFace: FONT_JP, color: C.WHITE,
    valign: "middle",
  });

  // 右下：白ロゴ
  s.addImage({
    path: "assets/logo_white.png",
    x: 11.30, y: 6.85, w: 1.50, h: 0.40,
  });
}

// ════════════════════════════════════════════════════════════════════════
// 章扉（任意）：表紙と同じテクスチャ背景＋白文字＋白ロゴ。独自背景・装飾は禁止。
// ════════════════════════════════════════════════════════════════════════
function buildDivider(num, title) {
  const s = pres.addSlide({ masterName: "MASTER_COVER" });
  s.addText(num, {
    x: 0.90, y: 2.55, w: 3.0, h: 1.0,
    fontSize: 54, bold: true, fontFace: FONT_EN, color: C.WHITE, valign: "middle",
  });
  s.addText(title, {
    x: 0.90, y: 3.55, w: 11.0, h: 0.9,
    fontSize: 28, bold: true, fontFace: FONT_JP, color: C.WHITE, valign: "middle",
  });
  s.addImage({ path: "assets/logo_white.png", x: 11.30, y: 6.85, w: 1.50, h: 0.406 });
}

// ════════════════════════════════════════════════════════════════════════
// アジェンダ（任意）：NAVY 系のみ。MAGENTA は使わない。
// ════════════════════════════════════════════════════════════════════════
function buildAgenda(currentNum) {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  addSlideTitle(s, "本日のアジェンダ");
  addSubMessage(s, "本提案は以下の流れでご説明いたします。");

  const items = [
    { num: "1", title: "背景と過去の検討", body: "ご相談内容と過去の検討経緯" },
    { num: "2", title: "本提案の方向性", body: "アプローチと活用技術の説明" },
    { num: "3", title: "ご提案（3 案）", body: "各案の内容・入出力・効果" },
    { num: "4", title: "概算金額・進め方", body: "金額感と次のステップ" },
  ];
  const rowH = 1.00, startY = 2.20;
  items.forEach((it, i) => {
    const y = startY + i * (rowH + 0.15);
    const isCur = it.num === String(currentNum);
    s.addShape("rect", { x: 0.533, y, w: 12.264, h: rowH,
      fill: { color: isCur ? C.NAVY_LIGHT : C.WHITE },
      line: { color: isCur ? C.NAVY : C.GRAY_LINE, width: isCur ? 1.2 : 0.7 } });
    // 番号バッジ：rect+text を重ねず、text に fill 直接指定
    s.addText(it.num, { x: 0.533, y, w: 1.10, h: rowH,
      fontSize: 30, bold: true, fontFace: FONT_EN, color: C.WHITE,
      fill: { color: C.NAVY }, line: { type: "none" }, align: "center", valign: "middle" });
    s.addText(it.title, { x: 1.90, y: y + 0.14, w: 10.6, h: 0.45,
      fontSize: 17, bold: true, fontFace: FONT_JP, color: C.NAVY, valign: "middle" });
    s.addText(it.body, { x: 1.90, y: y + 0.58, w: 10.6, h: 0.40,
      fontSize: 12, fontFace: FONT_JP, color: C.GRAY_MID, valign: "middle" });
  });
}

// ════════════════════════════════════════════════════════════════════════
// Slide 2：背景・課題の理解
// ════════════════════════════════════════════════════════════════════════
function buildContext() {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  addSlideTitle(s, "1.  背景と過去の検討");
  addSubMessage(s, "ご相談内容と、以前検討された異常検知アプローチの限界を整理します。");

  // 上：業務フロー（横一列）
  s.addText("修理業務のフロー（概略）", {
    x: 0.533, y: 2.066, w: 12.264, h: 0.4,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.NAVY,
  });

  const flow = ["受領", "状態確認", "見積", "修理", "検査", "クリーニング", "返送"];
  const stepW = 1.573;
  const stepGap = 0.133;
  const totalW = stepW * flow.length + stepGap * (flow.length - 1);
  const startX = 0.533 + (12.264 - totalW) / 2;
  flow.forEach((step, i) => {
    const x = startX + i * (stepW + stepGap);
    s.addShape("roundRect", {
      x, y: 2.599, w: stepW, h: 0.56,
      fill: { color: C.NAVY_LIGHT }, line: { color: C.NAVY, width: 0.5 },
      rectRadius: 0.05,
    });
    s.addText(step, {
      x, y: 2.599, w: stepW, h: 0.56,
      fontSize: 14, fontFace: FONT_JP, color: C.NAVY, bold: true,
      align: "center", valign: "middle",
    });
    // 矢印（最後以外）
    if (i < flow.length - 1) {
      s.addText("▶", {
        x: x + stepW, y: 2.599, w: stepGap, h: 0.56,
        fontSize: 13, fontFace: FONT_JP, color: C.NAVY,
        align: "center", valign: "middle",
      });
    }
  });

  // 下：過去の検討と限界（全幅）
  s.addText("過去に検討された異常検知アプローチと、実用化が困難だった理由", {
    x: 0.533, y: 3.532, w: 12.264, h: 0.4,
    fontSize: 15, bold: true, fontFace: FONT_JP, color: C.NAVY,
  });

  const issues = [
    {
      title: "検討された手法",
      subtitle: "画像差分ベースの異常検知",
      body: "修理前後の画像を同じ角度で撮影し、ピクセル単位の差分や特徴量で異常箇所を抽出するアプローチが検討された。",
    },
    {
      title: "限界 ①",
      subtitle: "元からの状態と区別困難",
      body: "受領した PC は既に擦り傷や使用感があることが多く、画像比較では「もともとの状態」 と「新たな異常」 を機械的に区別できない。",
    },
    {
      title: "限界 ②",
      subtitle: "クリーニングで状態変化",
      body: "修理後のクリーニングで元の傷や汚れが消えるため、修理前後の単純比較が成立しない。「差分=異常」 の前提が崩れる。",
    },
    {
      title: "結論",
      subtitle: "従来手法では実用化困難",
      body: "上記の理由から、過去にこのアプローチを検討した企業も実用化は困難と結論した。本提案では VLM で再アプローチする。",
    },
  ];
  const issueY = 4.066;
  const issueW = (12.264 - 0.4) / 4;
  issues.forEach((it, i) => {
    const x = 0.533 + i * (issueW + 0.1);
    const isConclusion = i === 3;
    // カード本体
    s.addShape("rect", {
      x, y: issueY, w: issueW, h: 2.866,
      fill: { color: C.WHITE },
      line: { color: isConclusion ? C.NAVY : C.GRAY_LINE, width: isConclusion ? 1.5 : 0.7 },
    });
    // ヘッダー帯
    s.addShape("rect", {
      x, y: issueY, w: issueW, h: 0.85,
      fill: { color: isConclusion ? C.NAVY : C.MAGENTA_LIGHT },
      line: { color: isConclusion ? C.NAVY : C.MAGENTA_LIGHT, width: 0 },
    });
    // タイトル
    s.addText(it.title, {
      x: x + 0.2, y: issueY + 0.10, w: issueW - 0.4, h: 0.32,
      fontSize: 14, bold: true, fontFace: FONT_JP,
      color: isConclusion ? C.WHITE : C.MAGENTA,
      valign: "middle",
    });
    // サブタイトル
    s.addText(it.subtitle, {
      x: x + 0.2, y: issueY + 0.42, w: issueW - 0.4, h: 0.40,
      fontSize: 14, bold: true, fontFace: FONT_JP,
      color: isConclusion ? C.WHITE : C.NAVY,
      valign: "middle",
    });
    // 本文
    s.addText(it.body, {
      x: x + 0.2, y: issueY + 0.95, w: issueW - 0.4, h: 1.80,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "top",
    });
  });

  addFooter(s);
}

// ════════════════════════════════════════════════════════════════════════
// Slide 3：本提案の方向性
// ════════════════════════════════════════════════════════════════════════
function buildDirection() {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  addSlideTitle(s, "2.  本提案の方向性 ─ VLM で何が変わるか");
  addSubMessage(s, "過去の検討は「画像差分」アプローチでした。VLM（Vision Language Model）を使うと別の可能性が開けます。");

  // 上：VLM とは（定義 + 3 特徴）
  s.addShape("rect", {
    x: 0.533, y: 1.95, w: 12.264, h: 1.55,
    fill: { color: C.NAVY_LIGHT }, line: { color: C.NAVY, width: 0.5 },
  });
  s.addText("VLM（Vision Language Model）とは", {
    x: 0.866, y: 2.05, w: 11.597, h: 0.40,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
  s.addText("画像を「見て」、自然言語で記述・比較・推論する AI モデル", {
    x: 0.866, y: 2.45, w: 11.597, h: 0.40,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.TEXT_DARK,
    valign: "middle",
  });
  // 3 特徴（横並び）
  const features = [
    { title: "言語化", body: "「右側面に擦り傷あり」 のように画像の内容を自然言語で記述" },
    { title: "文脈理解", body: "「元からの傷」 と「新たな異常」 を文脈から区別" },
    { title: "推論", body: "単純な画像差分では困難な判別が可能になる場合がある" },
  ];
  const fW = (12.264 - 0.40) / 3;
  features.forEach((f, i) => {
    const fx = 0.533 + i * (fW + 0.10);
    s.addText([
      { text: "● " + f.title + "  ", options: { bold: true, color: C.NAVY } },
      { text: f.body, options: { color: C.TEXT_DARK } },
    ], {
      x: fx + 0.20, y: 2.95, w: fW - 0.30, h: 0.50,
      fontSize: 13, fontFace: FONT_JP,
      valign: "top",
    });
  });

  // 下：従来 vs VLM の対比
  const colW = 5.932;
  // 従来
  s.addShape("rect", {
    x: 0.533, y: 3.70, w: colW, h: 3.10,
    fill: { color: C.WHITE }, line: { color: C.GRAY_LINE, width: 0.7 },
  });
  addSectionHeader(s, 0.533, 3.70, colW, "従来：画像差分ベース", C.GRAY_MID);
  s.addText("画像をピクセル単位の特徴量に変換し、修理前後を数値比較する", {
    x: 0.866, y: 4.30, w: colW - 0.533, h: 0.50,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.TEXT_DARK,
  });
  const oldIssues = [
    "元からの傷と新規発生の傷を区別できない",
    "クリーニング後の状態変化に追従できない",
    "「修理対象部分の改善」 を意味的に理解できない",
  ];
  oldIssues.forEach((t, i) => {
    s.addText("✕  " + t, {
      x: 0.866, y: 5.00 + i * 0.50, w: colW - 0.533, h: 0.45,
      fontSize: 13, fontFace: FONT_JP, color: C.RED,
    });
  });

  // VLM
  s.addShape("rect", {
    x: 6.865, y: 3.70, w: colW, h: 3.10,
    fill: { color: C.WHITE }, line: { color: C.MAGENTA, width: 1.2 },
  });
  addSectionHeader(s, 6.865, 3.70, colW, "本提案：VLM ベース", C.MAGENTA);
  s.addText("画像を自然言語で記述・比較し、文脈を踏まえて状態を解釈する", {
    x: 7.132, y: 4.30, w: colW - 0.533, h: 0.50,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.TEXT_DARK,
  });
  const vlmAdvs = [
    "傷の種類・位置・程度を言語で記録できる",
    "修理対象部分の意味的な変化を捉えられる",
    "完全自動化ではなく担当の方の判断を支援",
  ];
  vlmAdvs.forEach((t, i) => {
    s.addText("◯  " + t, {
      x: 7.132, y: 5.00 + i * 0.50, w: colW - 0.533, h: 0.45,
      fontSize: 13, fontFace: FONT_JP, color: C.NAVY,
    });
  });

  addFooter(s);
}

// ════════════════════════════════════════════════════════════════════════
// 提案カード共通レイアウト
// ════════════════════════════════════════════════════════════════════════
function buildProposalSlide(s, num, label, title, content) {
  addSlideTitle(s, `3.${num}  提案${num} ─ ${label}`);
  addSubMessage(s, title);

  // 上段：内容（リード文 + 3 ポイント、構造化）
  const cY = 1.95;
  const cH = 1.40;
  s.addShape("rect", {
    x: 0.533, y: cY, w: 12.264, h: cH,
    fill: { color: C.NAVY_LIGHT }, line: { color: C.NAVY, width: 0.5 },
  });
  // ラベル
  s.addText("内容", {
    x: 0.866, y: cY + 0.10, w: 1.333, h: 0.32,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
  // リード文
  s.addText(content.lead, {
    x: 0.866, y: cY + 0.40, w: 11.597, h: 0.40,
    fontSize: 16, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
  // ポイント（横並び 3 個）
  const pW = (12.264 - 0.30) / 3;
  content.points.forEach((p, i) => {
    const px = 0.533 + i * (pW + 0.05);
    s.addText("● " + p, {
      x: px + 0.20, y: cY + 0.85, w: pW - 0.30, h: 0.50,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "top",
    });
  });

  // 中段：入力 / 出力（2 列）
  const ioY = 3.50;
  const ioH = 1.45;
  // 入力
  s.addShape("rect", {
    x: 0.533, y: ioY, w: 5.932, h: ioH,
    fill: { color: C.WHITE }, line: { color: C.GRAY_LINE, width: 0.7 },
  });
  addSectionHeader(s, 0.533, ioY, 5.932, "入力", C.NAVY);
  content.inputs.forEach((it, i) => {
    s.addText("・" + it, {
      x: 0.866, y: ioY + 0.55 + i * 0.27, w: 5.465, h: 0.32,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
    });
  });

  // 出力
  s.addShape("rect", {
    x: 6.798, y: ioY, w: 5.932, h: ioH,
    fill: { color: C.WHITE }, line: { color: C.GRAY_LINE, width: 0.7 },
  });
  addSectionHeader(s, 6.798, ioY, 5.932, "出力", C.MAGENTA);
  content.outputs.forEach((it, i) => {
    s.addText("・" + it, {
      x: 7.065, y: ioY + 0.55 + i * 0.27, w: 5.465, h: 0.32,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
    });
  });

  // 下段：期待される効果（3 カード）
  const eY = 5.10;
  s.addText("期待される効果", {
    x: 0.533, y: eY, w: 12.264, h: 0.40,
    fontSize: 16, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
  const eCardW = 3.999;
  const eCardGap = 0.10;
  content.effects.forEach((eff, i) => {
    const ex = 0.533 + i * (eCardW + eCardGap);
    const ey = eY + 0.50;
    const eCardH = 1.30;
    // カード
    s.addShape("rect", {
      x: ex, y: ey, w: eCardW, h: eCardH,
      fill: { color: C.WHITE }, line: { color: C.MAGENTA, width: 1.0 },
    });
    // 左の MAGENTA 縦線
    s.addShape("rect", {
      x: ex, y: ey, w: 0.10, h: eCardH,
      fill: { color: C.MAGENTA }, line: { color: C.MAGENTA, width: 0 },
    });
    // タイトル
    s.addText(eff.title, {
      x: ex + 0.25, y: ey + 0.10, w: eCardW - 0.35, h: 0.40,
      fontSize: 15, bold: true, fontFace: FONT_JP, color: C.NAVY,
      valign: "middle",
    });
    // 本文
    s.addText(eff.body, {
      x: ex + 0.25, y: ey + 0.50, w: eCardW - 0.35, h: 0.75,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "top",
    });
  });

  addFooter(s);
}

// ════════════════════════════════════════════════════════════════════════
// Slide 4：提案 A
// ════════════════════════════════════════════════════════════════════════
function buildProposalA() {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  buildProposalSlide(s, "1", "受領時の状態記録自動化", "受領時の画像から、PC の状態を VLM が自然言語で自動記述します。", {
    lead: "受付時に PC を撮影すると、VLM が状態を自動的に言語化します。",
    points: [
      "受付担当の方の手入力作業を削減し、確認・修正のみで完了",
      "外装・液晶・キーボード・ポート等を部位ごとに自然言語で記述",
      "状態記録は後工程（見積・検査）でも参照可能な形で蓄積",
    ],
    inputs: [
      "受領時の PC 画像（複数アングル）",
      "顧客の申告内容（依頼書テキスト）",
    ],
    outputs: [
      "状態記録テキスト（部位ごとに記述）",
      "顧客向け受領通知の下書き",
      "後工程（見積・検査）への参照データ",
    ],
    effects: [
      { title: "受付業務の工数削減", body: "VLM が状態を自然言語で自動記述し、担当の方は確認・修正のみ。手入力作業を大幅に削減します。" },
      { title: "顧客トラブルの防止", body: "受領時の状態を画像とテキストで自動的に証跡化。後の認識齟齬を未然に回避します。" },
      { title: "VLM 活用の基盤", body: "提案 B・C への展開の足がかりとなる導入しやすい案。最短期間で効果を実感できます。" },
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════
// Slide 5：提案 B
// ════════════════════════════════════════════════════════════════════════
function buildProposalB() {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  buildProposalSlide(s, "2", "修理前後の VLM 比較", "修理前後の画像を VLM が文脈理解で比較し、修理対象の改善を確認します。", {
    lead: "修理前後の画像と修理内容を VLM に与えると、改善状況を自然言語で判定します。",
    points: [
      "「修理対象部分が改善されているか」 を文脈で判断",
      "「無関係な箇所の状態が維持されているか」 もあわせて確認",
      "完全自動化ではなく、担当の方の最終確認を支援するツールとして活用",
    ],
    inputs: [
      "修理前画像（受領時）",
      "修理後画像(クリーニング後)",
      "修理内容のテキスト記録",
    ],
    outputs: [
      "比較レポート(自然言語)",
      "判定結果(修理対象 OK / 周辺維持 OK 等)",
      "顧客への説明資料の下書き",
    ],
    effects: [
      { title: "過去課題への新アプローチ", body: "画像差分でなく VLM の意味理解で判別。完全自動ではなく担当の方の最終確認を支援するツールとして実用化を目指します。" },
      { title: "品質保証の標準化", body: "担当者ごとの判断のばらつきを抑え、一定の基準で修理品質を確認。クリーニング後の状態でも判定可能です。" },
      { title: "顧客への説明根拠", body: "「ここを直しました」 という説明を、VLM の自然言語記述により根拠あるものにできます。" },
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════
// Slide 6：提案 C
// ════════════════════════════════════════════════════════════════════════
function buildProposalC() {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  buildProposalSlide(s, "3", "修理内容の自動分類・見積補助", "依頼内容と画像から修理内容を分類し、過去事例から見積参考値を提示します。", {
    lead: "顧客の問い合わせ文と受領画像から、修理内容と見積参考値を自動で提示します。",
    points: [
      "「液晶交換」「キーボード交換」「基板修理」 等に VLM が自動分類",
      "過去の修理履歴から類似事例の見積参考値・必要工数を抽出",
      "見積担当の方は判断に集中、最終的な見積は担当の方が確定",
    ],
    inputs: [
      "顧客の問い合わせ文・依頼書",
      "受領時の PC 画像",
      "過去の修理履歴・見積データ",
    ],
    outputs: [
      "修理内容の分類結果",
      "見積参考値（過去事例ベース）",
      "必要工数の推定",
    ],
    effects: [
      { title: "見積工数の大幅削減", body: "過去事例の検索・参照を VLM が代行。見積担当の方は判断に集中でき、若手の戦力化にも貢献。" },
      { title: "見積の標準化", body: "担当者ごとのばらつきを抑え、過去事例ベースの一定基準で見積提示。属人化を解消します。" },
      { title: "顧客対応の迅速化", body: "見積回答までの時間が短縮され、受注機会の拡大と顧客満足度の向上につながります。" },
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════
// Slide 7：概算金額感
// ════════════════════════════════════════════════════════════════════════
function buildEstimate() {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  addSlideTitle(s, "4.  概算金額感");
  addSubMessage(s, "本資料の金額はざっくりの規模感です。関心の高い案について、ヒアリング後に具体的な見積をご提示します。");

  // テーブル
  const cols = ["案", "PoC（概念実証）", "本開発", "年間運用保守"];
  const cxs  = [0.533, 4.399, 7.065, 10.064];
  const cws  = [3.799, 2.599, 2.933, 2.733];

  const tableStartY = 1.866;
  const headerH = 0.48;

  // ヘッダー
  cols.forEach((c, i) => {
    s.addShape("rect", {
      x: cxs[i], y: tableStartY, w: cws[i], h: headerH,
      fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
    });
    s.addText(c, {
      x: cxs[i], y: tableStartY, w: cws[i], h: headerH,
      fontSize: 14, bold: true, fontFace: FONT_JP, color: C.WHITE,
      align: "center", valign: "middle",
    });
  });

  const rows = [
    {
      name: "A. 受領時の状態記録自動化",
      desc: "VLM の代表的活用、基盤的位置づけ",
      poc:  "300〜500 万円",
      dev:  "1,500〜2,500 万円",
      run:  "300〜500 万円 / 年",
    },
    {
      name: "B. 修理前後の VLM 比較",
      desc: "過去課題への新アプローチ",
      poc:  "500〜800 万円",
      dev:  "2,000〜3,000 万円",
      run:  "400〜600 万円 / 年",
    },
    {
      name: "C. 修理内容の自動分類・見積補助",
      desc: "業務効率化の即効性",
      poc:  "300〜500 万円",
      dev:  "1,500〜2,500 万円",
      run:  "300〜500 万円 / 年",
    },
  ];

  const rowH = 1.066;
  rows.forEach((r, i) => {
    const y = tableStartY + headerH + i * rowH;
    cxs.forEach((x, ci) => {
      s.addShape("rect", {
        x, y, w: cws[ci], h: rowH,
        fill: { color: C.WHITE }, line: { color: C.GRAY_LINE, width: 0.5 },
      });
    });
    // 案名
    s.addText(r.name, {
      x: cxs[0] + 0.10, y: y + 0.133, w: cws[0] - 0.20, h: 0.613,
      fontSize: 14, bold: true, fontFace: FONT_JP, color: C.NAVY,
      align: "left", valign: "top",
    });
    s.addText(r.desc, {
      x: cxs[0] + 0.10, y: y + 0.773, w: cws[0] - 0.20, h: 0.427,
      fontSize: 13, fontFace: FONT_JP, color: C.GRAY_MID,
      align: "left", valign: "top",
    });
    // 金額（中央揃え）
    s.addText(r.poc, {
      x: cxs[1], y, w: cws[1], h: rowH,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
      align: "center", valign: "middle",
    });
    s.addText(r.dev, {
      x: cxs[2], y, w: cws[2], h: rowH,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
      align: "center", valign: "middle",
    });
    s.addText(r.run, {
      x: cxs[3], y, w: cws[3], h: rowH,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
      align: "center", valign: "middle",
    });
  });

  // 注記（テーブル直下）
  const noteY = tableStartY + headerH + 3 * rowH + 0.267;
  s.addText([
    "※ 本資料の金額は仮置きの概算です。詳細はヒアリング後に正式見積をご提示します。",
    "※ PoC は概念実証で技術的実現性を確認するフェーズ、本開発は要件定義 + 開発を含みます。",
  ].join("\n"), {
    x: 0.533, y: noteY, w: 12.264, h: 0.733,
    fontSize: 13, fontFace: FONT_JP, color: C.GRAY_MID,
    valign: "top",
  });

  addFooter(s);
}

// ════════════════════════════════════════════════════════════════════════
// Slide 8：Appendix - 今後の展開候補
// ════════════════════════════════════════════════════════════════════════
function buildAppendix() {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  addSlideTitle(s, "Appendix  今後の展開候補");
  addSubMessage(s, "本提案の 3 案を進めた後、または並行して検討可能な案です。今回は概要のみ。");

  const candidates = [
    {
      label: "D",
      title: "返送前 最終検査の自動化",
      body: "提案 B（修理前後比較）を応用し、クリーニング・修理完了後の状態を VLM が検査。出荷前に修理対象が直っているか、クリーニング状態が良好かを確認します。検査工数の削減と品質ばらつきの低減に貢献。",
    },
    {
      label: "E",
      title: "顧客向けレポート自動生成",
      body: "提案 A・B の出力を活用し、修理前後の画像と修理内容から顧客への報告書を VLM が自動生成。「お預かり時の状態」「修理した箇所」「現在の状態」 をビジュアルで説明し、顧客満足度の向上につなげます。",
    },
    {
      label: "F",
      title: "作業記録支援",
      body: "技術者の作業中画像・動画を VLM が解析し、作業内容を自動記録。若手育成のナレッジ DB として蓄積します。動画解析は技術ハードルがやや高く、PoC で慎重な実現性検証が必要です。",
    },
    {
      label: "G",
      title: "類似事例検索",
      body: "提案 C（見積補助）を発展させ、症状や画像から過去の類似修理事例を検索。技術者の判断を支援し、若手の早期戦力化と修理品質の標準化に貢献します。",
    },
  ];

  const cardW = 5.998, cardH = 2.199;
  candidates.forEach((c, i) => {
    const x = 0.533 + (i % 2) * 6.265;
    const y = 2.066 + Math.floor(i / 2) * 2.466;

    // カード
    s.addShape("rect", {
      x, y, w: cardW, h: cardH,
      fill: { color: C.WHITE }, line: { color: C.GRAY_LINE, width: 0.7 },
    });
    // ラベル（左の色帯：NAVY）
    s.addShape("rect", {
      x, y, w: 0.666, h: cardH,
      fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
    });
    s.addText(c.label, {
      x, y, w: 0.666, h: cardH,
      fontSize: 28, bold: true, fontFace: FONT_EN, color: C.WHITE,
      align: "center", valign: "middle",
    });
    // タイトル
    s.addText(c.title, {
      x: x + 0.866, y: y + 0.20, w: cardW - 1.066, h: 0.45,
      fontSize: 15, bold: true, fontFace: FONT_JP, color: C.NAVY,
      valign: "middle",
    });
    // 本文（関連性も含めて自然に説明）
    s.addText(c.body, {
      x: x + 0.866, y: y + 0.75, w: cardW - 1.066, h: 1.30,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "top",
    });
  });

  addFooter(s);
}

// ════════════════════════════════════════════════════════════════════════
// Slide 9：進め方・次のステップ
// ════════════════════════════════════════════════════════════════════════
function buildNextSteps() {
  const s = pres.addSlide({ masterName: "MASTER_LIGHT" });
  addSlideTitle(s, "5.  進め方・次のステップ");
  addSubMessage(s, "本日のディスカッション後、関心の高い案について具体的な検討を進めます。");

  const steps = [
    {
      num: "STEP 1",
      title: "本日のディスカッション",
      body: "3 案の中で関心の高いものを絞り込み。過去の検討内容や現状の運用課題を共有いただく。",
      now: true,
    },
    {
      num: "STEP 2",
      title: "ヒアリング・データ確認",
      body: "選定された案について、現状業務の詳細・データの保管状況・既存システム連携範囲を確認。",
      now: false,
    },
    {
      num: "STEP 3",
      title: "PoC 提案・正式見積",
      body: "ヒアリング結果を踏まえた PoC 提案と、具体的な金額・期間・体制をご提示。",
      now: false,
    },
    {
      num: "STEP 4",
      title: "PoC → 本開発の判断",
      body: "PoC で技術的実現性と効果を確認のうえ、本開発に進むか案ごとにご判断。",
      now: false,
    },
  ];

  steps.forEach((step, i) => {
    const x = 0.533 + i * 3.199;
    const w = 2.866;

    // ステップカード
    s.addShape("rect", {
      x, y: 2.466, w, h: 3.333,
      fill: { color: step.now ? C.NAVY : C.WHITE },
      line: { color: C.NAVY, width: step.now ? 0 : 0.7 },
    });
    s.addText(step.num, {
      x, y: 2.599, w, h: 0.4,
      fontSize: 14, bold: true, fontFace: FONT_EN,
      color: step.now ? C.WHITE : C.NAVY,
      align: "center", valign: "middle",
    });
    s.addText(step.title, {
      x: x + 0.133, y: 3.066, w: w - 0.267, h: 0.666,
      fontSize: 14, bold: true, fontFace: FONT_JP,
      color: step.now ? C.WHITE : C.NAVY,
      align: "center", valign: "middle",
    });
    s.addText(step.body, {
      x: x + 0.2, y: 3.799, w: w - 0.4, h: 1.866,
      fontSize: 13, fontFace: FONT_JP,
      color: step.now ? C.WHITE : C.TEXT_DARK,
      valign: "top",
    });

    // 矢印（最後以外）
    if (i < steps.length - 1) {
      s.addShape("rightTriangle", {
        x: x + w + 0.045, y: 3.932, w: 0.187, h: 0.4,
        fill: { color: C.MAGENTA }, line: { color: C.MAGENTA, width: 0 },
        rotate: 90,
      });
    }
  });

  // 下：注記
  s.addText("※ 本資料は議論用のたたき台です。各案ごとに独立して進めることができます。本日関心の高い案について、Step 2 以降を進めさせてください。", {
    x: 0.533, y: 6.198, w: 12.264, h: 0.666,
    fontSize: 14, fontFace: FONT_JP, color: C.GRAY_MID,
    valign: "top",
  });

  addFooter(s);
}

// ════════════════════════════════════════════════════════════════════════
// 実行
// ════════════════════════════════════════════════════════════════════════
buildCover();
buildAgenda(1);
buildContext();
buildDirection();
buildProposalA();
buildProposalB();
buildProposalC();
buildEstimate();
buildAppendix();
buildNextSteps();

pres.writeFile({ fileName: "/home/claude/work/テクノリペア_AI活用提案_v0.1.pptx" }).then(() => {
  console.log("Build complete: 10 slides");
});

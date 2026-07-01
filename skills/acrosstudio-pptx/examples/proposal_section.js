// 提案セクション単体のサンプル
// 「3.1 提案 N ─ XXX」 のような 1 枚スライドを生成
//
// 構成：
//   - 章番号付きタイトル
//   - リード文（黒字、太字）
//   - 内容セクション（リード + 3 ポイント）
//   - 入力 / 出力（2 カラム）
//   - 期待される効果（3 カード）
//
// ビルド：
//   cd /home/claude/work
//   export NODE_PATH=/home/claude/.npm-global/lib/node_modules
//   node proposal_section.js

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";

// ─── カラー ───
const C = {
  NAVY:         "073763",
  NAVY_LIGHT:   "DCE6F0",
  CLIENT:       "2C7DA6",
  MAGENTA:      "A22B94",
  GRAY_BG:      "F5F5F5",
  GRAY_LINE:    "BFBFBF",
  GRAY_MID:     "595959",
  TEXT_DARK:    "262626",
  WHITE:        "FFFFFF",
};
const FONT_JP = "BIZ UDPGothic";
const FONT_EN = "Arial";

// ─── マスター ───
pres.defineSlideMaster({
  title: "MASTER",
  background: { color: C.WHITE },
  objects: [
    { image: { path: "assets/logo_black.png", x: 11.464, y: 0.333, w: 1.466, h: 0.4 } },
    { text: {
        text: "Copyright 2026. Acrosstudio, Inc. <Confidential>",
        options: {
          x: 7.332, y: 7.092, w: 5.599, h: 0.293,
          fontSize: 8, fontFace: FONT_EN, color: C.GRAY_MID,
          align: "right", valign: "middle",
        }
      }
    },
  ],
});

// ─── 章番号付きタイトル ───
function addChapterTitle(s, num, title, sub) {
  s.addShape("rect", {
    x: 0.267, y: 0.40, w: 0.08, h: 0.666,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
  });
  const titleText = sub ? `${num}  ${title} ─ ${sub}` : `${num}  ${title}`;
  s.addText(titleText, {
    x: 0.533, y: 0.333, w: 10.50, h: 0.80,
    fontSize: 22, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
}

// ─── 提案セクションのスライド ───
function buildProposalSection(data) {
  const s = pres.addSlide({ masterName: "MASTER" });

  // ① 章番号付きタイトル
  addChapterTitle(s, data.chapterNum, data.title, data.subtitle);

  // ② リード文（黒字、太字、14pt）
  s.addText(data.lead, {
    x: 0.533, y: 1.226, w: 12.264, h: 0.55,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.TEXT_DARK,
    valign: "middle",
  });

  // ③ 内容セクション（NAVY_LIGHT 帯、リード + 3 ポイント）
  const contentY = 1.95;
  const contentH = 1.40;
  s.addShape("rect", {
    x: 0.533, y: contentY, w: 12.264, h: contentH,
    fill: { color: C.NAVY_LIGHT }, line: { color: C.NAVY, width: 0.5 },
  });
  s.addText("内容", {
    x: 0.733, y: contentY + 0.10, w: 1.333, h: 0.32,
    fontSize: 11, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
  s.addText(data.content.lead, {
    x: 0.733, y: contentY + 0.40, w: 11.864, h: 0.40,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
  // 3 ポイント横並び
  const pW = (12.264 - 0.40) / 3;
  data.content.points.forEach((p, i) => {
    const px = 0.733 + i * (pW + 0.05);
    s.addText("● " + p, {
      x: px, y: contentY + 0.85, w: pW - 0.05, h: 0.50,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
    });
  });

  // ④ 入力・出力（2 カラム）
  const ioY = 3.55;
  const ioHeaderH = 0.40;
  const ioCardH = 2.05;
  const ioColW = 6.0;
  const ioGap = 0.30;
  const inX = 0.533;
  const outX = inX + ioColW + ioGap;

  // 入力ヘッダー
  s.addShape("rect", {
    x: inX, y: ioY, w: ioColW, h: ioHeaderH,
    fill: { color: C.CLIENT }, line: { color: C.CLIENT, width: 0 },
  });
  s.addText("入力", {
    x: inX, y: ioY, w: ioColW, h: ioHeaderH,
    fontSize: 13, bold: true, fontFace: FONT_JP, color: C.WHITE,
    align: "center", valign: "middle",
  });
  // 入力カード本体
  s.addShape("rect", {
    x: inX, y: ioY + ioHeaderH, w: ioColW, h: ioCardH,
    fill: { color: C.WHITE }, line: { color: C.CLIENT, width: 1.0 },
  });
  data.inputs.forEach((item, i) => {
    s.addText("● " + item, {
      x: inX + 0.20, y: ioY + ioHeaderH + 0.15 + i * 0.40, w: ioColW - 0.40, h: 0.40,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
    });
  });

  // 出力ヘッダー
  s.addShape("rect", {
    x: outX, y: ioY, w: ioColW, h: ioHeaderH,
    fill: { color: C.MAGENTA }, line: { color: C.MAGENTA, width: 0 },
  });
  s.addText("出力", {
    x: outX, y: ioY, w: ioColW, h: ioHeaderH,
    fontSize: 13, bold: true, fontFace: FONT_JP, color: C.WHITE,
    align: "center", valign: "middle",
  });
  // 出力カード本体
  s.addShape("rect", {
    x: outX, y: ioY + ioHeaderH, w: ioColW, h: ioCardH,
    fill: { color: C.WHITE }, line: { color: C.MAGENTA, width: 1.0 },
  });
  data.outputs.forEach((item, i) => {
    s.addText("● " + item, {
      x: outX + 0.20, y: ioY + ioHeaderH + 0.15 + i * 0.40, w: ioColW - 0.40, h: 0.40,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
    });
  });

  // ⑤ 期待される効果（3 カード横並び）
  const effY = 6.05;
  const effH = 1.00;
  const effCardW = (12.264 - 0.20) / 3;
  data.effects.forEach((eff, i) => {
    const ex = 0.533 + i * (effCardW + 0.10);
    // カード本体
    s.addShape("rect", {
      x: ex, y: effY, w: effCardW, h: effH,
      fill: { color: C.WHITE }, line: { color: C.MAGENTA, width: 1.0 },
    });
    // 左の MAGENTA 縦線
    s.addShape("rect", {
      x: ex, y: effY, w: 0.10, h: effH,
      fill: { color: C.MAGENTA }, line: { color: C.MAGENTA, width: 0 },
    });
    // タイトル
    s.addText(eff.title, {
      x: ex + 0.25, y: effY + 0.05, w: effCardW - 0.35, h: 0.32,
      fontSize: 12, bold: true, fontFace: FONT_JP, color: C.NAVY,
      valign: "middle",
    });
    // 本文
    s.addText(eff.body, {
      x: ex + 0.25, y: effY + 0.37, w: effCardW - 0.35, h: 0.60,
      fontSize: 10, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
    });
  });
}

// ─── サンプルデータ ───
const sectionData = {
  chapterNum: "3.1",
  title: "提案 1",
  subtitle: "受領時の状態記録自動化",
  lead: "VLM がパーティクル画像から状態を自然言語で記述し、受付業務を効率化します。",
  content: {
    lead: "VLM で「画像 → 言語化 → 構造化記録」 までを自動化、担当の方は確認・修正のみ",
    points: [
      "画像から状態を自然言語で記述",
      "あらかじめ定義した観点で構造化",
      "担当の方は確認・修正のみで完了",
    ],
  },
  inputs: [
    "受領時のパーティクル画像",
    "観点定義（チェックリスト）",
    "過去の記録事例",
    "ロット情報",
  ],
  outputs: [
    "状態記述（自然言語）",
    "構造化記録（チェック項目）",
    "確認用ダッシュボード",
  ],
  effects: [
    {
      title: "受付業務の工数削減",
      body: "手入力作業が大幅に減り、担当の方は判断業務に集中できます。",
    },
    {
      title: "顧客トラブルの防止",
      body: "受領時の状態を画像とテキストで証跡化、後の認識齟齬を回避します。",
    },
    {
      title: "VLM 活用の基盤",
      body: "後続の提案へ展開する足がかり。最短で効果を実感できる導入しやすい案です。",
    },
  ],
};

buildProposalSection(sectionData);

const outPath = "/home/claude/work/sample_proposal_section.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`Build complete: ${outPath}`);
});

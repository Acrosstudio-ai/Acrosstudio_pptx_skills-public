// 01〜04 各テーマの入出力整理スライド
// 架空の半導体洗浄装置メーカー向け（サンプル）
// 4 枚構成（各テーマ 1 枚）

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";  // 13.33 × 7.5 inch（PowerPoint 標準ワイドスクリーン）

// ─── カラー（既存提案書と統一）───
const C = {
  NAVY:         "073763",
  NAVY_LIGHT:   "DCE6F0",
  CLIENT:       "2C7DA6",
  CLIENT_LIGHT: "D9E5EC",
  MAGENTA:      "A22B94",
  MAGENTA_LIGHT:"F4E4F0",
  GRAY_BG:      "F5F5F5",
  GRAY_LINE:    "BFBFBF",
  GRAY_MID:     "595959",
  TEXT_DARK:    "262626",
  WHITE:        "FFFFFF",
};
const FONT_JP = "BIZ UDPGothic";
const FONT_EN = "Arial";

// ─── スライドマスター ───
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

// ─── 共通要素 ───
function addSlideTitle(s, theme, title) {
  // 縦線
  s.addShape("rect", {
    x: 0.267, y: 0.40, w: 0.08, h: 0.666,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
  });
  // テーマ番号 + タイトル
  s.addText(`${theme}  ${title}  ─ 入力と出力の整理`, {
    x: 0.533, y: 0.333, w: 10.50, h: 0.80,
    fontSize: 22, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
}

// ─── 各テーマのスライド ───
function buildSlide(data) {
  const s = pres.addSlide({ masterName: "MASTER" });
  addSlideTitle(s, data.num, data.title);

  // ユーザー表示
  s.addText([
    { text: "ユーザー： ", options: { bold: true, color: C.NAVY } },
    { text: data.user, options: { color: C.TEXT_DARK } },
  ], {
    x: 0.533, y: 1.20, w: 11.0, h: 0.35,
    fontSize: 13, fontFace: FONT_JP,
    valign: "middle",
  });

  // リード文（NAVY_LIGHT 帯）
  s.addShape("rect", {
    x: 0.533, y: 1.60, w: 12.264, h: 0.70,
    fill: { color: C.NAVY_LIGHT }, line: { color: C.NAVY, width: 0.5 },
  });
  s.addText(data.lead, {
    x: 0.733, y: 1.60, w: 11.864, h: 0.70,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });

  // 3 カラム：入力 → AI 処理 → 出力
  const colW = 4.10;
  const gap = 0.20;
  const colY = 2.55;
  const colH = 4.45;
  const headerH = 0.55;

  // ─ 入力カード ─
  const inX = 0.533;
  s.addShape("rect", { x: inX, y: colY, w: colW, h: colH,
    fill: { color: C.WHITE }, line: { color: C.NAVY, width: 1.5 } });
  s.addShape("rect", { x: inX, y: colY, w: colW, h: headerH,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 } });
  s.addText("入力", {
    x: inX, y: colY, w: colW, h: headerH,
    fontSize: 15, bold: true, fontFace: FONT_JP, color: C.WHITE,
    align: "center", valign: "middle",
  });
  data.inputs.forEach((item, i) => {
    s.addText("● " + item, {
      x: inX + 0.20, y: colY + 0.75 + i * 0.62, w: colW - 0.40, h: 0.62,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
    });
  });

  // ─ 矢印（入力 → AI）─
  s.addShape("rightTriangle", {
    x: inX + colW + 0.02, y: colY + colH / 2 - 0.10, w: 0.16, h: 0.30,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
    rotate: 90,
  });

  // ─ AI 処理カード ─
  const aiX = inX + colW + gap;
  s.addShape("rect", { x: aiX, y: colY, w: colW, h: colH,
    fill: { color: C.WHITE }, line: { color: C.NAVY, width: 1.5 } });
  s.addShape("rect", { x: aiX, y: colY, w: colW, h: headerH,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 } });
  s.addText("AI 処理（システムが行うこと）", {
    x: aiX, y: colY, w: colW, h: headerH,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.WHITE,
    align: "center", valign: "middle",
  });
  data.processing.forEach((item, i) => {
    s.addText("● " + item, {
      x: aiX + 0.20, y: colY + 0.75 + i * 0.62, w: colW - 0.40, h: 0.62,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
    });
  });

  // ─ 矢印（AI → 出力）─
  s.addShape("rightTriangle", {
    x: aiX + colW + 0.02, y: colY + colH / 2 - 0.10, w: 0.16, h: 0.30,
    fill: { color: C.MAGENTA }, line: { color: C.MAGENTA, width: 0 },
    rotate: 90,
  });

  // ─ 出力カード ─
  const outX = aiX + colW + gap;
  s.addShape("rect", { x: outX, y: colY, w: colW, h: colH,
    fill: { color: C.WHITE }, line: { color: C.MAGENTA, width: 1.5 } });
  s.addShape("rect", { x: outX, y: colY, w: colW, h: headerH,
    fill: { color: C.MAGENTA }, line: { color: C.MAGENTA, width: 0 } });
  s.addText("出力", {
    x: outX, y: colY, w: colW, h: headerH,
    fontSize: 15, bold: true, fontFace: FONT_JP, color: C.WHITE,
    align: "center", valign: "middle",
  });
  data.outputs.forEach((item, i) => {
    s.addText("● " + item, {
      x: outX + 0.20, y: colY + 0.75 + i * 0.62, w: colW - 0.40, h: 0.62,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
    });
  });
}

// ─── データ ───
const themes = [
  {
    num: "01",
    title: "故障予知保全",
    user: "保全担当の方",
    lead: "ベローズポンプの劣化予兆を検知し、計画外停止を計画化されたメンテナンスに転換します。",
    inputs: [
      "ポンプ稼働データ（圧力・吐出量）",
      "ポンプ稼働データ（トルク・電流・温度）",
      "過去の故障履歴・交換履歴",
      "装置稼働ログ（運転時間・サイクル数）",
    ],
    processing: [
      "時系列データから劣化パターンを抽出",
      "過去事例との照合で「健康度」 を継続算出",
      "閾値超過で予兆アラートを発出",
      "部品交換時期を予測",
    ],
    outputs: [
      "ヘルススコア（ポンプの健康度）",
      "予兆アラート（劣化検知の通知）",
      "推奨交換時期",
      "劣化トレンドの可視化",
    ],
  },
  {
    num: "02",
    title: "プロセス調整提案",
    user: "プロセス担当の方",
    lead: "装置の個体差・環境変動に応じて、変数の調整値を担当の方に提案します。",
    inputs: [
      "制御変数（バス温度・薬液濃度・循環流量・N2 バブリング量）",
      "環境変数（気圧・室温）",
      "過去の品質結果",
      "影響係数モデル（洗浄品質評価で構築されたもの）",
    ],
    processing: [
      "現状条件と過去事例を照合",
      "影響係数モデルで最適調整値を計算",
      "調整候補と根拠を生成",
      "各候補の影響をシミュレーション",
    ],
    outputs: [
      "調整候補（変数 + 推奨値 + 根拠）",
      "影響シミュレーション",
      "推奨理由の説明",
    ],
  },
  {
    num: "03",
    title: "洗浄品質評価・要因分析",
    user: "評価担当の方",
    lead: "洗浄結果を自動評価し、条件と結果の関係性を抽出して影響係数モデルを構築します。",
    inputs: [
      "パーティクル画像",
      "エッチング量分布データ",
      "プロセス変数",
      "ロット情報",
    ],
    processing: [
      "画像から品質指標を自動抽出",
      "条件 → 結果の関係性をモデル化",
      "影響係数モデルを構築・更新",
      "良条件のパターンを抽出",
    ],
    outputs: [
      "自動評価結果（品質スコア）",
      "影響係数モデル（プロセス調整提案で活用）",
      "要因分析レポート",
      "良条件ナレッジ",
    ],
  },
  {
    num: "04",
    title: "設計支援",
    user: "設計者の方",
    lead: "設計ミスを予知し、不具合原因や仕様変更の影響範囲を設計者に示唆します。",
    inputs: [
      "スペックシート",
      "不具合報告書",
      "外部知見（業界事例・論文）",
    ],
    processing: [
      "過去スペックの類似検索",
      "不具合パターンの抽出と原因推定",
      "仕様変更の影響範囲を予測",
    ],
    outputs: [
      "類似スペック検索結果",
      "リスク示唆（設計ミス予知）",
      "不具合原因の候補",
      "仕様変更の影響範囲",
    ],
  },
];

themes.forEach(buildSlide);

const outPath = "/home/claude/work/01-04_テーマ別_入出力整理.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`Build complete: 4 slides → ${outPath}`);
});

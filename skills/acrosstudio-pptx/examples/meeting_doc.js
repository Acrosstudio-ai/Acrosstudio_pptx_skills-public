// 打合せ資料テンプレート（議事録 + 検討資料）
// 通常の社内・客先打合せで使用する PPTX を生成
//
// 用途例：
//   - 議事録（日時、参加者、要点、決定事項、宿題）
//   - 検討資料（背景、課題、選択肢比較、推奨案、リスク）
//
// ビルド方法：
//   cd /home/claude/work
//   export NODE_PATH=/home/claude/.npm-global/lib/node_modules
//   node meeting_doc.js
//
// アセット（assets/）から logo を参照。同じディレクトリに assets/ がない場合は path 修正。

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";  // 13.33 × 7.5 inch

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

// ─── ヘルパー：スライドタイトル ───
function addSlideTitle(s, text) {
  s.addShape("rect", {
    x: 0.267, y: 0.40, w: 0.08, h: 0.666,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
  });
  s.addText(text, {
    x: 0.533, y: 0.333, w: 10.50, h: 0.80,
    fontSize: 22, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
}

// ─── 1. 表紙（議事録 / 検討資料の表紙）───
function buildCover(data) {
  const s = pres.addSlide({ masterName: "MASTER" });

  // タイトル
  s.addText(data.title, {
    x: 0.533, y: 1.50, w: 12.264, h: 1.00,
    fontSize: 32, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });

  // サブタイトル
  if (data.subtitle) {
    s.addText(data.subtitle, {
      x: 0.533, y: 2.60, w: 12.264, h: 0.50,
      fontSize: 16, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "middle",
    });
  }

  // メタ情報（日時、参加者、議題）
  const metaItems = [
    { label: "日時", value: data.date },
    { label: "場所", value: data.location || "—" },
    { label: "参加者", value: data.participants || "—" },
    { label: "目的", value: data.purpose || "—" },
  ];

  metaItems.forEach((item, i) => {
    const y = 4.00 + i * 0.55;
    s.addText(item.label, {
      x: 0.533, y, w: 2.0, h: 0.50,
      fontSize: 14, bold: true, fontFace: FONT_JP, color: C.NAVY,
      valign: "middle",
    });
    s.addText(item.value, {
      x: 2.733, y, w: 9.5, h: 0.50,
      fontSize: 14, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "middle",
    });
  });
}

// ─── 2. 議事録：要点・決定事項 ───
function buildKeyPoints(data) {
  const s = pres.addSlide({ masterName: "MASTER" });
  addSlideTitle(s, "要点・決定事項");

  // リード文
  s.addText("本日の議論で決定した内容を以下に整理します。", {
    x: 0.533, y: 1.226, w: 12.264, h: 0.50,
    fontSize: 14, bold: true, fontFace: FONT_JP, color: C.TEXT_DARK,
    valign: "middle",
  });

  // 要点リスト（NAVY_LIGHT 帯）
  data.points.forEach((p, i) => {
    const y = 2.00 + i * 0.85;
    // 番号バッジ
    s.addShape("ellipse", {
      x: 0.533, y, w: 0.50, h: 0.50,
      fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
    });
    s.addText(String(i + 1), {
      x: 0.533, y, w: 0.50, h: 0.50,
      fontSize: 16, bold: true, fontFace: FONT_EN, color: C.WHITE,
      align: "center", valign: "middle",
    });
    // 本文
    s.addText(p, {
      x: 1.20, y, w: 11.50, h: 0.65,
      fontSize: 13, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "middle",
    });
  });
}

// ─── 3. 議事録：議論内容 ───
function buildDiscussion(data) {
  const s = pres.addSlide({ masterName: "MASTER" });
  addSlideTitle(s, "議論内容");

  data.topics.forEach((topic, i) => {
    const y = 1.50 + i * 1.30;
    // 論点番号 + タイトル
    s.addText(`論点 ${i + 1}：${topic.title}`, {
      x: 0.533, y, w: 12.264, h: 0.40,
      fontSize: 14, bold: true, fontFace: FONT_JP, color: C.NAVY,
      valign: "middle",
    });
    // 議論内容
    s.addText(topic.content, {
      x: 0.733, y: y + 0.40, w: 12.064, h: 0.80,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "top",
    });
  });
}

// ─── 4. 議事録：宿題・next action ───
function buildActions(data) {
  const s = pres.addSlide({ masterName: "MASTER" });
  addSlideTitle(s, "宿題・next action");

  // ヘッダー
  const headers = ["#", "アクション", "担当", "期限"];
  const colXs = [0.533, 1.20, 9.50, 11.50];
  const colWs = [0.55, 8.20, 1.90, 1.30];
  const headerY = 1.50;

  headers.forEach((h, i) => {
    s.addShape("rect", {
      x: colXs[i], y: headerY, w: colWs[i], h: 0.50,
      fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
    });
    s.addText(h, {
      x: colXs[i], y: headerY, w: colWs[i], h: 0.50,
      fontSize: 13, bold: true, fontFace: FONT_JP, color: C.WHITE,
      align: "center", valign: "middle",
    });
  });

  // データ行
  data.actions.forEach((a, i) => {
    const y = headerY + 0.50 + i * 0.55;
    const row = [String(i + 1), a.action, a.assignee, a.due];
    row.forEach((cell, j) => {
      s.addShape("rect", {
        x: colXs[j], y, w: colWs[j], h: 0.55,
        fill: { color: C.WHITE }, line: { color: C.GRAY_LINE, width: 0.5 },
      });
      s.addText(cell, {
        x: colXs[j], y, w: colWs[j], h: 0.55,
        fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK,
        align: j === 0 ? "center" : "left", valign: "middle",
      });
    });
  });
}

// ─── 5. 検討資料：選択肢比較（メリデメ表）───
function buildOptions(data) {
  const s = pres.addSlide({ masterName: "MASTER" });
  addSlideTitle(s, data.title || "選択肢の比較");

  // リード文
  if (data.lead) {
    s.addText(data.lead, {
      x: 0.533, y: 1.226, w: 12.264, h: 0.50,
      fontSize: 14, bold: true, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "middle",
    });
  }

  // 各選択肢をカードで横並び
  const numOpts = data.options.length;
  const cardW = (12.264 - 0.20 * (numOpts - 1)) / numOpts;
  data.options.forEach((opt, i) => {
    const x = 0.533 + i * (cardW + 0.20);
    const y = 2.00;
    const h = 4.50;

    // カード本体
    s.addShape("rect", {
      x, y, w: cardW, h,
      fill: { color: C.WHITE }, line: { color: C.NAVY, width: 1.5 },
    });

    // ヘッダー帯
    s.addShape("rect", {
      x, y, w: cardW, h: 0.60,
      fill: { color: opt.recommended ? C.MAGENTA : C.NAVY }, line: { color: C.NAVY, width: 0 },
    });
    s.addText(opt.label + (opt.recommended ? "  ★推奨" : ""), {
      x, y, w: cardW, h: 0.60,
      fontSize: 14, bold: true, fontFace: FONT_JP, color: C.WHITE,
      align: "center", valign: "middle",
    });

    // 概要
    s.addText(opt.summary, {
      x: x + 0.20, y: y + 0.75, w: cardW - 0.40, h: 0.80,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
    });

    // メリット
    s.addText("メリット", {
      x: x + 0.20, y: y + 1.70, w: cardW - 0.40, h: 0.30,
      fontSize: 12, bold: true, fontFace: FONT_JP, color: C.NAVY, valign: "middle",
    });
    opt.pros.forEach((p, k) => {
      s.addText("● " + p, {
        x: x + 0.30, y: y + 2.00 + k * 0.40, w: cardW - 0.50, h: 0.40,
        fontSize: 11, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
      });
    });

    // デメリット（プロの下、領域は適宜）
    const demeritY = y + 2.00 + opt.pros.length * 0.40 + 0.20;
    s.addText("デメリット", {
      x: x + 0.20, y: demeritY, w: cardW - 0.40, h: 0.30,
      fontSize: 12, bold: true, fontFace: FONT_JP, color: C.MAGENTA, valign: "middle",
    });
    opt.cons.forEach((c, k) => {
      s.addText("● " + c, {
        x: x + 0.30, y: demeritY + 0.30 + k * 0.40, w: cardW - 0.50, h: 0.40,
        fontSize: 11, fontFace: FONT_JP, color: C.TEXT_DARK, valign: "top",
      });
    });
  });
}

// ─── サンプルデータ（議事録）───
const meetingData = {
  cover: {
    title: "プロジェクトキックオフ MTG",
    subtitle: "AI 活用検討プロジェクト",
    date: "2026 年 5 月 12 日（火）13:00 - 14:00",
    location: "貴社会議室 A / オンライン併用",
    participants: "貴社：3 名 / 弊社：2 名（敬称略・別紙）",
    purpose: "プロジェクト全体の方向性・スコープ・進め方の合意",
  },
  keyPoints: [
    "本プロジェクトのスコープは 01〜04 の 4 テーマとし、初年度は 03 / 02 を本命とする。",
    "要求整理を 1 ヶ月で完了し、6 月から要件定義に入る。",
    "成果物の所有権は貴社、運用保守は別途相談（インフラ運用は貴社、機能改善は弊社）。",
  ],
  topics: [
    {
      title: "テーマ優先度の確認",
      content: "弊社の VLM 技術が直接活きる 03 を最優先、03 と連携する 02 を次点とすることに合意。01・04 は対応可能だが、貴社のパートナー戦略次第。",
    },
    {
      title: "スケジュール感",
      content: "全体は約 8 ヶ月（要件定義 2 ヶ月 + 開発 3〜4 ヶ月 + 検証 2〜3 ヶ月）の見込み。要件定義完了後に開発の正式見積を提示。",
    },
    {
      title: "運用保守の責任分担",
      content: "インフラ運用は貴社、ML モデル再学習・機能改善は別途相談。問合せ対応は弊社では実施しない方針。",
    },
  ],
  actions: [
    { action: "要件定義キックオフの日程調整", assignee: "弊社 PM", due: "5/19" },
    { action: "対象データの開示範囲・取り回しの整理", assignee: "貴社", due: "5/26" },
    { action: "NDA 締結手続き", assignee: "両社法務", due: "5/30" },
    { action: "プロジェクト体制図の作成", assignee: "弊社 PM", due: "6/2" },
  ],
};

// ─── ビルド ───
buildCover(meetingData.cover);
buildKeyPoints({ points: meetingData.keyPoints });
buildDiscussion({ topics: meetingData.topics });
buildActions({ actions: meetingData.actions });

// 検討資料のサンプル：選択肢の比較
buildOptions({
  title: "運用方針の検討",
  lead: "本案件の運用フェーズについて、以下の 3 案を比較検討します。",
  options: [
    {
      label: "A：クラウド全面採用",
      summary: "AWS / Azure 等のクラウドで構築・運用。",
      pros: ["初期投資少", "スケール容易"],
      cons: ["継続コスト高", "セキュリティ要件次第"],
      recommended: false,
    },
    {
      label: "B：オンプレ全面採用",
      summary: "貴社の DC でハードを保有・運用。",
      pros: ["継続コスト低", "セキュリティ管理しやすい"],
      cons: ["初期投資大", "拡張に時間"],
      recommended: false,
    },
    {
      label: "C：ハイブリッド",
      summary: "機微データはオンプレ、AI 推論はクラウド。",
      pros: ["バランス型", "段階拡張可能"],
      cons: ["構成複雑", "両方の運用知識必要"],
      recommended: true,
    },
  ],
});

const outPath = "/home/claude/work/sample_meeting_doc.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`Build complete: ${outPath}`);
});

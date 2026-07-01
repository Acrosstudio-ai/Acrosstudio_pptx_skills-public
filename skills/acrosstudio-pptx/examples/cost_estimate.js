// 01〜04 各テーマの運用費用試算スライド
// 架空の半導体洗浄装置メーカー向け（サンプル）
// 4 枚構成（各テーマ 1 枚）
// 前提：システム本体は売り切り提供

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";  // 13.33 × 7.5 inch

// ─── カラー ───
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
  GREEN:        "2D7D2D",
  AMBER:        "D97706",
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

function addSlideTitle(s, theme, title) {
  s.addShape("rect", {
    x: 0.267, y: 0.40, w: 0.08, h: 0.666,
    fill: { color: C.NAVY }, line: { color: C.NAVY, width: 0 },
  });
  s.addText(`${theme}  ${title}  ─ 運用費用の試算`, {
    x: 0.533, y: 0.333, w: 10.50, h: 0.80,
    fontSize: 22, bold: true, fontFace: FONT_JP, color: C.NAVY,
    valign: "middle",
  });
}

// ─── 各テーマのスライド ───
function buildCostSlide(data) {
  const s = pres.addSlide({ masterName: "MASTER" });
  addSlideTitle(s, data.num, data.title);

  // 前提（NAVY_LIGHT 帯）
  s.addShape("rect", {
    x: 0.533, y: 1.20, w: 12.264, h: 0.65,
    fill: { color: C.NAVY_LIGHT }, line: { color: C.NAVY, width: 0.5 },
  });
  s.addText([
    { text: "前提： ", options: { bold: true, color: C.NAVY } },
    { text: "システム本体は売り切り提供。月次インフラ費の試算。装置 50 台規模・5 年保管・バッチ集約を仮定。問合せ対応・ML 再学習は別途。",
      options: { color: C.TEXT_DARK } },
  ], {
    x: 0.733, y: 1.20, w: 11.864, h: 0.65,
    fontSize: 13, fontFace: FONT_JP, valign: "middle",
  });

  // 2 カラム：クラウド構成 / オンプレ構成
  const colW = 6.10;
  const colY = 2.05;
  const colH = 4.50;
  const headerH = 0.60;
  const gap = 0.15;
  const cloudX = 0.533;
  const onpremX = cloudX + colW + gap;

  drawCostCard(s, cloudX, colY, colW, colH, headerH, "クラウド構成", C.NAVY, data.cloud);
  drawCostCard(s, onpremX, colY, colW, colH, headerH, "オンプレ構成", C.NAVY, data.onprem);

  // 注記（下段）
  s.addText([
    { text: "※ ", options: { color: C.MAGENTA, bold: true } },
    { text: data.note, options: { color: C.GRAY_MID } },
  ], {
    x: 0.533, y: 6.65, w: 12.264, h: 0.40,
    fontSize: 11, fontFace: FONT_JP, valign: "middle",
  });
}

function drawCostCard(s, x, y, w, h, headerH, title, color, plan) {
  // 枠
  s.addShape("rect", { x, y, w, h, fill: { color: C.WHITE }, line: { color, width: 1.5 } });
  // ヘッダー帯
  s.addShape("rect", { x, y, w, h: headerH, fill: { color }, line: { color, width: 0 } });
  s.addText(title, {
    x, y, w, h: headerH,
    fontSize: 16, bold: true, fontFace: FONT_JP, color: C.WHITE,
    align: "center", valign: "middle",
  });

  // 内訳項目（左：項目名、右：月額）
  const itemStartY = y + headerH + 0.25;
  const rowH = 0.45;
  plan.items.forEach((it, i) => {
    const ry = itemStartY + i * rowH;
    // 項目名
    s.addText("● " + it.label, {
      x: x + 0.25, y: ry, w: w - 2.5, h: rowH,
      fontSize: 12, fontFace: FONT_JP, color: C.TEXT_DARK,
      valign: "middle",
    });
    // 金額
    s.addText(it.cost, {
      x: x + w - 2.2, y: ry, w: 2.0, h: rowH,
      fontSize: 12, bold: true, fontFace: FONT_JP, color: C.NAVY,
      align: "right", valign: "middle",
    });
  });

  // 区切り線
  const totalY = itemStartY + plan.items.length * rowH + 0.10;
  s.addShape("line", {
    x: x + 0.25, y: totalY, w: w - 0.50, h: 0,
    line: { color: C.GRAY_LINE, width: 1 },
  });

  // 合計（月額 / 年額）
  s.addText("合計（概算）", {
    x: x + 0.25, y: totalY + 0.15, w: 3.0, h: 0.45,
    fontSize: 13, bold: true, fontFace: FONT_JP, color: C.TEXT_DARK,
    valign: "middle",
  });
  s.addText(plan.totalMonth, {
    x: x + 0.25, y: totalY + 0.65, w: w - 0.50, h: 0.40,
    fontSize: 14, bold: true, fontFace: FONT_JP, color,
    align: "right", valign: "middle",
  });
  s.addText(plan.totalYear, {
    x: x + 0.25, y: totalY + 1.05, w: w - 0.50, h: 0.40,
    fontSize: 14, bold: true, fontFace: FONT_JP, color,
    align: "right", valign: "middle",
  });
}

// ─── データ ───
const themes = [
  {
    num: "01",
    title: "故障予知保全",
    cloud: {
      items: [
        { label: "データ蓄積（時系列 DB / オブジェクトストレージ）", cost: "月 1〜3 万円" },
        { label: "推論（劣化予兆検知、バッチ集約）", cost: "月 2〜5 万円" },
        { label: "データ転送（装置 → クラウド、拠点間 VPN）", cost: "月 1〜2 万円" },
        { label: "UI・監視・セキュリティ機能", cost: "月 3〜5 万円" },
      ],
      totalMonth: "月額：7〜15 万円",
      totalYear:  "年額：約 80〜180 万円",
    },
    onprem: {
      items: [
        { label: "サーバ電気代（推論サーバ 2〜3 台）", cost: "月 1〜3 千円" },
        { label: "ストレージ電気代・バックアップ", cost: "月 1〜2 万円" },
        { label: "データセンター利用料（ハーフラック相当）", cost: "月 3〜5 万円" },
        { label: "拠点間 VPN・セキュリティ機能", cost: "月 1〜3 万円" },
      ],
      totalMonth: "月額：5〜10 万円",
      totalYear:  "年額：約 60〜120 万円",
    },
    note: "装置 50 台・5 年保管・バッチ集約前提。装置数 / 保管期間 / リアルタイム要件で変動します。",
  },
  {
    num: "02",
    title: "プロセス調整提案",
    cloud: {
      items: [
        { label: "データ蓄積（プロセス変数・履歴）", cost: "月 1〜3 万円" },
        { label: "推論（影響係数モデル適用、バッチ集約）", cost: "月 3〜8 万円" },
        { label: "データ転送（拠点間 VPN・03 連携）", cost: "月 1〜2 万円" },
        { label: "Web UI・監視・セキュリティ機能", cost: "月 3〜5 万円" },
      ],
      totalMonth: "月額：8〜18 万円",
      totalYear:  "年額：約 100〜220 万円",
    },
    onprem: {
      items: [
        { label: "サーバ電気代（推論 + Web 3〜4 台）", cost: "月 3〜5 千円" },
        { label: "ストレージ電気代・バックアップ", cost: "月 1〜2 万円" },
        { label: "データセンター利用料", cost: "月 4〜7 万円" },
        { label: "拠点間 VPN・セキュリティ機能", cost: "月 1〜3 万円" },
      ],
      totalMonth: "月額：6〜13 万円",
      totalYear:  "年額：約 70〜160 万円",
    },
    note: "提案リクエスト頻度・03 との API 連携頻度で変動。リアルタイム要件があれば 1.5〜2 倍に上振れ。",
  },
  {
    num: "03",
    title: "洗浄品質評価・要因分析",
    cloud: {
      items: [
        { label: "画像ストレージ・バックアップ", cost: "月 4〜10 万円" },
        { label: "画像解析（GPU 推論、夜間バッチ集約）", cost: "月 5〜15 万円" },
        { label: "データ転送（大量画像、拠点間 VPN）", cost: "月 2〜5 万円" },
        { label: "UI・監視・セキュリティ機能", cost: "月 3〜5 万円" },
      ],
      totalMonth: "月額：14〜35 万円",
      totalYear:  "年額：約 170〜420 万円",
    },
    onprem: {
      items: [
        { label: "GPU サーバ電気代（画像処理用）", cost: "月 1〜2 万円" },
        { label: "高速ストレージ電気代・バックアップ", cost: "月 2〜4 万円" },
        { label: "データセンター利用料", cost: "月 5〜10 万円" },
        { label: "拠点間 VPN・セキュリティ機能", cost: "月 1〜3 万円" },
      ],
      totalMonth: "月額：9〜19 万円",
      totalYear:  "年額：約 110〜230 万円",
    },
    note: "画像処理 GPU が必要なため 4 テーマ中最も高め。画像枚数・解像度・保管期間で大きく変動。リアルタイム化で 2〜3 倍に上振れ。",
  },
  {
    num: "04",
    title: "設計支援",
    cloud: {
      items: [
        { label: "ベクトル DB・ドキュメントストレージ", cost: "月 3〜6 万円" },
        { label: "LLM API 利用料（OpenAI / Anthropic 等）", cost: "月 5〜20 万円" },
        { label: "データ転送・Web UI・監視", cost: "月 3〜5 万円" },
        { label: "セキュリティ機能（機密文書扱い）", cost: "月 2〜4 万円" },
      ],
      totalMonth: "月額：13〜35 万円",
      totalYear:  "年額：約 160〜420 万円",
    },
    onprem: {
      items: [
        { label: "サーバ電気代・データセンター利用料", cost: "月 3〜6 万円" },
        { label: "LLM API 利用料（オンプレでも外部 API）", cost: "月 5〜20 万円" },
        { label: "バックアップ・拠点間 VPN", cost: "月 2〜4 万円" },
        { label: "セキュリティ機能（機密文書扱い）", cost: "月 1〜3 万円" },
      ],
      totalMonth: "月額：11〜33 万円",
      totalYear:  "年額：約 130〜400 万円",
    },
    note: "LLM API はオンプレでも避けにくく、両構成で費用差が小さくなります。設計者数・検索頻度・LLM 呼び出し量で変動。",
  },
];

themes.forEach(buildCostSlide);

const outPath = "/home/claude/work/01-04_運用費用_試算.pptx";
pres.writeFile({ fileName: outPath }).then(() => {
  console.log(`Build complete: 4 slides → ${outPath}`);
});

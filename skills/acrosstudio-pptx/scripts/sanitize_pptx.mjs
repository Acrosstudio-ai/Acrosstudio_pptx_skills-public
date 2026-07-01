// PowerPoint「修復が必要」対策：pptxgenjs が出力する .pptx の
// [Content_Types].xml から、実在しない slideMaster パートを指す
// 幽霊 <Override> エントリを除去する。
//
// 原因：pptxgenjs はスライド枚数ぶん <Override PartName=".../slideMasterN.xml">
// を書き出すが、実ファイルは slideMaster1.xml しか存在しない。存在しない
// パートへの参照が PowerPoint の修復ダイアログを引き起こす（LibreOffice は
// 寛容なため STEP 4 の PDF 化では気付けない）。gitbrent/PptxGenJS #1449 参照。
//
// 使い方（ビルド直後・納品前に必ず実行）：
//   node /mnt/skills/user/acrosstudio-pptx/scripts/sanitize_pptx.mjs "work/xxx.pptx"
// jszip は pptxgenjs の依存として入るため、npm install pptxgenjs 済みの
// 作業ディレクトリ（work/）から実行すること。

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// jszip は作業ディレクトリ（CWD）の node_modules から解決する。
// pptxgenjs をインストールすれば依存として入っている。
const require = createRequire(path.join(process.cwd(), "package.json"));
let JSZip;
try {
  JSZip = require("jszip");
} catch {
  // フォールバック：このスクリプト隣の node_modules も探す
  const require2 = createRequire(import.meta.url);
  JSZip = require2("jszip");
}

const file = process.argv[2];
if (!file) {
  console.error('usage: node sanitize_pptx.mjs "<file.pptx>"');
  process.exit(1);
}
if (!fs.existsSync(file)) {
  console.error(`not found: ${file}`);
  process.exit(1);
}

const zip = await JSZip.loadAsync(fs.readFileSync(file));

// 実在する slideMaster パート名を集める
const existing = new Set(
  Object.keys(zip.files)
    .filter((p) => /^ppt\/slideMasters\/slideMaster\d+\.xml$/.test(p))
    .map((p) => p.split("/").pop())
);

const ctPath = "[Content_Types].xml";
const ctFile = zip.file(ctPath);
if (!ctFile) {
  console.error("[Content_Types].xml not found — is this a valid .pptx?");
  process.exit(1);
}

let ct = await ctFile.async("string");
let removed = 0;
ct = ct.replace(
  /<Override\s+PartName="\/ppt\/slideMasters\/([^"]+)"[^>]*\/>/g,
  (match, filename) => {
    if (existing.has(filename)) return match;
    removed++;
    return "";
  }
);
zip.file(ctPath, ct);

const buf = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
});
fs.writeFileSync(file, buf);
console.log(
  `sanitized "${file}": removed ${removed} phantom slideMaster override(s), kept ${existing.size} real master(s)`
);

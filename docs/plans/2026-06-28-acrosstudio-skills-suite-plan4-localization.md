# Plan 4 — Japanese Localization (intake + 13 strat-* + engagement)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the 15 analytical-layer skills to Japanese-primary (description, triggers, body, output, contract headings, examples) so the whole intake → strategy → pptx pipeline is Japanese end-to-end.

**Architecture:** Re-author each skill in Acrosstudio 文体 Japanese (not machine-translation), preserving its method/structure, guided by a shared glossary. Skill `name` IDs, directories, engagement band filenames, and manifests are invariant — only natural-language content changes — so the validator (`name == dir`), build, triggering harness, and multi-platform manifests keep working untouched. `acrosstudio-pptx` is already Japanese and unchanged.

**Tech Stack:** Markdown SKILL.md, Plan 1 validator/triggering/build tooling, pptxgenjs (demo).

**Spec:** `docs/plans/2026-06-28-acrosstudio-skills-suite-plan4-localization-design.md`. **Depends on:** Plans 1–3 (`v0.3.0`, 16 skills on `main`).

---

## What these tasks are

Content-localization tasks. Each gives the complete spec: the Japanese **title**, the Japanese **trigger keywords**, and the instruction to re-author the existing English `SKILL.md` into 文体 Japanese per the glossary (Task 1). The English source file is the concrete content reference; the glossary fixes terminology. "Complete content" = a complete, unambiguous localization spec.

## Localization procedure (applies to every skill task 2–16)

1. Read the current English `skills/<name>/SKILL.md` and `docs/authoring/strategy-glossary-ja.md` (Task 1).
2. Re-author `skills/<name>/SKILL.md` in natural Acrosstudio 文体 Japanese, preserving the method, structure, and the `name` frontmatter **unchanged**. Localize: the `description` (must contain the task's Japanese trigger keywords), the section headings (概要 / 使用する場面 / 必要な情報 / 進め方 / 成果物 / 例 per glossary), all body prose, the Output section's produced-analysis title to the Japanese framework title, its output-section headings, and its closing contract headings to `## 要点` / `## 確認事項`. Replace the English example with a clearly-fictional Japanese one (figures labelled 確認前 / 例示).
3. Obey `skills/acrosstudio-pptx/reference/content_patterns.md` 文体・禁止語. Keep idiomatic English/romaji terms Japanese business uses verbatim (ROI, KPI, PoC).
4. Do NOT edit the triggering test or run git in the per-skill task — the integrator (Task 17) registers all Japanese `TRIGGERS` and commits. (When executing inline rather than in parallel, register triggers and validate per skill instead.)

> The skill `name` line stays exactly as-is (e.g. `name: strat-business-case`). Only content below/around it is localized. This mirrors `acrosstudio-pptx` (English `name`, Japanese everything else).

## File Structure

| Path | Responsibility |
| --- | --- |
| `docs/authoring/strategy-glossary-ja.md` | Canonical JA terms (titles, section headings, contract headings) |
| `docs/authoring/strat-skill-template.md` | Localized to Japanese |
| `skills/acrosstudio-intake/SKILL.md` … `skills/acrosstudio-engagement/SKILL.md` + `reference/workspace-contract.md` | Re-authored in Japanese |
| `tests/skill-triggering/triggering.test.mjs` | All 16 `TRIGGERS` entries → Japanese (Task 17) |
| `CHANGELOG.md`, manifests | Bump to 0.4.0 (Task 17) |

---

## Task 1: Glossary + localize the template & contract

**Files:**
- Create: `docs/authoring/strategy-glossary-ja.md`
- Modify: `docs/authoring/strat-skill-template.md`

- [ ] **Step 1: Author `docs/authoring/strategy-glossary-ja.md`**

It MUST contain three tables from the design spec §5: (a) template section headings (Overview→概要, When to use→使用する場面, Inputs→必要な情報, Method→進め方, Output→成果物, Example→例); (b) the output-contract headings (Key takeaways→`## 要点`, Open questions→`## 確認事項`); (c) the 15 framework titles (situation-assessment→現状分析, growth-barriers→成長阻害要因, assumption-audit→前提の検証, strategic-options→戦略オプション, business-case→ビジネスケース, pricing→価格戦略, portfolio-review→事業ポートフォリオ評価, operating-model→オペレーティングモデル, initiative-prioritizer→施策の優先順位付け, transformation-roadmap→変革ロードマップ, narrative→エグゼクティブ・ナラティブ, decision-memo→意思決定メモ, stakeholder-alignment→ステークホルダー調整, intake→エンゲージメント・インテーク, engagement→エンゲージメント統括). State that all strategy skills are Japanese-primary and obey `skills/acrosstudio-pptx/reference/content_patterns.md` 文体・禁止語. The glossary also records each skill's localized output-section headings as those skills are authored.

- [ ] **Step 2: Localize `docs/authoring/strat-skill-template.md`**

Re-author the template in Japanese: the section structure uses 概要 / 使用する場面 / 必要な情報 / 進め方 / 成果物 / 例, and the output contract requires the produced analysis to start `# <フレームワーク> — <対象>` and end with `## 要点` and `## 確認事項`. Keep the structural intent identical to the English template.

- [ ] **Step 3: Validate & commit**

Run: `node scripts/validate-skills.mjs` (still 16 skills, 0 errors — no skill changed yet) and `npm test` (18 pass).

```bash
git add docs/authoring/strategy-glossary-ja.md docs/authoring/strat-skill-template.md
git commit -m "docs: add Japanese strategy glossary and localize the skill template"
```

---

## Task 2: Localize `acrosstudio-intake`

- **Japanese title:** エンゲージメント・インテーク
- **Trigger keywords (must appear in the JA description):** `インテーク`, `ヒアリング`, `案件`, `スコープ`
- Follow the Localization procedure. Keep the intake's dialogue-style Method (one question at a time) and its produced summary `# エンゲージメント・インテーク — <顧客>` with sections 顧客 / 目的 / スコープ / 制約 / 確定情報 / `## 確認事項`.

- [ ] **Step 1:** Re-author `skills/acrosstudio-intake/SKILL.md` in Japanese per the procedure.

---

## Diagnosis (Tasks 3–5)

### Task 3: `strat-situation-assessment`
- **Title:** 現状分析 · **Triggers:** `現状分析`, `現状把握`, `診断`, `アセスメント`
- [ ] Re-author `skills/strat-situation-assessment/SKILL.md` in Japanese per the procedure.

### Task 4: `strat-growth-barriers`
- **Title:** 成長阻害要因 · **Triggers:** `成長`, `阻害要因`, `ボトルネック`, `停滞`
- [ ] Re-author `skills/strat-growth-barriers/SKILL.md` in Japanese per the procedure.

### Task 5: `strat-assumption-audit`
- **Title:** 前提の検証 · **Triggers:** `前提`, `検証`, `仮説`, `妥当性`
- [ ] Re-author `skills/strat-assumption-audit/SKILL.md` in Japanese per the procedure.

---

## Choice & economics (Tasks 6–9)

### Task 6: `strat-strategic-options`
- **Title:** 戦略オプション · **Triggers:** `戦略`, `オプション`, `選択肢`, `意思決定`
- [ ] Re-author `skills/strat-strategic-options/SKILL.md` in Japanese per the procedure.

### Task 7: `strat-business-case`
- **Title:** ビジネスケース · **Triggers:** `ビジネスケース`, `投資対効果`, `ROI`, `採算`
- Note: keep the pairing reference to the pptx skill's `roi_excel`.
- [ ] Re-author `skills/strat-business-case/SKILL.md` in Japanese per the procedure.

### Task 8: `strat-pricing`
- **Title:** 価格戦略 · **Triggers:** `価格`, `価格戦略`, `プライシング`, `マージン`
- [ ] Re-author `skills/strat-pricing/SKILL.md` in Japanese per the procedure.

### Task 9: `strat-portfolio-review`
- **Title:** 事業ポートフォリオ評価 · **Triggers:** `ポートフォリオ`, `事業評価`, `資源配分`, `選択と集中`
- [ ] Re-author `skills/strat-portfolio-review/SKILL.md` in Japanese per the procedure.

---

## Execution (Tasks 10–12)

### Task 10: `strat-operating-model`
- **Title:** オペレーティングモデル · **Triggers:** `オペレーティングモデル`, `組織`, `業務プロセス`, `ケイパビリティ`
- [ ] Re-author `skills/strat-operating-model/SKILL.md` in Japanese per the procedure.

### Task 11: `strat-initiative-prioritizer`
- **Title:** 施策の優先順位付け · **Triggers:** `施策`, `優先順位`, `インパクト`, `工数`
- [ ] Re-author `skills/strat-initiative-prioritizer/SKILL.md` in Japanese per the procedure.

### Task 12: `strat-transformation-roadmap`
- **Title:** 変革ロードマップ · **Triggers:** `変革`, `ロードマップ`, `フェーズ`, `マイルストーン`
- [ ] Re-author `skills/strat-transformation-roadmap/SKILL.md` in Japanese per the procedure.

---

## Communication (Tasks 13–15)

### Task 13: `strat-narrative`
- **Title:** エグゼクティブ・ナラティブ · **Triggers:** `ナラティブ`, `ストーリー`, `メッセージ`, `経営層`
- [ ] Re-author `skills/strat-narrative/SKILL.md` in Japanese per the procedure.

### Task 14: `strat-decision-memo`
- **Title:** 意思決定メモ · **Triggers:** `意思決定`, `メモ`, `提言`, `決裁`
- [ ] Re-author `skills/strat-decision-memo/SKILL.md` in Japanese per the procedure.

### Task 15: `strat-stakeholder-alignment`
- **Title:** ステークホルダー調整 · **Triggers:** `ステークホルダー`, `合意形成`, `関係者`, `巻き込み`
- [ ] Re-author `skills/strat-stakeholder-alignment/SKILL.md` in Japanese per the procedure.

---

## Task 16: Localize `acrosstudio-engagement`

**Files:**
- Modify: `skills/acrosstudio-engagement/SKILL.md`
- Modify: `skills/acrosstudio-engagement/reference/workspace-contract.md`

- **Title:** エンゲージメント統括 · **Triggers:** `エンゲージメント`, `一気通貫`, `オーケストレーション`, `パイプライン`

- [ ] **Step 1:** Re-author `skills/acrosstudio-engagement/SKILL.md` in Japanese per the procedure. The band scheme, band ranges, and `engagement/NN-*.md` filenames are UNCHANGED. The "collect each artifact's open-questions section" instruction now refers to `## 確認事項`. Rewrite the Kogane Industries walkthrough in Japanese.
- [ ] **Step 2:** Re-author `skills/acrosstudio-engagement/reference/workspace-contract.md` in Japanese (band table, contract rules, walkthrough) — filenames unchanged.

---

## Task 17: Integrate — Japanese triggers, validate, bump 0.4.0

**Files:**
- Modify: `tests/skill-triggering/triggering.test.mjs`
- Modify: `CHANGELOG.md`, manifests

- [ ] **Step 1: Replace all `TRIGGERS` with Japanese.** In `tests/skill-triggering/triggering.test.mjs`, replace each skill's `TRIGGERS` array with its Japanese keywords from this plan (the 15 localized skills; `acrosstudio-pptx` already uses Japanese triggers — leave it). Every keyword must be a substring of that skill's (now Japanese) `description`.

- [ ] **Step 2: Validate.** Run `node scripts/validate-skills.mjs` → expect `Validated 16 skill(s); 0 error(s)` (names unchanged; Japanese descriptions well under 1024 chars).

- [ ] **Step 3: Triggering + full gate.** Run `node --test 'tests/skill-triggering/**/*.test.mjs'` (Test A covers all 16; Test B confirms each Japanese description contains its Japanese triggers), then `npm test`, then `npm run build` → `Built 16 bundle(s).` If Test B fails for a skill, the description is missing a trigger substring — fix the description (it is authoritative) to include the term, then re-run.

- [ ] **Step 4: Bump to 0.4.0.** Run `node scripts/bump-version.mjs 0.4.0` then `node scripts/bump-version.mjs --check` (all 6 manifests at `0.4.0`).

- [ ] **Step 5: Changelog.** Add `## [0.4.0]` to `CHANGELOG.md`: Japanese localization of the analytical layer (intake + 13 strat-* + engagement); shared JA glossary.

- [ ] **Step 6: Commit.**

```bash
git add -A
git commit -m "feat: localize analytical-layer skills to Japanese; bump to 0.4.0"
```

> Tagging (`v0.4.0`) and pushing are deferred to the user.

---

## Task 18: Prove it — Japanese pipeline demo

**Files:** none committed (demo runs under gitignored `work/`).

- [ ] **Step 1: Re-run the Kogane demo with localized skills.** Following the engagement flow, run `acrosstudio-intake` → selected `strat-*` → `acrosstudio-pptx` for the fictional Kogane Industries, writing artifacts to `work/demo-ja/engagement/00-intake.md`, `10-…`, `20-…`, etc. The artifacts are now **Japanese**.

- [ ] **Step 2: Build the deck.** As in the earlier demo, copy assets from `skills/acrosstudio-pptx/assets/` to `work/demo-ja/assets/`, `cd work/demo-ja && npm init -y && npm install pptxgenjs`, author `build.js` from `examples/proposal_full.js` consuming the Japanese artifacts, and run it → `work/demo-ja/kogane-growth-proposal-ja.pptx`. Skip the soffice/PDF step (claude.ai-only).

- [ ] **Step 3: Verify.** Confirm the `.pptx` is a valid zip with slides (`unzip -l work/demo-ja/*.pptx | grep -c ppt/slides/slide`), that media (logos) are embedded, and that slide XML contains Japanese text (the deck should route to `BIZ UDPGothic`). Report slide count and the path.

---

## Self-Review (completed by plan author)

**Spec coverage:** Design §5 glossary → Task 1; §6 per-skill localization → Tasks 2–15 (each with title + triggers); §7 orchestrator → Task 16; §8 validation/0.4.0/demo → Tasks 17–18; §4 invariant (IDs/structure unchanged) → stated in the Localization procedure and every task touches only `SKILL.md`/reference content, never `name`/dirs/manifests/filenames.

**Placeholder scan:** No TBD/TODO. Each skill task gives a concrete Japanese title + exact trigger keywords; the body source is the existing English `SKILL.md` (concrete) plus the glossary. The "content-localization task" model is stated up front.

**Consistency:** Titles match design §5 exactly. Trigger keywords are Japanese and intended as substrings of each Japanese description (Task 17 Step 3 enforces, with a fix instruction — the same alignment Plan 2 required). Output contract `## 要点` / `## 確認事項` is uniform across the procedure, the template (Task 1), the orchestrator (Task 16), and the integration check. Skill count stays 16 (no skills added/removed); 16 bundles in Task 17/18.

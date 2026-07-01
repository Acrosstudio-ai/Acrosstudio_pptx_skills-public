# Plan 4 — Japanese Localization of the Analytical Layer (design spec)

- **Status:** Draft for review
- **Date:** 2026-06-28
- **Owner:** Acrosstudio (generative.ai@acrosstudio.co.jp)
- **Depends on:** Plans 1–3 (suite at `v0.3.0`, 16 skills on `main`)

## TL;DR (한국어)

분석 레이어 **15개 스킬**(`acrosstudio-intake` + 13개 `strat-*` + `acrosstudio-engagement`)을 **일본어 우선으로 풀 전환**한다. description·트리거·본문·출력·출력계약 헤딩(`## 要点` / `## 確認事項`)·예시를 모두 일본어(Acrosstudio 文体)로. **스킬 ID·디렉터리·밴드 파일명·매니페스트는 불변**(식별자) — 자연어 콘텐츠만 일본어화. 이미 일본어인 `acrosstudio-pptx`는 미변경. 공유 글로서리로 용어를 통일하고, 끝에 데모를 재실행해 **일본어 deck(BIZ UDPGothic)**으로 증명한다. `v0.4.0`.

---

## 1. Background — the language seam

The suite has a language seam. The **analytical layer** (`acrosstudio-intake`, the 13 `strat-*` skills, `acrosstudio-engagement`) is English. The **deliverable layer** (`acrosstudio-pptx`) is Japanese-native: its `description` and triggers are Japanese, and `reference/content_patterns.md` / `design_rules.md` encode Acrosstudio's 文体 (tone), 禁止語 (prohibited words), and font rules (`BIZ UDPGothic` for Japanese body, `Arial` for alphanumerics).

The Kogane pipeline demo exposed the seam: English engagement artifacts produced an English (Arial) deck. For Acrosstudio's Japanese clients, the whole pipeline should be Japanese end-to-end.

## 2. Goals

1. Convert the 15 analytical-layer skills to **Japanese-primary** (English content retired; concepts remain credited in `CREDITS.md`).
2. **Full** localization: `description` + triggers + body (概要/使用する場面/…) + produced output + output-contract headings + examples.
3. Keep the suite's machinery intact: validator, build, triggering tests, multi-platform manifests, and the engagement file-handoff all keep working unchanged.
4. Prove it: re-run the pipeline demo to produce a Japanese deck.

## 3. Non-goals (YAGNI)

- Modifying `acrosstudio-pptx` (already Japanese; it only benefits).
- The 8 deferred strategy skills (Market Intelligence, Risk/Governance).
- Maintaining English variants (retired, not kept in parallel).
- Changing the engagement workspace numbering / band scheme / filenames.

## 4. Confirmed decisions

1. **Japanese-primary, replace English** (not bilingual).
2. **Full depth** — description, triggers, SKILL.md body, output, and headings all Japanese.
3. **Output-contract headings localized:** `## Key takeaways` → `## 要点`, `## Open questions` → `## 確認事項`. Safe because no code parses these — the orchestrator and pptx are SKILL.md instructions read by Claude, and validate/build/test never reference the strings. The change is a coordinated documentation update across the template, the contract, all skills, and the orchestrator.
4. **Invariant — identifiers and structure DO NOT change.** Skill `name` values (e.g. `strat-business-case`), directory names, engagement band filenames (`engagement/NN-*.md`), and all platform manifests stay exactly as they are. Only natural-language content is localized. (This mirrors `acrosstudio-pptx`, whose `name` is English but whose `description`/body are Japanese.) This keeps `validate-skills.mjs` (which asserts `name == dir`), the build, and the triggering harness working untouched.

## 5. Glossary & 文体 (`docs/authoring/strategy-glossary-ja.md`)

A new shared glossary fixes canonical Japanese terms so all 15 skills are consistent and aligned with `acrosstudio-pptx/reference/content_patterns.md` (文体・禁止語).

**Template section headings:**

| English | 日本語 |
| --- | --- |
| Overview | 概要 |
| When to use | 使用する場面 |
| Inputs | 必要な情報 |
| Method | 進め方 |
| Output | 成果物 |
| Example | 例 |

**Output-contract headings:** `## 要点` (Key takeaways), `## 確認事項` (Open questions — fits the "never invent figures; surface for user confirmation" semantics exactly).

**Framework / skill titles** (the `# <Framework> — <subject>` title; the skill `name` ID is unchanged):

| Skill (ID, unchanged) | 日本語タイトル |
| --- | --- |
| acrosstudio-intake | エンゲージメント・インテーク |
| strat-situation-assessment | 現状分析 |
| strat-growth-barriers | 成長阻害要因 |
| strat-assumption-audit | 前提の検証 |
| strat-strategic-options | 戦略オプション |
| strat-business-case | ビジネスケース |
| strat-pricing | 価格戦略 |
| strat-portfolio-review | 事業ポートフォリオ評価 |
| strat-operating-model | オペレーティングモデル |
| strat-initiative-prioritizer | 施策の優先順位付け |
| strat-transformation-roadmap | 変革ロードマップ |
| strat-narrative | エグゼクティブ・ナラティブ |
| strat-decision-memo | 意思決定メモ |
| strat-stakeholder-alignment | ステークホルダー調整 |
| acrosstudio-engagement | エンゲージメント統括 |

Per-skill **output-section** headings (e.g. business-case's `## Scope & baseline`, `## Economics`, `## Sensitivities`) are localized per the glossary as each skill is authored — the glossary records each as it is fixed. The strat-skill template (`docs/authoring/strat-skill-template.md`) and the engagement workspace contract are updated to Japanese to match.

## 6. Per-skill localization (15 skills)

For each skill the implementation localizes:
- **`description`** → natural Japanese, ≤500 chars preferred, starting in the Japanese idiom for "Use when…" (e.g. 「〜のときに使用。」). Idiomatic English/romaji terms that Japanese business uses verbatim (ROI, KPI, PoC) are kept as-is.
- **Triggers** → Japanese (and idiomatic-English) keywords that are substrings of the Japanese description. The triggering test's `description.includes(trigger)` works identically on Japanese substrings (as `acrosstudio-pptx` already demonstrates). Each skill's `TRIGGERS` entry in `tests/skill-triggering/triggering.test.mjs` is replaced with its Japanese keywords.
- **Body** — all sections rewritten in Acrosstudio 文体 Japanese using glossary terms (not machine-translated; re-authored to read naturally and obey 禁止語).
- **Output** — the produced analysis uses the Japanese framework title and ends with `## 要点` / `## 確認事項`; its section headings are Japanese.
- **Example** — a clearly-fictional Japanese worked example (figures labelled illustrative / 確認前).

The skill `name`, directory, and supporting files keep their identifiers.

## 7. Orchestrator (`acrosstudio-engagement`)

Localize `SKILL.md` and `reference/workspace-contract.md` to Japanese. The band scheme, band ranges, and `engagement/NN-*.md` filenames are unchanged. The "collect each artifact's open-questions section" instruction now refers to `## 確認事項`. The worked walkthrough (Kogane Industries) is rewritten in Japanese.

## 8. Validation & release

- `node scripts/validate-skills.mjs` → `Validated 16 skill(s); 0 error(s)` (names unchanged → no `name != dir`; Japanese descriptions are well under the 1024-char cap).
- `node --test 'tests/skill-triggering/**/*.test.mjs'` → Test A still covers all 16; Test B confirms each Japanese description contains its Japanese triggers.
- `npm test`, `npm run build` → 16 bundles.
- `node scripts/bump-version.mjs 0.4.0`; update `CHANGELOG.md` (`## [0.4.0]` — Japanese localization of the analytical layer).
- **Demo re-run:** repeat the Kogane pipeline demo with the localized skills; the engagement artifacts are now Japanese, so `acrosstudio-pptx` renders a Japanese deck (`BIZ UDPGothic`). Verify the `.pptx` is valid and visually a Japanese deck. (Tagging/pushing `v0.4.0` deferred to the user.)

## 9. Risks & edge cases

- **No code parser** depends on the output-contract heading strings → localizing them is documentation-only; confirmed against `validate-skills.mjs`, the triggering test, and the build.
- **`name == dir`** validator rule → satisfied because IDs are untouched.
- **Description length** → Japanese is dense; descriptions stay far under 1024 chars (pptx's is ~150).
- **Triggers** → substring match is encoding-agnostic; Japanese works (pptx proves it).
- **Mixed-language prompts** → Japanese-primary triggers plus retained idiomatic English terms (ROI/KPI) cover the common cases; pure-English prompts are out of scope by the Japanese-primary decision.
- **Font** → Japanese content routes the pptx skill to `BIZ UDPGothic`; the demo verifies rendering (PDF/visual check is claude.ai-only, so local verification confirms validity + Japanese text presence).

## 10. Implementation phases (high level — detailed plan via writing-plans)

1. **Glossary & template** — author `docs/authoring/strategy-glossary-ja.md`; localize the strat-skill template + output contract.
2. **Localize skills (parallel)** — the 15 skills (description+triggers+body+output+headings+example), each per the glossary.
3. **Localize orchestrator** — `acrosstudio-engagement` SKILL.md + workspace-contract reference.
4. **Integrate** — update `TRIGGERS` (Japanese), validate (16), triggering, build (16), bump `0.4.0`, changelog.
5. **Prove** — re-run the Kogane demo → Japanese deck; verify.

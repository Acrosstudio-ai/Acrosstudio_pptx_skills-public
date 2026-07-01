# Plan 3 — `acrosstudio-engagement` orchestrator

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author the `acrosstudio-engagement` glue skill that orchestrates the existing skills into one coherent flow — intake → strategy analysis → deliverable — via a file-based engagement workspace, completing the "fusion" the suite was designed for.

**Architecture:** `acrosstudio-engagement` is a single orchestrator skill. It owns the **engagement workspace contract** (a `engagement/` working directory of numbered markdown artifacts) and a **stage map** that assigns each existing skill's output to a numbered band. It decides scope (full proposal vs. targeted analysis), runs the relevant skills in band order — each writing its normal output into the workspace — and finally feeds the artifacts to `acrosstudio-pptx`. No existing skill is modified: coupling stays low because every skill already emits the output contract (`## Key takeaways` / `## Open questions`), and the orchestrator does the placement. The pptx skill consumes whatever artifacts exist, so skipping bands is valid.

**Tech Stack:** Markdown SKILL.md (superpowers writing-skills style), Plan 1 validator/triggering/build tooling.

**Spec:** `docs/plans/2026-06-28-acrosstudio-skills-suite-design.md` (§7 composition). **Depends on:** Plan 1 (`v0.1.0`) + Plan 2 (`v0.2.0`, 15 skills on `main`).

---

## What this task is

Like Plan 2, the skill task is a **content-spec task**: it gives the complete spec (frontmatter, section structure, the band scheme, the orchestration behaviour, and a worked walkthrough requirement); the author writes original English prose. "Complete content" = a complete, unambiguous spec.

## The engagement workspace contract (authoritative — author it verbatim into the reference)

The orchestrator creates a working directory `engagement/` and writes numbered artifacts. Bands group the existing skills:

| Band | Stage | Skills (run those that fit the engagement) | Artifact filename |
| --- | --- | --- | --- |
| `00` | Intake | `acrosstudio-intake` | `engagement/00-intake.md` |
| `10`–`19` | Diagnosis | `strat-situation-assessment`, `strat-growth-barriers`, `strat-assumption-audit` | `engagement/1x-<skill>.md` |
| `20`–`29` | Choice & economics | `strat-strategic-options`, `strat-business-case`, `strat-pricing`, `strat-portfolio-review` | `engagement/2x-<skill>.md` |
| `30`–`39` | Execution | `strat-operating-model`, `strat-initiative-prioritizer`, `strat-transformation-roadmap` | `engagement/3x-<skill>.md` |
| `40`–`49` | Communication | `strat-narrative`, `strat-decision-memo`, `strat-stakeholder-alignment` | `engagement/4x-<skill>.md` |
| — | Deliverable | `acrosstudio-pptx` (reads `engagement/*.md`) | `*.pptx` / `*.xlsx` |

Rules of the contract:
- Each artifact is a strategy skill's normal output (its `# <Framework> — <subject>` analysis ending in `## Key takeaways` / `## Open questions`), saved at its band filename.
- Within a band, run only the skills the engagement needs; number them in run order (e.g. `10-situation-assessment.md`, `11-growth-barriers.md`).
- Skipping a band is valid. The deliverable step consumes whatever `engagement/*.md` files exist.
- Never invent client figures — the orchestrator surfaces every `## Open questions` item upward so the user confirms before the deliverable is built.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `skills/acrosstudio-engagement/SKILL.md` | The orchestrator skill |
| `skills/acrosstudio-engagement/reference/workspace-contract.md` | The band scheme + artifact contract (above) + a worked walkthrough |
| `tests/skill-triggering/triggering.test.mjs` | One new `TRIGGERS` entry |
| `CHANGELOG.md`, manifests | Final bump to 0.3.0 |

---

## Task 1: Author the `acrosstudio-engagement` skill

**Files:**
- Create: `skills/acrosstudio-engagement/SKILL.md`
- Create: `skills/acrosstudio-engagement/reference/workspace-contract.md`
- Modify: `tests/skill-triggering/triggering.test.mjs`

**Frontmatter (verbatim):**

```markdown
---
name: acrosstudio-engagement
description: Use when running a full Acrosstudio consulting engagement end-to-end and you need to orchestrate the intake, strategy, and deliverable skills into one coherent pipeline rather than running them piecemeal. Produces an engagement workspace and a deliverable.
---
```

(Description contains the trigger keywords `engagement`, `orchestrate`, `end-to-end`, `pipeline`.)

**SKILL.md body requirements** (follow the strat template structure from `docs/authoring/strat-skill-template.md`, adapting "Method" to an orchestration procedure):
- **Overview:** the orchestrator chains intake → strategy → deliverable through the `engagement/` workspace; each sub-skill stays independent and communicates only through numbered files.
- **When to use:** full proposals / multi-step engagements where several analyses feed a deliverable. When NOT: a single standalone analysis (call that `strat-*` skill directly) or a quick doc (call `acrosstudio-pptx` directly).
- **Inputs:** the engagement request; optionally an existing brief.
- **Method (orchestration):**
  1. Determine scope — full proposal, targeted analysis set, or deliverable-only.
  2. Run `acrosstudio-intake` (unless a complete brief exists) → write `engagement/00-intake.md`.
  3. Select the bands and skills that fit the objective; run each selected `strat-*` skill and save its output to its band filename per the workspace contract.
  4. After each band, collect `## Open questions` and confirm unknowns with the user before proceeding — never fabricate figures.
  5. When the analysis is sufficient, invoke `acrosstudio-pptx`, pointing it at `engagement/*.md` as the content source for the deliverable.
  6. Report the workspace contents and the deliverable path.
- **Output:** the populated `engagement/` workspace + the final `.pptx`/`.xlsx`. Reference `reference/workspace-contract.md` for the band scheme.
- **Example:** a brief, clearly-fictional end-to-end walkthrough (e.g. a mid-size manufacturer proposal): intake → situation-assessment → strategic-options → business-case → transformation-roadmap → narrative → pptx, naming each `engagement/NN-*.md` file produced.

**Reference doc** (`reference/workspace-contract.md`): author the band table and contract rules above verbatim, plus the fictional walkthrough mapping each step to its artifact filename.

**TRIGGERS entry** to add: `'acrosstudio-engagement': ['engagement', 'orchestrate', 'end-to-end', 'pipeline']`.

- [ ] **Step 1:** Author `skills/acrosstudio-engagement/SKILL.md` per the above (original English prose, strat-template structure).
- [ ] **Step 2:** Author `skills/acrosstudio-engagement/reference/workspace-contract.md` with the band table, contract rules, and walkthrough.
- [ ] **Step 3:** Add the TRIGGERS entry to `tests/skill-triggering/triggering.test.mjs`.
- [ ] **Step 4:** Run `node scripts/validate-skills.mjs` → expect `Validated 16 skill(s); 0 error(s)`.
- [ ] **Step 5:** Run `node --test 'tests/skill-triggering/**/*.test.mjs'` → expect pass (Test A now covers 16 skills; Test B confirms the 4 triggers are in the description).
- [ ] **Step 6:** Commit.

```bash
git add skills/acrosstudio-engagement tests/skill-triggering/triggering.test.mjs
git commit -m "feat: add acrosstudio-engagement orchestrator skill"
```

---

## Task 2: Wire the pipeline into the docs

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`

- [ ] **Step 1: Document the pipeline in `CLAUDE.md`**

Add a short "Engagement pipeline" subsection: `acrosstudio-engagement` orchestrates intake → `strat-*` → `acrosstudio-pptx` through the `engagement/` workspace (see `skills/acrosstudio-engagement/reference/workspace-contract.md`).

- [ ] **Step 2: Update `README.md` skills list**

Replace the "coming in Plan 2/3" lines with the now-complete inventory: `acrosstudio-intake`, the 13 `strat-*` skills, `acrosstudio-engagement`, and `acrosstudio-pptx` — and one sentence describing the intake → strategy → deliverable flow.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "docs: document the engagement pipeline"
```

---

## Task 3: Suite-wide validation, version bump & changelog

**Files:**
- Modify: manifests via `scripts/bump-version.mjs`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Validate all skills**

Run: `node scripts/validate-skills.mjs`
Expected: `Validated 16 skill(s); 0 error(s)`.

- [ ] **Step 2: Triggering coverage + full gate + build**

Run: `node --test 'tests/skill-triggering/**/*.test.mjs'`, then `npm test`, then `npm run build`.
Expected: triggering Test A covers all 16 skills; `npm test` all pass; `Built 16 bundle(s).`

- [ ] **Step 3: Bump to 0.3.0**

Run: `node scripts/bump-version.mjs 0.3.0` then `node scripts/bump-version.mjs --check`.
Expected: all 6 manifests at `0.3.0`, in sync.

- [ ] **Step 4: Update `CHANGELOG.md`**

Add `## [0.3.0]` listing `acrosstudio-engagement` and the completed intake → strategy → deliverable pipeline.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add engagement orchestrator, complete pipeline, bump to 0.3.0"
```

> Tagging (`v0.3.0`) and pushing are deferred to the user.

---

## Self-Review (completed by plan author)

**Spec coverage:** Design §7 (composition / the "fusion") — Task 1 authors `acrosstudio-engagement` with the exact `engagement/00-50` file-based handoff, the band scheme maps every existing skill, and the deliverable step feeds `acrosstudio-pptx`. The "skipping stages is valid" and "never invent figures" rules from §7 are in the contract. No existing skill is modified (low coupling preserved).

**Placeholder scan:** No TBD/TODO. The frontmatter is verbatim, the band table and contract rules are concrete, the orchestration Method steps are explicit, and the TRIGGERS entry is exact. Prose authoring is scoped via the "content-spec task" model.

**Consistency:** The description contains all four TRIGGERS keywords (`engagement`, `orchestrate`, `end-to-end`, `pipeline`). Skill count math is consistent: 15 (after Plan 2) + 1 = 16 skills and 16 bundles (Task 3 Steps 1–2). The artifact contract reuses Plan 2's output contract (`## Key takeaways` / `## Open questions`), which every `strat-*` skill already emits.

# Plan 2 — Process & Strategy Skills (intake + 13 strat-*)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author `acrosstudio-intake` plus the 13 re-authored `strat-*` strategy-framework skills, all following one shared template and validated by the existing validator + skill-triggering harness.

**Architecture:** Each skill is a self-contained `skills/<name>/SKILL.md` (flat namespace, English prose, original content). A shared authoring template (Task 1) fixes the section structure and a small **output contract** so every strategy skill emits a consistent standalone markdown analysis that Plan 3's `acrosstudio-engagement` orchestrator can later chain. Skills are independent — no skill imports another. Every skill registers its trigger vocabulary in the Plan 1 triggering test, so coverage is enforced.

**Tech Stack:** Markdown SKILL.md (superpowers writing-skills style), Node validator/triggering tests from Plan 1.

**Spec:** `docs/plans/2026-06-28-acrosstudio-skills-suite-design.md` (§6 inventory, §7 composition, §14 authoring standard). **Depends on:** Plan 1 (merged, `v0.1.0`).

---

## What these tasks are

These are **content-spec tasks**, not code tasks. Each skill task gives the **complete spec** an author needs: exact frontmatter, the required section structure (from Task 1), the framework's Method steps, the Output sections, a worked-example requirement, and the exact trigger keywords. The author writes original English prose that satisfies the spec (following the Task 1 template and the superpowers writing-skills discipline). "Complete content" here means a complete, unambiguous spec — never vague guidance like "write good content."

## Authoring procedure (applies to every skill task 2–15)

Every skill task follows these mechanical steps (the per-task body provides only the skill-specific content):

1. Create `skills/<name>/SKILL.md` with the task's exact frontmatter and the Task 1 section structure, authoring original prose for each section per the task's requirements.
2. Add the skill's entry to the `TRIGGERS` map in `tests/skill-triggering/triggering.test.mjs` using the task's trigger keywords (each keyword MUST appear in the skill's `description`).
3. Run `node scripts/validate-skills.mjs` → expect `0 error(s)` (a description-length warning is acceptable).
4. Run `node --test 'tests/skill-triggering/**/*.test.mjs'` → expect all pass (Test A coverage + Test B vocabulary).
5. Commit with the message shown in the task.

> Reminder: description ≤ 500 chars preferred; start with "Use when…"; state triggering conditions only (not the method). English prose. Do not invent client numbers — skills instruct the user/orchestrator to supply or confirm them.

## File Structure

| Path | Responsibility |
| --- | --- |
| `docs/authoring/strat-skill-template.md` | The shared skill template + output contract (Task 1) |
| `CLAUDE.md` | Extended with a "Strategy skill authoring" pointer (Task 1) |
| `skills/acrosstudio-intake/SKILL.md` | Engagement intake (Task 2) |
| `skills/strat-situation-assessment/SKILL.md` … `skills/strat-stakeholder-alignment/SKILL.md` | The 13 frameworks (Tasks 3–15) |
| `tests/skill-triggering/triggering.test.mjs` | Gains one `TRIGGERS` entry per new skill |
| `CHANGELOG.md`, manifests via `bump-version.mjs` | Final version bump (Task 16) |

---

## Task 1: Strategy-skill template & output contract

**Files:**
- Create: `docs/authoring/strat-skill-template.md`
- Modify: `CLAUDE.md` (add a pointer)

- [ ] **Step 1: Write `docs/authoring/strat-skill-template.md`**

It MUST define this SKILL.md section structure that every strategy skill follows:

```markdown
---
name: <skill-name>
description: Use when <triggering conditions/symptoms>. <one short phrase of what it produces>.
---

# <Framework Name>

## Overview
What the framework is and its core principle (1–2 sentences).

## When to use
- Symptoms / situations that call for it
- When NOT to use it

## Inputs
The information the framework needs. If something is missing, ASK the user — never invent figures.

## Method
Numbered steps to apply the framework.

## Output
The skill produces a standalone markdown analysis with this shape (the **output contract**):

# <Framework> — <subject>
## <framework-specific sections>
## Key takeaways
## Open questions

## Example
A brief worked illustration (fictional, clearly labelled).
```

It MUST also state the **output contract** rule: every strategy skill ends its produced analysis with `## Key takeaways` and `## Open questions`, and uses a top-level `# <Framework> — <subject>` title, so Plan 3's orchestrator can consume and chain them. English prose throughout.

- [ ] **Step 2: Add a pointer in `CLAUDE.md`**

Under the existing "Add or edit a skill" section, add: strategy skills (`strat-*`) follow `docs/authoring/strat-skill-template.md`; register each new skill's trigger vocabulary in `tests/skill-triggering/triggering.test.mjs`.

- [ ] **Step 3: Validate docs are well-formed and commit**

Run: `node scripts/validate-skills.mjs` (still 1 skill, 0 errors — no skill added yet) and `npm test` (18 pass).
Expected: green.

```bash
git add docs/authoring/strat-skill-template.md CLAUDE.md
git commit -m "docs: add strategy-skill template and output contract"
```

---

## Task 2: `acrosstudio-intake` (process skill)

**Files:**
- Create: `skills/acrosstudio-intake/SKILL.md`
- Modify: `tests/skill-triggering/triggering.test.mjs` (add `acrosstudio-intake` triggers)

**Frontmatter (verbatim):**

```markdown
---
name: acrosstudio-intake
description: Use when starting an Acrosstudio consulting engagement and you need to gather the brief before any analysis or deliverable — client context, objective, scope, constraints, and known/unknown figures. Produces an intake summary.
---
```

**Body requirements** (follow the Task 1 structure; this is a process skill so adapt "Method" to a dialogue):
- **Overview:** one-question-at-a-time intake dialogue (inspired by brainstorming) that captures the engagement brief before strategy work begins.
- **When to use:** at engagement kickoff; when a request is vague; before `strat-*` or `acrosstudio-pptx`. When NOT: when a complete brief already exists.
- **Inputs:** the user's initial request.
- **Method (dialogue):** ask, one question at a time, to capture: (1) client — industry, size, relationship/history; (2) engagement type (proposal / analysis / meeting doc); (3) objective & success criteria; (4) scope & out-of-scope; (5) constraints (time, budget, stakeholders); (6) known figures vs unknowns — never invent numbers, mark unknowns to confirm.
- **Output:** an intake summary markdown titled `# Engagement intake — <client>` with sections `## Client`, `## Objective`, `## Scope`, `## Constraints`, `## Known figures`, `## Open questions`. (This is the front of the Plan 3 chain.)
- **Example:** a brief fictional intake.

**TRIGGERS entry** to add: `'acrosstudio-intake': ['engagement', 'intake', 'brief', 'scope']` (each appears in the description).

- [ ] **Step 1:** Author `skills/acrosstudio-intake/SKILL.md` per the above (Authoring procedure step 1).
- [ ] **Step 2:** Add the TRIGGERS entry (procedure step 2).
- [ ] **Step 3:** Run `node scripts/validate-skills.mjs` → 0 errors (procedure step 3).
- [ ] **Step 4:** Run `node --test 'tests/skill-triggering/**/*.test.mjs'` → pass (procedure step 4).
- [ ] **Step 5:** Commit.

```bash
git add skills/acrosstudio-intake tests/skill-triggering/triggering.test.mjs
git commit -m "feat: add acrosstudio-intake engagement intake skill"
```

---

## Diagnosis & Framing (Tasks 3–5)

### Task 3: `strat-situation-assessment`

**Frontmatter:**
```markdown
---
name: strat-situation-assessment
description: Use when you need a structured current-state diagnosis — what is true now about the market, business, operations, and organization — before deciding anything. Produces a situation assessment.
---
```
**Method steps:** (1) frame the core question; (2) gather facts across market / financials / operations / organization; (3) structure with a lens (e.g., 3C, 7S); (4) separate facts from inferences; (5) synthesize the core problem statement.
**Output sections:** `## Context`, `## Key facts`, `## Structured view`, `## Core problem`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['situation', 'current-state', 'diagnosis', 'assessment']`
**Commit:** `feat: add strat-situation-assessment skill`

### Task 4: `strat-growth-barriers`

**Frontmatter:**
```markdown
---
name: strat-growth-barriers
description: Use when growth has stalled or is below target and you need to find what is actually blocking it. Produces a ranked diagnosis of growth barriers and root causes.
---
```
**Method steps:** (1) express the growth equation (e.g., volume × price × mix, or the funnel); (2) locate where the equation breaks; (3) root-cause each break (5-whys); (4) separate binding constraints from symptoms; (5) rank by impact and addressability.
**Output sections:** `## Growth model`, `## Barriers (ranked)`, `## Root causes`, `## Where to intervene`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['growth', 'barriers', 'blocking', 'stalled']`
**Commit:** `feat: add strat-growth-barriers skill`

### Task 5: `strat-assumption-audit`

**Frontmatter:**
```markdown
---
name: strat-assumption-audit
description: Use when a plan, forecast, or belief rests on assumptions you have not tested, and you need to audit which ones are fragile and load-bearing. Produces an assumption register.
---
```
**Method steps:** (1) surface explicit and implicit assumptions; (2) classify each as fact / inference / belief; (3) test each against evidence and sensitivity; (4) flag load-bearing + fragile ones; (5) state what would change the conclusion.
**Output sections:** `## Assumptions`, `## Classification & confidence`, `## Load-bearing & fragile`, `## What would change the conclusion`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['assumption', 'audit', 'fragile', 'belief']`
**Commit:** `feat: add strat-assumption-audit skill`

---

## Strategic Choice & Economics (Tasks 6–9)

### Task 6: `strat-strategic-options`

**Frontmatter:**
```markdown
---
name: strat-strategic-options
description: Use when a strategic decision is open and you need distinct alternatives — a structured set of options compared on explicit criteria, not a single pre-baked answer. Produces an options analysis.
---
```
**Method steps:** (1) state the decision and decision criteria; (2) generate MECE options including do-nothing; (3) evaluate each against criteria; (4) surface trade-offs and reversibility; (5) recommend with rationale.
**Output sections:** `## Decision & criteria`, `## Options`, `## Evaluation`, `## Trade-offs`, `## Recommendation`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['options', 'strategic', 'decision', 'alternatives']`
**Commit:** `feat: add strat-strategic-options skill`

### Task 7: `strat-business-case`

**Frontmatter:**
```markdown
---
name: strat-business-case
description: Use when you need to justify an investment or initiative with economics — costs, benefits, ROI, payback, and sensitivities — for a go/no-go decision. Produces a business case. Pairs with the pptx skill's roi_excel.
---
```
**Method steps:** (1) define scope and baseline; (2) model costs and benefits over a horizon; (3) list key assumptions (ask for unknown figures); (4) compute NPV / ROI / payback; (5) run sensitivities; (6) state risks and the decision ask.
**Output sections:** `## Scope & baseline`, `## Economics`, `## Assumptions`, `## Sensitivities`, `## Risks`, `## Decision ask`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['business case', 'ROI', 'payback', 'investment']`
**Commit:** `feat: add strat-business-case skill`

### Task 8: `strat-pricing`

**Frontmatter:**
```markdown
---
name: strat-pricing
description: Use when you need to set or revise a price and choose a pricing model — cost-plus, value-based, or competition-based — weighing willingness-to-pay against margin and volume. Produces a pricing recommendation.
---
```
**Method steps:** (1) choose pricing logic (cost-plus / value-based / competition-based); (2) estimate value and willingness-to-pay; (3) design structure (tiers, bundles, discounts); (4) model margin and volume implications; (5) recommend with guardrails.
**Output sections:** `## Pricing logic`, `## Value & willingness-to-pay`, `## Structure`, `## Margin & volume impact`, `## Recommendation`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['pricing', 'price', 'willingness-to-pay', 'margin']`
**Commit:** `feat: add strat-pricing skill`

### Task 9: `strat-portfolio-review`

**Frontmatter:**
```markdown
---
name: strat-portfolio-review
description: Use when you must decide resource allocation across a portfolio of products, initiatives, or markets and need a structured grow/hold/fix/exit view. Produces a portfolio review.
---
```
**Method steps:** (1) define the units and two evaluation axes (e.g., attractiveness × ability-to-win); (2) place each unit; (3) assign grow / hold / fix / exit; (4) check resource balance; (5) propose reallocation moves.
**Output sections:** `## Units & axes`, `## Portfolio map`, `## Per-unit verdict`, `## Reallocation`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['portfolio', 'allocation', 'grow', 'exit']`
**Commit:** `feat: add strat-portfolio-review skill`

---

## Operating Model & Execution (Tasks 10–12)

### Task 10: `strat-operating-model`

**Frontmatter:**
```markdown
---
name: strat-operating-model
description: Use when a chosen strategy needs an operating model to deliver it — the capabilities, structure, processes, governance, people, and technology — and you need to find the gaps. Produces a target operating model.
---
```
**Method steps:** (1) derive required capabilities from the strategy; (2) design structure, processes, governance, people, technology; (3) compare to current state; (4) identify gaps; (5) outline the transition.
**Output sections:** `## Required capabilities`, `## Target operating model`, `## Gaps`, `## Transition`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['operating model', 'capabilities', 'governance', 'structure']`
**Commit:** `feat: add strat-operating-model skill`

### Task 11: `strat-initiative-prioritizer`

**Frontmatter:**
```markdown
---
name: strat-initiative-prioritizer
description: Use when there are more initiatives than capacity and you need a defensible priority order by impact, effort, fit, and dependencies. Produces a prioritized initiative list.
---
```
**Method steps:** (1) list initiatives; (2) score each on impact and effort (plus strategic fit, risk); (3) map dependencies; (4) sequence into now / next / later; (5) check against capacity.
**Output sections:** `## Initiatives`, `## Scoring`, `## Dependencies`, `## Sequence (now/next/later)`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['initiative', 'prioritize', 'impact', 'effort']`
**Commit:** `feat: add strat-initiative-prioritizer skill`

### Task 12: `strat-transformation-roadmap`

**Frontmatter:**
```markdown
---
name: strat-transformation-roadmap
description: Use when a change effort needs to be sequenced into phases on a roadmap with workstreams, milestones, dependencies, and quick wins. Produces a transformation roadmap.
---
```
**Method steps:** (1) define end-state and workstreams; (2) sequence into phases/waves; (3) set milestones and owners; (4) map cross-workstream dependencies; (5) place quick wins early.
**Output sections:** `## End-state & workstreams`, `## Phases`, `## Milestones & owners`, `## Dependencies`, `## Quick wins`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['transformation', 'roadmap', 'phases', 'milestones']`
**Commit:** `feat: add strat-transformation-roadmap skill`

---

## Alignment & Executive Communication (Tasks 13–15)

### Task 13: `strat-narrative`

**Frontmatter:**
```markdown
---
name: strat-narrative
description: Use when findings need to become a persuasive executive story with a single governing message and a logical line of argument tailored to the audience. Produces an executive narrative.
---
```
**Method steps:** (1) define the audience and what they must decide; (2) state the governing thought (one sentence); (3) build the key lines (pyramid principle / SCR); (4) attach supporting evidence; (5) tighten to the through-line.
**Output sections:** `## Audience`, `## Governing message`, `## Key lines`, `## Supporting evidence`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['narrative', 'story', 'governing message', 'audience']`
**Commit:** `feat: add strat-narrative skill`

### Task 14: `strat-decision-memo`

**Frontmatter:**
```markdown
---
name: strat-decision-memo
description: Use when a decision-maker needs a concise one-page memo with the recommendation up front, the options considered, the rationale, and the ask. Produces a decision memo.
---
```
**Method steps:** (1) state the decision needed; (2) lead with the recommendation; (3) give the minimal context; (4) summarize options considered; (5) give rationale and key risks; (6) state the explicit ask.
**Output sections:** `## Decision needed`, `## Recommendation`, `## Context`, `## Options considered`, `## Rationale & risks`, `## The ask`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['decision memo', 'recommendation', 'memo', 'the ask']`
**Commit:** `feat: add strat-decision-memo skill`

### Task 15: `strat-stakeholder-alignment`

**Frontmatter:**
```markdown
---
name: strat-stakeholder-alignment
description: Use when a decision or change needs buy-in and you must map stakeholders by influence and interest, read their positions, and plan engagement to move them. Produces a stakeholder alignment plan.
---
```
**Method steps:** (1) list stakeholders; (2) map on influence × interest; (3) assess each one's current position and concerns; (4) design per-stakeholder messages and engagement; (5) pre-empt objections.
**Output sections:** `## Stakeholders`, `## Influence × interest map`, `## Positions & concerns`, `## Engagement plan`, `## Objections & responses`, `## Key takeaways`, `## Open questions`.
**TRIGGERS:** `['stakeholder', 'alignment', 'buy-in', 'influence']`
**Commit:** `feat: add strat-stakeholder-alignment skill`

---

## Task 16: Suite-wide validation, version bump & changelog

**Files:**
- Modify: version-bearing manifests via `scripts/bump-version.mjs`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Validate all skills**

Run: `node scripts/validate-skills.mjs`
Expected: `Validated 15 skill(s); 0 error(s)` (warnings about description length acceptable).

- [ ] **Step 2: Triggering coverage for all 15 skills**

Run: `node --test 'tests/skill-triggering/**/*.test.mjs'`
Expected: pass — Test A confirms every one of the 15 skills has a `TRIGGERS` entry; Test B confirms each description contains its trigger vocabulary.

- [ ] **Step 3: Full gate + build all bundles**

Run: `npm test` (expect all pass), then `npm run build`.
Expected: `Built 15 bundle(s).` — one `dist/<name>.skill` per skill.

- [ ] **Step 4: Bump version to 0.2.0**

Run: `node scripts/bump-version.mjs 0.2.0` then `node scripts/bump-version.mjs --check`.
Expected: all 6 manifests report `0.2.0`, in sync.

- [ ] **Step 5: Update `CHANGELOG.md`**

Add a `## [0.2.0]` section listing: `acrosstudio-intake` and the 13 `strat-*` strategy skills; the strategy-skill template & output contract.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: validate suite, add 14 skills, bump to 0.2.0"
```

> Tagging (`v0.2.0`) and pushing are deferred to the user (do not tag or push in the autonomous run).

---

## Self-Review (completed by plan author)

**Spec coverage:** Design §6 inventory — `acrosstudio-intake` (Task 2) + all 13 `strat-*` (Tasks 3–15) each have a task; §7 composition — the output contract (Task 1) makes every skill emit `## Key takeaways` / `## Open questions` for Plan 3 chaining; §14 authoring standard — Task 1 template + the per-task "Use when…" descriptions + triggering registration. `acrosstudio-engagement` (the glue) is explicitly Plan 3, not a gap.

**Placeholder scan:** No TBD/TODO. Each skill task carries complete frontmatter, concrete Method steps, exact Output sections, and exact TRIGGERS keywords. "Content-spec task" model is stated up front, so per-skill prose authoring is scoped, not vague.

**Consistency:** Every `strat-*` description contains its TRIGGERS keywords (verified per task — e.g. Task 7 description contains "business case", "ROI", "payback", "investment"). Every Output ends with `## Key takeaways` + `## Open questions` per the Task 1 contract. The triggering test's Test A (coverage) means all 15 skills must be registered — Task 16 Step 2 asserts exactly 15. Build count (15) in Task 16 Step 3 matches 14 new + `acrosstudio-pptx`.

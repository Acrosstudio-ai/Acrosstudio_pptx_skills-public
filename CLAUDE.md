# Acrosstudio Skills Suite — Contributor & Agent Guide

## What this repo is

A multi-platform plugin of Acrosstudio Claude skills. The repo root is the
plugin; `skills/` is the single source of truth (flat namespace).

## Naming convention

- `acrosstudio-*` — branded products (intake, engagement, pptx)
- `strat-*` — generic strategy frameworks

## Add or edit a skill

1. Create `skills/<name>/SKILL.md` with frontmatter `name` (== directory) and a
   "Use when…" `description` (triggering conditions only, ≤ 500 chars preferred).
2. Keep supporting files inside the skill directory (path-traversal is blocked
   after install). Heavy reference (100+ lines) or scripts get their own files.
3. Run `npm run validate`.

### Strategy skills (`strat-*`)

Strategy skills follow the shared section structure and output contract defined
in `docs/authoring/strat-skill-template.md`. Read that document before authoring
any `strat-*` skill — it defines the required sections (Overview, When to use,
Inputs, Method, Output, Example), the mandatory `## Key takeaways` /
`## Open questions` output contract, and the checklist to satisfy before
committing. After authoring the SKILL.md, register the new skill's trigger
vocabulary in `tests/skill-triggering/triggering.test.mjs` so coverage tests
continue to pass.

## Engagement pipeline

`acrosstudio-engagement` orchestrates the suite end-to-end: it runs intake →
the `strat-*` analyses → `acrosstudio-pptx`, handing output between stages
through numbered markdown artifacts in an `engagement/` workspace. Each
sub-skill stays independent and communicates only through those files, so
skipping a stage is valid. See
`skills/acrosstudio-engagement/reference/workspace-contract.md` for the band
scheme and artifact contract.

## Build & release

- `npm run validate` — structural checks
- `npm run build` — produces `dist/*.skill` for claude.ai upload
- `npm test` — Node unit tests
- `node scripts/bump-version.mjs <x.y.z>` — sync version across all manifests
- `npm run version:check` — detect version drift

## Specs

Design and implementation specs live in `docs/plans/`.

# Acrosstudio Skills Suite

Acrosstudio's Claude skills for consulting delivery: engagement intake,
McKinsey-style strategy frameworks, and branded PPTX/XLSX deliverables.
The repo root is a Claude Code plugin; `skills/` is the single source of truth.

## Skills

- `acrosstudio-intake` — gathers the engagement brief (client, objective, scope,
  constraints, known vs. unknown figures) before strategy work begins.
- 13 `strat-*` strategy frameworks — `strat-situation-assessment`,
  `strat-growth-barriers`, `strat-assumption-audit`, `strat-strategic-options`,
  `strat-business-case`, `strat-pricing`, `strat-portfolio-review`,
  `strat-operating-model`, `strat-initiative-prioritizer`,
  `strat-transformation-roadmap`, `strat-narrative`, `strat-decision-memo`,
  `strat-stakeholder-alignment` — each emitting a standalone analysis under a
  shared output contract.
- `acrosstudio-engagement` — orchestrator that chains the skills below into one
  pipeline through an `engagement/` workspace.
- `acrosstudio-pptx` — branded proposal / estimate / meeting-doc generator.

Together these run a full engagement: `acrosstudio-engagement` takes the
`acrosstudio-intake` brief through the relevant `strat-*` analyses and into an
`acrosstudio-pptx` deliverable, following an intake → strategy → deliverable
flow.

## Install

### Claude Code

```
/plugin marketplace add Acrosstudio-ai/Acrosstudio_pptx_skills
/plugin install acrosstudio-skills@acrosstudio
```

### claude.ai

Download a `*.skill` bundle from the latest [Release](../../releases) and upload it in Skills.

### Agent SDK / Cursor / Codex / Gemini

Point the tool at this repo; skills are discovered under `skills/`.

## Develop

`npm run validate` · `npm test` · `npm run build` · `node scripts/bump-version.mjs <x.y.z>`
See `CLAUDE.md`.

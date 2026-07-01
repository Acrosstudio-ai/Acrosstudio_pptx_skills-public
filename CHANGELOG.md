# Changelog

## [0.4.1] - 2026-06-29

### Changed

- Replaced real client identifiers and engagement-specific details in the `acrosstudio-pptx` examples and reference docs with fictional sample data, so the suite contains no client-confidential information. This covers the proposal/estimate example scripts, the content/visual/document reference guides, and the sample cover image; no skill IDs, APIs, or rendering behavior changed.

## [0.4.0] - 2026-06-28

### Changed

- Localized the entire analytical layer to Japanese in natural Acrosstudio 文体 (not machine translation): `acrosstudio-intake`, the 13 `strat-*` strategy frameworks, and the `acrosstudio-engagement` orchestrator. Each skill's frontmatter description, body guidance, and output prose now read as native Japanese consulting language while preserving the shared `## Key takeaways` / `## Open questions` output contract.
- Re-pointed the skill-triggering harness to Japanese trigger vocabulary for the 15 localized skills, so Test B now verifies that each Japanese description contains its Japanese keywords verbatim.

### Added

- Shared Japanese strategy glossary (`docs/authoring/strategy-glossary-ja.md`) fixing consistent translations for the framework terms used across the analytical layer, keeping wording aligned with `acrosstudio-pptx` content patterns.

## [0.3.0] - 2026-06-28

### Added

- `acrosstudio-engagement` orchestrator skill that runs a consulting engagement end-to-end. It owns a file-based `engagement/` workspace and a band scheme that places each existing skill's output into a numbered artifact, then feeds those artifacts to `acrosstudio-pptx` for the deliverable.
- Workspace contract reference (`reference/workspace-contract.md`) documenting the band scheme, artifact rules, and a worked walkthrough.
- Trigger vocabulary registered for `acrosstudio-engagement` in the skill-triggering harness.

### Changed

- Completed the intake → strategy → deliverable pipeline: `acrosstudio-intake`, the 13 `strat-*` frameworks, `acrosstudio-engagement`, and `acrosstudio-pptx` now compose into one orchestrated flow without modifying any existing skill (each chains through the shared `## Key takeaways` / `## Open questions` output contract).
- Documented the engagement pipeline in `CLAUDE.md` and updated the `README.md` skills inventory.

## [0.2.0] - 2026-06-28

### Added

- `acrosstudio-intake` engagement-intake skill that gathers the brief (client, objective, scope, constraints, known/unknown figures) before strategy work begins.
- Thirteen `strat-*` strategy-framework skills, each emitting a standalone markdown analysis under a shared output contract:
  - `strat-situation-assessment` — structured current-state diagnosis.
  - `strat-growth-barriers` — ranked diagnosis of what is blocking growth.
  - `strat-assumption-audit` — register of fragile, load-bearing assumptions.
  - `strat-strategic-options` — distinct alternatives compared on explicit criteria.
  - `strat-business-case` — investment economics (ROI, payback, sensitivities).
  - `strat-pricing` — pricing-model selection and recommendation.
  - `strat-portfolio-review` — grow/hold/fix/exit resource-allocation view.
  - `strat-operating-model` — target operating model and capability gaps.
  - `strat-initiative-prioritizer` — defensible priority order by impact and effort.
  - `strat-transformation-roadmap` — phased roadmap with workstreams and milestones.
  - `strat-narrative` — executive story built on a single governing message.
  - `strat-decision-memo` — one-page memo leading with the recommendation.
  - `strat-stakeholder-alignment` — influence/interest map and engagement plan.
- Strategy-skill authoring template and output contract (`## Key takeaways` / `## Open questions`) so the skills chain cleanly.
- Trigger vocabulary registered for all 14 new skills in the skill-triggering harness.

## [0.1.0] - 2026-06-28

### Added

- Multi-platform plugin scaffold (Claude Code, Cursor, Codex, Gemini).
- Migrated `acrosstudio-pptx` from a zip blob to source files.
- Build, validate, and version-sync tooling; pre-commit + CI/release workflows.
- CI-safe skill-triggering tests asserting trigger vocabulary per skill description.
- `bump-version.mjs --audit` scan for undeclared files containing the version string.
- Prettier config, ignore, and pre-commit hook matching the repo code style.
- Validator warning when skill images are not marked binary in `.gitattributes`.
- Feature request issue template.

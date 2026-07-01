# Acrosstudio Skills Suite — Design Spec

- **Status:** Draft for review
- **Date:** 2026-06-28
- **Owner:** Acrosstudio (generative.ai@acrosstudio.co.jp)
- **Repo:** `Acrosstudio-ai/Acrosstudio_pptx_skills`

## TL;DR (한국어 요약)

기존 `acrosstudio-pptx.skill`(zip 1개)을 **GitHub로 버전관리되는 멀티스킬 스위트**로 전환한다. 단일 소스(`skills/`)에서 ① Claude Code 플러그인 ② claude.ai `.skill` zip ③ Agent SDK ④ Cursor/Codex/Gemini 매니페스트로 빌드한다. 컨설팅 워크플로우(발상→전략분석→산출물)를 스킬 합성으로 구현한다: `acrosstudio-intake`(발상) → `strat-*` 13개(전략) → `acrosstudio-pptx`(산출물), `acrosstudio-engagement`가 오케스트레이션. 구조·자동화·품질게이트는 obra/superpowers(240k★) 패턴을 모방한다. 외부 스킬은 라이선스 리스크 없이 **자체 작성**(framework concepts만 차용, CREDITS에 명시).

---

## 1. Background

Today the repo contains a single binary artifact: `acrosstudio-pptx.skill` (a 1.1 MB ZIP). A zip blob cannot be diffed, reviewed, or evolved in Git. Internally it is a well-built skill (`SKILL.md` + `assets/` + `examples/` + `reference/`) for generating Acrosstudio-branded proposals, estimates, and meeting documents.

Acrosstudio is a consulting + AI-development firm. The goal is to grow this into a **managed suite of Claude skills** that covers the firm's delivery pipeline:

```
discovery / framing  →  strategy analysis  →  deliverable (pptx / xlsx)
```

We model the repository after **obra/superpowers** (240k★, MIT) — the de-facto reference for a cutting-edge, multi-platform skills repository — and fold in the McKinsey-style frameworks curated from `aapersh/strategy-skills-for-claude` (re-authored, not copied).

## 2. Goals

1. **Git as source of truth** — every skill is a plain directory (`SKILL.md` + supporting files), diffable and reviewable. No committed zip blobs.
2. **One source → many targets** — build to Claude Code plugin, claude.ai `.skill` zip, Agent SDK directories, and Cursor/Codex/Gemini manifests.
3. **Composable consulting workflow** — skills chain through a file-based handoff so each stays independent and testable.
4. **Zero licensing risk** — only Acrosstudio-authored content is committed; framework *concepts* are credited, prose is original.
5. **Imitate proven structure** — adopt superpowers' layout, version-sync automation, quality gates, and governance.

## 3. Non-goals (YAGNI)

- The 8 strategy skills outside the 4 chosen categories (Market Intelligence, Risk/Governance) — addable later.
- Renaming the GitHub repository — keep `Acrosstudio_pptx_skills` for now to avoid breaking the remote; revisit once the suite stabilizes.
- MCP servers / LSP servers / custom monitors inside the plugin.
- Splitting into multiple plugins (a future option if the suite grows; see §11).
- A visual brainstorming companion server (superpowers ships one; out of scope here).

## 4. Reference pattern (superpowers analysis)

Key patterns we adopt, observed from `obra/superpowers`:

| Pattern | What superpowers does | We adopt |
| --- | --- | --- |
| Repo = plugin | Marketplace entry `source: "./"`; repo root is the plugin | Yes |
| `skills/` namespace | **Flat** — `skills/<name>/SKILL.md`, no group folders | Yes (flat, with name prefixes) |
| Multi-platform manifests | `.claude-plugin/`, `.cursor-plugin/`, `.codex-plugin/`, `gemini-extension.json`, `AGENTS.md→CLAUDE.md` | Yes (Claude/Cursor/Codex/Gemini) |
| Version sync | `.version-bump.json` + `scripts/bump-version.sh` (bump-all + drift detect + audit) | Yes |
| Quality gate | `.pre-commit-config.yaml` + local shell behavioral tests; **no GitHub Actions** | Hybrid: pre-commit + minimal Actions |
| Meta-skill | `writing-skills` (skill authoring = TDD) | Adopt the *method* for authoring our skills |
| Governance | `CLAUDE.md`/`AGENTS.md`, `CODE_OF_CONDUCT.md`, `RELEASE-NOTES.md`, `docs/plans/*-design.md`, `.gitattributes`, issue/PR templates | Yes |

## 5. Repository structure

```
Acrosstudio_pptx_skills/
├── .claude-plugin/
│   ├── plugin.json              # Claude Code plugin manifest
│   └── marketplace.json         # marketplace (source: "./")
├── .cursor-plugin/plugin.json   # Cursor manifest
├── .codex-plugin/plugin.json    # Codex manifest (+ interface metadata)
├── gemini-extension.json        # Gemini CLI extension (contextFileName: GEMINI.md)
├── AGENTS.md  ->  CLAUDE.md      # symlink (Codex/others read AGENTS.md)
├── CLAUDE.md                    # contributor + agent guide for this repo
├── GEMINI.md                   # Gemini context pointer
├── skills/                     # FLAT namespace — single source of truth
│   ├── acrosstudio-intake/        SKILL.md
│   ├── acrosstudio-engagement/    SKILL.md          # ★ glue / orchestrator
│   ├── acrosstudio-pptx/          SKILL.md + assets/ examples/ reference/
│   ├── strat-situation-assessment/   SKILL.md
│   ├── strat-growth-barriers/        SKILL.md
│   ├── strat-assumption-audit/       SKILL.md
│   ├── strat-strategic-options/      SKILL.md
│   ├── strat-business-case/          SKILL.md
│   ├── strat-pricing/                SKILL.md
│   ├── strat-portfolio-review/       SKILL.md
│   ├── strat-operating-model/        SKILL.md
│   ├── strat-initiative-prioritizer/ SKILL.md
│   ├── strat-transformation-roadmap/ SKILL.md
│   ├── strat-narrative/              SKILL.md
│   ├── strat-decision-memo/          SKILL.md
│   └── strat-stakeholder-alignment/  SKILL.md
├── scripts/
│   ├── build-skill-bundles.mjs   # skills/* -> dist/*.skill (claude.ai)
│   ├── validate-skills.mjs       # frontmatter + structure + hardcoded-path checks
│   └── bump-version.sh           # version sync across all manifests
├── tests/
│   ├── validate/                 # structural unit checks (Node)
│   └── skill-triggering/         # behavioral: does each skill trigger on its prompts?
├── docs/
│   └── plans/                    # dated design + implementation specs (this file)
├── .github/
│   ├── workflows/ci.yml          # validate + build dry-run on PR
│   ├── workflows/release.yml     # on tag: build, attach dist/*.skill to Release
│   ├── ISSUE_TEMPLATE/           # bug, feature, skill_request
│   └── PULL_REQUEST_TEMPLATE.md
├── .version-bump.json            # declares every file+field holding a version
├── .pre-commit-config.yaml       # local fast gate (validate, prettier, version drift)
├── .gitattributes                # LF for *.sh/*.md/*.json; binary for images
├── .gitignore                    # dist/, node_modules/, .DS_Store, work/
├── package.json                  # build tooling (type: module)
├── CHANGELOG.md
├── CREDITS.md                    # "frameworks inspired by aapersh/strategy-skills-for-claude"
├── LICENSE                       # Acrosstudio license (proposed: MIT)
└── README.md
```

**Discovery constraint (verified against the plugins reference):** Claude Code always scans the default `skills/` directory; each immediate subdirectory containing a `SKILL.md` becomes a skill whose invocation name is its frontmatter `name`. A flat layout therefore needs no `skills` field in `plugin.json`. **Path-traversal constraint:** an installed plugin cannot reference files outside its own directory, so brand assets live **inside** `skills/acrosstudio-pptx/assets/`. If multiple skills later need shared assets, use a marketplace-internal symlink (dereferenced on cache copy) rather than a repo-level `shared/`.

## 6. Skill inventory & naming

16 skills, flat namespace, two prefixes that encode the group:

- **`acrosstudio-*`** — branded products (intake, engagement, pptx).
- **`strat-*`** — generic strategy frameworks (the 13 curated, re-authored in English).

Each `SKILL.md` frontmatter carries `name`, a "Use when…" `description` (triggering conditions only, ≤500 chars), and `keywords` including `acrosstudio` and the group tag for searchability.

| # | Skill | Group | Purpose |
| --- | --- | --- | --- |
| 1 | `acrosstudio-intake` | process | Brainstorming-style 1-question-at-a-time engagement intake; produces `00-intake.md` |
| 2 | `acrosstudio-engagement` | process | Orchestrator: decides which stages run and in what order |
| 3 | `acrosstudio-pptx` | deliverable | Existing PPTX/XLSX generator (migrated) |
| 4 | `strat-situation-assessment` | diagnosis | Current-state diagnosis |
| 5 | `strat-growth-barriers` | diagnosis | What blocks growth |
| 6 | `strat-assumption-audit` | diagnosis | Stress-test assumptions |
| 7 | `strat-strategic-options` | choice | Generate/compare options |
| 8 | `strat-business-case` | choice | Business case + economics (pairs with `roi_excel.py`) |
| 9 | `strat-pricing` | choice | Pricing strategy |
| 10 | `strat-portfolio-review` | choice | Portfolio prioritization |
| 11 | `strat-operating-model` | execution | Operating model design |
| 12 | `strat-initiative-prioritizer` | execution | Rank initiatives |
| 13 | `strat-transformation-roadmap` | execution | Phased roadmap |
| 14 | `strat-narrative` | comms | Executive narrative |
| 15 | `strat-decision-memo` | comms | Decision memo |
| 16 | `strat-stakeholder-alignment` | comms | Stakeholder alignment |

## 7. Composition workflow (the "fusion")

`acrosstudio-engagement` is the glue skill. It does **not** reimplement the others; it sequences them and they communicate only through files in an **engagement workspace** (`engagement/`), keeping each skill independent (low coupling, file = interface).

```
request
 ├─ acrosstudio-intake            → engagement/00-intake.md
 ├─ strat-situation-assessment    → engagement/10-diagnosis.md
 ├─ strat-strategic-options       → engagement/20-options.md
 ├─ strat-business-case           → engagement/30-business-case.md   (+ roi.xlsx)
 ├─ strat-transformation-roadmap  → engagement/40-roadmap.md
 ├─ strat-narrative               → engagement/50-narrative.md
 └─ acrosstudio-pptx              → reads 00–50 → proposal.pptx
```

Rules:
- Each stage **reads prior `NN-*.md` files** and **writes its own** numbered artifact. No stage imports another skill's internals.
- The orchestrator decides scope: full proposal vs. a single analysis. **Skipping stages is valid** — `acrosstudio-pptx` consumes whatever artifacts exist.
- Artifact files are Markdown with a small, documented heading contract (so the next stage can parse them reliably). The contract is defined once in `acrosstudio-engagement/SKILL.md`.

## 8. Multi-platform distribution

Single source (`skills/`) → platform targets:

| Target | Mechanism |
| --- | --- |
| Claude Code | Repo is the plugin; team adds the marketplace, runs `/plugin install`. |
| claude.ai | `scripts/build-skill-bundles.mjs` zips each skill dir → `dist/<name>.skill` (internal `<name>/…` structure) for upload. |
| Agent SDK | Point the SDK at `skills/<name>/` directories directly. |
| Cursor | `.cursor-plugin/plugin.json` referencing `./skills/`. |
| Codex | `.codex-plugin/plugin.json` (+ `interface` metadata) and `AGENTS.md`. |
| Gemini CLI | `gemini-extension.json` + `GEMINI.md`. |

All manifests share `name`, `description`, `version`, `author`, `license`, `keywords`; per-platform fields differ (Codex `interface`, Gemini `contextFileName`).

## 9. Build & version automation

- **`scripts/build-skill-bundles.mjs`** (Node, `type: module`): for each `skills/<name>/`, produce `dist/<name>.skill` (zip with top-level `<name>/`). Deterministic; skips nothing silently; logs the manifest.
- **`scripts/validate-skills.mjs`**: assert each skill has `SKILL.md` with required frontmatter (`name`, `description`), `name` matches directory, no forbidden hardcoded paths (e.g., `/mnt/skills/user/...`), images marked binary, descriptions ≤ limit.
- **`.version-bump.json` + `scripts/bump-version.sh`** (ported from superpowers): one command bumps the version in `package.json`, all four platform manifests, and `marketplace.json` `plugins.0.version`; `--check` detects drift; `--audit` greps the repo for stray version strings. Version policy: explicit semver in manifests (bump on release).

## 10. Quality gates

Hybrid, per decision:

- **pre-commit** (`.pre-commit-config.yaml`): fast local gate — `validate-skills.mjs`, Prettier on JS/TS/JSON/MD, `bump-version.sh --check` (drift), trailing-whitespace/EOF.
- **GitHub Actions** (minimal):
  - `ci.yml` — on PR: install, `validate-skills.mjs`, `build-skill-bundles.mjs` dry-run, run `tests/`.
  - `release.yml` — on tag `v*`: build `dist/*.skill`, create a GitHub Release, attach bundles.
- **Skill behavioral tests** (`tests/skill-triggering/`, superpowers-style): assert each skill's `description` triggers on representative prompts and not on unrelated ones. Authored using the `writing-skills` TDD method (baseline-fail → write → pass).

## 11. Migration of `acrosstudio-pptx`

1. Unzip `acrosstudio-pptx.skill` into `skills/acrosstudio-pptx/` (SKILL.md + assets/ + examples/ + reference/), commit as plain files; delete the committed `.skill` blob (it becomes a build output).
2. **Fix the hardcoded path:** SKILL.md STEP 0a copies assets from `/mnt/skills/user/acrosstudio-proposal3/assets/*`. Change to copy from the skill's own bundled `assets/` (relative to the skill root), removing the dependency on a specific uploaded skill name.
3. Re-validate the example build still produces a correct PPTX after the path change (visual check per the skill's STEP 4).

## 12. Licensing & attribution

- `aapersh/strategy-skills-for-claude` has **no license** (all rights reserved). We therefore **do not copy** its text. Acrosstudio authors original `SKILL.md` content for the 13 frameworks; the underlying methodologies are not copyrightable.
- `CREDITS.md` records: "Strategy framework concepts are inspired by aapersh/strategy-skills-for-claude (no license); all prose in this repository is original to Acrosstudio."
- `acrosstudio-intake` is authored from scratch for consulting intake (inspired by superpowers' brainstorming dialogue), so the suite is self-contained and does not depend on or copy superpowers.
- Suite `LICENSE`: proposed **MIT** (matches the ecosystem). Confirm during implementation.

## 13. Governance & docs

- `CLAUDE.md` (+ `AGENTS.md` symlink): how to add/edit a skill, naming convention, the engagement artifact contract, build/version commands.
- `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `README.md` (suite overview + install per platform), `.github/ISSUE_TEMPLATE/{bug,feature,skill_request}.md`, `PULL_REQUEST_TEMPLATE.md`.
- Specs live in `docs/plans/YYYY-MM-DD-<topic>-{design,implementation}.md`.

## 14. Skill authoring standard

All new `SKILL.md` files follow the `writing-skills` discipline: `description` states **only when to use** (not what it does), starts with "Use when…", and each skill is validated against trigger scenarios before merge. Branded skills use Acrosstudio voice/brand rules already encoded in `acrosstudio-pptx/reference/`.

## 15. Open questions / future

- Confirm suite `LICENSE` = MIT.
- Whether `strat-*` skills should later gain Japanese localizations (out of scope now; English first).
- When the suite grows, consider splitting into `acrosstudio-strategy` / `acrosstudio-deliverables` / `acrosstudio-process` plugins under one marketplace (the earlier "C" option).

## 16. Implementation phases (high level)

Detailed steps come from the `writing-plans` skill. Rough order:

1. **Scaffold** — repo skeleton, manifests, package.json, `.gitattributes`, `.gitignore`, governance files.
2. **Migrate pptx** — unzip into `skills/acrosstudio-pptx/`, fix paths, drop the blob.
3. **Build & version tooling** — `build-skill-bundles.mjs`, `validate-skills.mjs`, `.version-bump.json`, `bump-version.sh`.
4. **Quality gates** — pre-commit, `ci.yml`, `release.yml`, `tests/`.
5. **Author skills** — `acrosstudio-intake`, then `strat-*` (13), then `acrosstudio-engagement` glue + artifact contract.
6. **Docs & release** — README install matrix, CREDITS, CHANGELOG; tag `v0.1.0`, verify Release artifacts.

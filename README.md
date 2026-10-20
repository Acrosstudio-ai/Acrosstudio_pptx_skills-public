# Acrosstudio Skills Suite

Acrosstudio's Claude skills for consulting delivery: engagement intake,
McKinsey-style strategy frameworks, and branded Google Slides / PPTX / XLSX deliverables.
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
- `acrosstudio-google-slides` — creates Google Slides using this repository's
  Acrosstudio design rules, layouts, logos, and backgrounds, edits existing decks,
  delivers an editable link, and optionally exports PPTX. No separate template required.

Together these run a full engagement: `acrosstudio-engagement` takes the
`acrosstudio-intake` brief through the relevant `strat-*` analyses and into the
requested Google Slides or PPTX deliverable, following an intake → strategy →
deliverable flow. If the format is unspecified, it asks rather than choosing silently.

## Install

### Claude Code

```
/plugin marketplace add Acrosstudio-ai/Acrosstudio_pptx_skills-public
/plugin install acrosstudio-skills@acrosstudio
```

### claude.ai (web app)

Skills run on the web app for Free, Pro, Max, Team, and Enterprise plans.

1. **Enable code execution** — Free/Pro/Max: `Settings > Capabilities` → turn on
   _Code execution and file creation_. Team/Enterprise: an org owner enables
   _Code execution and file creation_ and _Skills_ under `Organization settings > Skills`.
2. **Get a skill bundle** — download a `*.skill` (a ZIP of the skill folder) from
   the latest [Release](../../releases), or run `npm run build` to produce
   `dist/*.skill` locally. The ZIP must contain the skill folder at its root
   (not a bare `SKILL.md`), and each skill's `name` must be lowercase letters,
   numbers, and hyphens only.
3. **Upload** — `Customize > Skills` → `+` → `+ Create skill` → _Upload a skill_,
   then select the bundle. Toggle it on when you want it active.

Uploaded skills are private to your account; org-wide sharing needs a Team/Enterprise plan.

### Agent SDK / Cursor / Codex / Gemini

Point the tool at this repo; skills are discovered under `skills/`.

### QM (org-wide)

An org admin can register this repository in **Admin → Skill packs**, pin the
reviewed commit SHA, then **Browse → org-wide → Import selected**. Import
`acrosstudio-google-slides`, plus intake, strategy, and engagement skills as needed.
Org installation does not grant Google access: each user still needs an authorized
Google connection and access to the target deck and destination folder.

The Slides skill is text-only and bundles its QM API reference. It uses QM's
existing `google-drive-sheets` connector skill rather than adding another OAuth
integration. The design source remains `skills/acrosstudio-pptx/` in this
repository: its rules, examples, logos, and background are reused for native Slides
output. The bundled `reference/design-source.md` retrieves a pinned source version,
including assets omitted by QM's text-only importer. No separate Google Slides
template is required, and no independent copy of the brand rules is maintained.
Writes and sharing changes require approval; completed decks require visual review
against the repository's design, not just a successful API call.

The original `acrosstudio-pptx` remains available on the other platforms. QM's
text-only pack importer excludes it because it contains PNG/JPG assets; importing
the pack does not make that original generator QM-compatible. A request requiring
that generator must use a supported environment. For a Google Slides deck that
also needs PPTX, use the Slides skill's export path and check conversion fidelity.

## Develop

`npm run validate` · `npm test` · `npm run build` · `node scripts/bump-version.mjs <x.y.z>`
See `CLAUDE.md`.

## Contributing / ローカルセットアップ

### 前提条件

- **Node.js 22 以上**（validate / build / test / prettier フックはすべて Node で動作します）
- **Python + `pre-commit`**（git フック用）
- **`npm install` は不要** — 依存パッケージ（dependencies / devDependencies）はなく、スクリプトは Node の標準モジュールのみを使用します

### 手順

```
# 事前に Node 22+ と Python(+pip) を用意
pip install pre-commit      # pipx / brew でも可
pre-commit install          # git フックを .git/hooks に接続（クローンごとに毎回必要）
pre-commit run --all-files  # （任意）初回実行でフック環境を取得し、全体を検査
```

`pre-commit install` はクローンごとに一度実行してください。git フックは `.git/hooks/`
に置かれ、クローンには含まれないためです。

### 補足

- **初回コミット（または `pre-commit run`）時はネットワークが必要**です。`prettier@3`
  は `npx` が npm レジストリから取得し、`pre-commit-hooks` や `gitleaks` は pre-commit
  が隔離環境にインストールします。
- **gitleaks フック**は環境によってビルドに **Go ツールチェーン**が必要な場合があります。
  インストールに失敗する場合はここが原因になりやすい箇所です。

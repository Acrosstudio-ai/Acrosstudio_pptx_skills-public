# Plan 1 — Repository Infrastructure & pptx Migration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single `acrosstudio-pptx.skill` zip blob into a Git-managed, multi-platform plugin repo (modeled on obra/superpowers) that builds the migrated pptx skill to Claude Code, claude.ai `.skill`, Agent SDK, Cursor, Codex, and Gemini.

**Architecture:** Repo root *is* the plugin (marketplace `source: "./"`). A flat `skills/` directory is the single source of truth. Node scripts validate skills, build `.skill` bundles, and keep the version synced across all platform manifests. Quality is gated by pre-commit + minimal GitHub Actions. This plan delivers a working single-skill suite (just `acrosstudio-pptx`); Plans 2–3 add the strategy skills and the engagement orchestrator.

**Tech Stack:** Node.js ≥ 22 (ESM, built-in `node:test`), system `zip`/`unzip`, pre-commit, GitHub Actions, Markdown skills.

**Spec:** `docs/plans/2026-06-28-acrosstudio-skills-suite-design.md`

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `package.json` | Tooling manifest (ESM, scripts, version source-of-truth) |
| `.gitignore`, `.gitattributes` | Ignore build output; force LF, mark binaries |
| `scripts/lib/skills.mjs` | Shared: enumerate skills, parse frontmatter |
| `scripts/lib/jsonpath.mjs` | Shared: get/set dotted JSON paths (incl. array index) |
| `scripts/validate-skills.mjs` | Structural validation of every skill |
| `scripts/build-skill-bundles.mjs` | `skills/<name>/` → `dist/<name>.skill` |
| `scripts/bump-version.mjs` | Sync version across manifests; `--check` / `--audit` |
| `tests/**/*.test.mjs` | Node unit tests for the scripts |
| `.claude-plugin/plugin.json`, `marketplace.json` | Claude Code |
| `.cursor-plugin/plugin.json` | Cursor |
| `.codex-plugin/plugin.json` | Codex (+ `interface`) |
| `gemini-extension.json`, `GEMINI.md` | Gemini CLI |
| `CLAUDE.md`, `AGENTS.md`→`CLAUDE.md` | Contributor + agent guide |
| `skills/acrosstudio-pptx/**` | Migrated pptx skill (plain files) |
| `.version-bump.json` | Declares every version-bearing file+field |
| `.pre-commit-config.yaml` | Fast local gate |
| `.github/workflows/{ci,release}.yml` | CI + release |
| `.github/ISSUE_TEMPLATE/*`, `PULL_REQUEST_TEMPLATE.md` | Community hygiene |
| `README.md`, `CREDITS.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md` | Governance |

Naming: this plan ships only `acrosstudio-pptx`. Plan 2 adds `strat-*` and `acrosstudio-intake`; Plan 3 adds `acrosstudio-engagement`.

---

## Task 1: Repo tooling scaffold

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.gitattributes`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "acrosstudio-skills-suite",
  "version": "0.1.0",
  "description": "Acrosstudio Claude skills suite — proposals, strategy frameworks, and engagement orchestration",
  "type": "module",
  "private": true,
  "engines": { "node": ">=22" },
  "scripts": {
    "validate": "node scripts/validate-skills.mjs",
    "build": "node scripts/build-skill-bundles.mjs",
    "version:check": "node scripts/bump-version.mjs --check",
    "version:audit": "node scripts/bump-version.mjs --audit",
    "test": "node --test 'tests/**/*.test.mjs'"
  },
  "license": "MIT"
}
```

- [ ] **Step 2: Create `.gitignore`**

```gitignore
dist/
node_modules/
work/
.DS_Store
*.skill
```

> Note: `*.skill` ignores build output AND the legacy blob once removed (Task 4). The migrated source lives as plain files under `skills/`, which is never matched by `*.skill`.

- [ ] **Step 3: Create `.gitattributes`**

```gitattributes
*.sh   text eol=lf
*.mjs  text eol=lf
*.js   text eol=lf
*.cjs  text eol=lf
*.json text eol=lf
*.md   text eol=lf
*.yml  text eol=lf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
```

- [ ] **Step 4: Commit**

```bash
git add package.json .gitignore .gitattributes
git commit -m "chore: add repo tooling scaffold"
```

---

## Task 2: Shared script libraries (TDD)

**Files:**
- Create: `scripts/lib/jsonpath.mjs`
- Create: `scripts/lib/skills.mjs`
- Test: `tests/lib/jsonpath.test.mjs`
- Test: `tests/lib/skills.test.mjs`

- [ ] **Step 1: Write the failing test for jsonpath**

`tests/lib/jsonpath.test.mjs`:

```javascript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getPath, setPath } from '../../scripts/lib/jsonpath.mjs'

test('getPath reads nested and array-index paths', () => {
  const obj = { version: '1.0.0', plugins: [{ version: '2.0.0' }] }
  assert.equal(getPath(obj, 'version'), '1.0.0')
  assert.equal(getPath(obj, 'plugins.0.version'), '2.0.0')
})

test('setPath writes immutably and returns a new object', () => {
  const obj = { plugins: [{ version: '1.0.0' }] }
  const next = setPath(obj, 'plugins.0.version', '9.9.9')
  assert.equal(getPath(next, 'plugins.0.version'), '9.9.9')
  assert.equal(getPath(obj, 'plugins.0.version'), '1.0.0') // original untouched
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/lib/jsonpath.test.mjs`
Expected: FAIL — `Cannot find module '.../scripts/lib/jsonpath.mjs'`

- [ ] **Step 3: Implement `scripts/lib/jsonpath.mjs`**

```javascript
// Get/set dotted paths like "plugins.0.version" on plain JSON objects.
// Immutable: setPath returns a new object, never mutates the input.

const segments = (path) => path.split('.')

export function getPath(obj, path) {
  return segments(path).reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

export function setPath(obj, path, value) {
  const [head, ...rest] = segments(path)
  const clone = Array.isArray(obj) ? [...obj] : { ...obj }
  if (rest.length === 0) {
    clone[head] = value
  } else {
    clone[head] = setPath(obj?.[head] ?? {}, rest.join('.'), value)
  }
  return clone
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/lib/jsonpath.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 5: Write the failing test for skills enumeration**

`tests/lib/skills.test.mjs`:

```javascript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { listSkillDirs, parseFrontmatter } from '../../scripts/lib/skills.mjs'

function fixtureSkillsDir() {
  const root = mkdtempSync(join(tmpdir(), 'skills-'))
  const skill = join(root, 'demo-skill')
  mkdirSync(skill, { recursive: true })
  writeFileSync(
    join(skill, 'SKILL.md'),
    '---\nname: demo-skill\ndescription: Use when demoing\n---\n# Demo\n'
  )
  mkdirSync(join(root, 'not-a-skill'), { recursive: true }) // no SKILL.md
  return root
}

test('listSkillDirs returns only dirs containing SKILL.md', () => {
  const root = fixtureSkillsDir()
  const skills = listSkillDirs(root)
  assert.equal(skills.length, 1)
  assert.equal(skills[0].name, 'demo-skill')
})

test('parseFrontmatter reads name and description', () => {
  const fm = parseFrontmatter('---\nname: x\ndescription: Use when y\n---\nbody')
  assert.equal(fm.name, 'x')
  assert.equal(fm.description, 'Use when y')
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `node --test tests/lib/skills.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `scripts/lib/skills.mjs`**

```javascript
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Return [{ name, dir, skillMdPath }] for each immediate subdirectory
// of skillsDir that contains a SKILL.md.
export function listSkillDirs(skillsDir) {
  if (!existsSync(skillsDir)) return []
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      dir: join(skillsDir, entry.name),
      skillMdPath: join(skillsDir, entry.name, 'SKILL.md'),
    }))
    .filter((skill) => existsSync(skill.skillMdPath))
}

// Minimal YAML frontmatter parser for simple `key: value` lines.
// Skills use only flat string fields, so this is sufficient.
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fields = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (kv) fields[kv[1]] = kv[2].trim()
  }
  return fields
}

export function readFrontmatter(skillMdPath) {
  return parseFrontmatter(readFileSync(skillMdPath, 'utf8'))
}
```

- [ ] **Step 8: Run both lib tests to verify they pass**

Run: `node --test 'tests/lib/**/*.test.mjs'`
Expected: PASS (4 tests)

> Note: pass a quoted glob, not a bare directory. On Node 22, `node --test <dir>` treats the path as a module entry point and fails; a quoted glob lets Node's test runner expand and discover the files. The same glob form is used in the `test` npm script and in CI.

- [ ] **Step 9: Commit**

```bash
git add scripts/lib tests/lib
git commit -m "feat: add shared jsonpath and skills libraries"
```

---

## Task 3: Skill validator (TDD)

**Files:**
- Create: `scripts/validate-skills.mjs`
- Test: `tests/validate/validate-skills.test.mjs`

- [ ] **Step 1: Write the failing test**

`tests/validate/validate-skills.test.mjs`:

```javascript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { validateSkills } from '../../scripts/validate-skills.mjs'

function writeSkill(root, name, skillMd) {
  const dir = join(root, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'SKILL.md'), skillMd)
}

test('passes a well-formed skill', () => {
  const root = mkdtempSync(join(tmpdir(), 'v-'))
  writeSkill(root, 'good', '---\nname: good\ndescription: Use when good\n---\n')
  assert.deepEqual(validateSkills(root).errors, [])
})

test('flags missing description', () => {
  const root = mkdtempSync(join(tmpdir(), 'v-'))
  writeSkill(root, 'nodesc', '---\nname: nodesc\n---\n')
  const { errors } = validateSkills(root)
  assert.ok(errors.some((e) => e.includes('description')))
})

test('flags name/dir mismatch', () => {
  const root = mkdtempSync(join(tmpdir(), 'v-'))
  writeSkill(root, 'dirname', '---\nname: other\ndescription: Use when x\n---\n')
  const { errors } = validateSkills(root)
  assert.ok(errors.some((e) => e.includes('does not match directory')))
})

test('flags forbidden hardcoded path', () => {
  const root = mkdtempSync(join(tmpdir(), 'v-'))
  writeSkill(
    root,
    'legacy',
    '---\nname: legacy\ndescription: Use when x\n---\ncp /mnt/skills/user/acrosstudio-proposal3/assets/* .\n'
  )
  const { errors } = validateSkills(root)
  assert.ok(errors.some((e) => e.includes('acrosstudio-proposal3')))
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/validate/validate-skills.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `scripts/validate-skills.mjs`**

```javascript
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { listSkillDirs, parseFrontmatter } from './lib/skills.mjs'

const FORBIDDEN_PATHS = ['acrosstudio-proposal3']
const MAX_DESCRIPTION = 1024

export function validateSkills(skillsDir) {
  const errors = []
  const warnings = []
  const skills = listSkillDirs(skillsDir)

  if (skills.length === 0) {
    errors.push(`No skills found under ${skillsDir}`)
  }

  for (const skill of skills) {
    const content = readFileSync(skill.skillMdPath, 'utf8')
    const fm = parseFrontmatter(content)

    if (!fm.name) errors.push(`${skill.name}: SKILL.md missing frontmatter 'name'`)
    if (!fm.description) errors.push(`${skill.name}: SKILL.md missing frontmatter 'description'`)
    if (fm.name && fm.name !== skill.name) {
      errors.push(`${skill.name}: frontmatter name '${fm.name}' does not match directory`)
    }
    if (fm.description && fm.description.length > MAX_DESCRIPTION) {
      errors.push(`${skill.name}: description exceeds ${MAX_DESCRIPTION} chars`)
    }
    if (fm.description && fm.description.length > 500) {
      warnings.push(`${skill.name}: description over 500 chars (prefer shorter)`)
    }
    for (const forbidden of FORBIDDEN_PATHS) {
      if (content.includes(forbidden)) {
        errors.push(`${skill.name}: SKILL.md references forbidden path '${forbidden}'`)
      }
    }
  }

  return { errors, warnings, count: skills.length }
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const here = dirname(fileURLToPath(import.meta.url))
  const skillsDir = join(here, '..', 'skills')
  const { errors, warnings, count } = validateSkills(skillsDir)
  for (const w of warnings) console.warn(`⚠️  ${w}`)
  for (const e of errors) console.error(`❌ ${e}`)
  console.log(`Validated ${count} skill(s); ${errors.length} error(s), ${warnings.length} warning(s).`)
  process.exit(errors.length > 0 ? 1 : 0)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/validate/validate-skills.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-skills.mjs tests/validate
git commit -m "feat: add skill validator"
```

---

## Task 4: Migrate the pptx skill

**Files:**
- Create: `skills/acrosstudio-pptx/**` (unzipped from the blob)
- Modify: `skills/acrosstudio-pptx/SKILL.md` (line 31 path fix)
- Delete: `acrosstudio-pptx.skill`

- [ ] **Step 1: Unzip the blob into the flat skills namespace**

Run:
```bash
mkdir -p skills
unzip -q acrosstudio-pptx.skill -d skills
ls skills/acrosstudio-pptx
```
Expected: `SKILL.md  README.md  assets  examples  reference`

- [ ] **Step 2: Fix the hardcoded asset path in SKILL.md**

In `skills/acrosstudio-pptx/SKILL.md`, replace the asset-copy line:

Before:
```bash
mkdir -p work/assets && cp /mnt/skills/user/acrosstudio-proposal3/assets/* work/assets/
```
After:
```bash
mkdir -p work/assets && cp /mnt/skills/user/acrosstudio-pptx/assets/* work/assets/
```

> Rationale: when uploaded to claude.ai, the skill unzips to `/mnt/skills/user/<skill-name>/`. The source path must match the skill's own name (`acrosstudio-pptx`), not the old upload name (`acrosstudio-proposal3`). Leave line 61's `/mnt/skills/public/pptx/scripts/office/soffice.py` unchanged — it is a shared claude.ai tool path.

- [ ] **Step 3: Verify no stale references remain**

Run: `grep -rn "acrosstudio-proposal3" skills/ || echo "clean"`
Expected: `clean`

- [ ] **Step 4: Run the validator against the real skill**

Run: `node scripts/validate-skills.mjs`
Expected: `Validated 1 skill(s); 0 error(s)` (warnings about description length are acceptable)

- [ ] **Step 5: Remove the legacy blob and commit**

The blob is **untracked** (it was never committed) and is now ignored by `.gitignore` (`*.skill`), so remove it from the working tree with a plain `rm` (not `git rm`, which only operates on tracked files):

```bash
rm -f acrosstudio-pptx.skill
git add skills/acrosstudio-pptx
git commit -m "refactor: migrate acrosstudio-pptx from zip blob to source files"
```

> Future `.skill` files live only in `dist/` (gitignored); the source of truth is `skills/acrosstudio-pptx/`.

---

## Task 5: Skill bundle builder (TDD)

**Files:**
- Create: `scripts/build-skill-bundles.mjs`
- Test: `tests/build/build-skill-bundles.test.mjs`

- [ ] **Step 1: Write the failing test**

`tests/build/build-skill-bundles.test.mjs`:

```javascript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildBundles } from '../../scripts/build-skill-bundles.mjs'

test('builds a .skill per skill with the skill name as archive root', () => {
  const root = mkdtempSync(join(tmpdir(), 'b-'))
  const skillsDir = join(root, 'skills')
  const distDir = join(root, 'dist')
  const skill = join(skillsDir, 'sample')
  mkdirSync(skill, { recursive: true })
  writeFileSync(join(skill, 'SKILL.md'), '---\nname: sample\ndescription: Use when sampling\n---\n')

  const built = buildBundles(skillsDir, distDir)
  assert.equal(built.length, 1)
  const bundle = join(distDir, 'sample.skill')
  assert.ok(existsSync(bundle))

  const listing = execFileSync('unzip', ['-l', bundle], { encoding: 'utf8' })
  assert.ok(listing.includes('sample/SKILL.md'))
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/build/build-skill-bundles.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `scripts/build-skill-bundles.mjs`**

```javascript
import { mkdirSync, rmSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { listSkillDirs } from './lib/skills.mjs'

// Build dist/<name>.skill for each skill. The archive root is the skill
// directory name, so it unzips to "<name>/SKILL.md" — the format claude.ai
// expects for uploaded skills.
export function buildBundles(skillsDir, distDir) {
  mkdirSync(distDir, { recursive: true })
  const built = []
  for (const skill of listSkillDirs(skillsDir)) {
    const bundlePath = resolve(distDir, `${skill.name}.skill`)
    if (existsSync(bundlePath)) rmSync(bundlePath) // clean rebuild; zip appends otherwise
    // Run from skillsDir so entries are "<name>/..."; -X strips extra metadata.
    execFileSync('zip', ['-r', '-X', '-q', bundlePath, skill.name], { cwd: skillsDir })
    built.push({ name: skill.name, bundlePath })
  }
  return built
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const here = dirname(fileURLToPath(import.meta.url))
  const skillsDir = join(here, '..', 'skills')
  const distDir = join(here, '..', 'dist')
  const built = buildBundles(skillsDir, distDir)
  for (const b of built) console.log(`📦 ${b.name} → ${b.bundlePath}`)
  console.log(`Built ${built.length} bundle(s).`)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/build/build-skill-bundles.test.mjs`
Expected: PASS (1 test)

- [ ] **Step 5: Build the real pptx bundle and verify**

Run:
```bash
node scripts/build-skill-bundles.mjs
unzip -l dist/acrosstudio-pptx.skill | grep SKILL.md
```
Expected: a line containing `acrosstudio-pptx/SKILL.md`

- [ ] **Step 6: Commit**

```bash
git add scripts/build-skill-bundles.mjs tests/build
git commit -m "feat: add .skill bundle builder"
```

---

## Task 6: Platform manifests

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `.claude-plugin/marketplace.json`
- Create: `.cursor-plugin/plugin.json`
- Create: `.codex-plugin/plugin.json`
- Create: `gemini-extension.json`
- Create: `GEMINI.md`
- Create: `CLAUDE.md`
- Create: `AGENTS.md` (symlink → `CLAUDE.md`)

- [ ] **Step 1: Create `.claude-plugin/plugin.json`**

```json
{
  "name": "acrosstudio-skills",
  "displayName": "Acrosstudio Skills Suite",
  "version": "0.1.0",
  "description": "Acrosstudio proposals, strategy frameworks, and engagement orchestration",
  "author": { "name": "Acrosstudio", "email": "generative.ai@acrosstudio.co.jp" },
  "homepage": "https://github.com/Acrosstudio-ai/Acrosstudio_pptx_skills",
  "repository": "https://github.com/Acrosstudio-ai/Acrosstudio_pptx_skills",
  "license": "MIT",
  "keywords": ["skills", "acrosstudio", "pptx", "strategy", "consulting", "proposal"]
}
```

> No `skills` field needed: the default `skills/` directory is always scanned and the flat layout is auto-discovered.

- [ ] **Step 2: Create `.claude-plugin/marketplace.json`**

```json
{
  "name": "acrosstudio",
  "description": "Acrosstudio Claude skills marketplace",
  "owner": { "name": "Acrosstudio", "email": "generative.ai@acrosstudio.co.jp" },
  "plugins": [
    {
      "name": "acrosstudio-skills",
      "description": "Acrosstudio proposals, strategy frameworks, and engagement orchestration",
      "version": "0.1.0",
      "source": "./",
      "author": { "name": "Acrosstudio", "email": "generative.ai@acrosstudio.co.jp" }
    }
  ]
}
```

- [ ] **Step 3: Create `.cursor-plugin/plugin.json`**

```json
{
  "name": "acrosstudio-skills",
  "displayName": "Acrosstudio Skills Suite",
  "version": "0.1.0",
  "description": "Acrosstudio proposals, strategy frameworks, and engagement orchestration",
  "author": { "name": "Acrosstudio", "email": "generative.ai@acrosstudio.co.jp" },
  "homepage": "https://github.com/Acrosstudio-ai/Acrosstudio_pptx_skills",
  "repository": "https://github.com/Acrosstudio-ai/Acrosstudio_pptx_skills",
  "license": "MIT",
  "keywords": ["skills", "acrosstudio", "pptx", "strategy", "consulting"],
  "skills": "./skills/"
}
```

- [ ] **Step 4: Create `.codex-plugin/plugin.json`**

```json
{
  "name": "acrosstudio-skills",
  "version": "0.1.0",
  "description": "Acrosstudio proposals, strategy frameworks, and engagement orchestration",
  "author": { "name": "Acrosstudio", "email": "generative.ai@acrosstudio.co.jp", "url": "https://github.com/Acrosstudio-ai" },
  "homepage": "https://github.com/Acrosstudio-ai/Acrosstudio_pptx_skills",
  "repository": "https://github.com/Acrosstudio-ai/Acrosstudio_pptx_skills",
  "license": "MIT",
  "keywords": ["skills", "acrosstudio", "pptx", "strategy", "consulting"],
  "skills": "./skills/",
  "interface": {
    "displayName": "Acrosstudio Skills Suite",
    "shortDescription": "Proposals, strategy frameworks, and engagement orchestration",
    "longDescription": "Acrosstudio's consulting delivery skills: intake, McKinsey-style strategy frameworks, and branded PPTX/XLSX deliverables.",
    "developerName": "Acrosstudio",
    "category": "Productivity",
    "capabilities": ["Interactive", "Read", "Write"],
    "websiteURL": "https://github.com/Acrosstudio-ai/Acrosstudio_pptx_skills"
  }
}
```

- [ ] **Step 5: Create `gemini-extension.json`**

```json
{
  "name": "acrosstudio-skills",
  "description": "Acrosstudio proposals, strategy frameworks, and engagement orchestration",
  "version": "0.1.0",
  "contextFileName": "GEMINI.md"
}
```

- [ ] **Step 6: Create `GEMINI.md`**

```markdown
# Acrosstudio Skills Suite

This repository provides Acrosstudio's Claude skills as a Gemini CLI extension.
Skills live under `skills/`. See `CLAUDE.md` for the contributor and agent guide.
```

- [ ] **Step 7: Create `CLAUDE.md`**

```markdown
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

## Build & release
- `npm run validate` — structural checks
- `npm run build` — produces `dist/*.skill` for claude.ai upload
- `npm test` — Node unit tests
- `node scripts/bump-version.mjs <x.y.z>` — sync version across all manifests
- `npm run version:check` — detect version drift

## Specs
Design and implementation specs live in `docs/plans/`.
```

- [ ] **Step 8: Create the `AGENTS.md` symlink**

Run: `ln -s CLAUDE.md AGENTS.md`
Verify: `readlink AGENTS.md` → `CLAUDE.md`

- [ ] **Step 9: Validate all manifests are well-formed JSON**

Run:
```bash
for f in .claude-plugin/plugin.json .claude-plugin/marketplace.json .cursor-plugin/plugin.json .codex-plugin/plugin.json gemini-extension.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8')); console.log('ok $f')"; done
```
Expected: `ok` for each file.

- [ ] **Step 10: Commit**

```bash
git add .claude-plugin .cursor-plugin .codex-plugin gemini-extension.json GEMINI.md CLAUDE.md AGENTS.md
git commit -m "feat: add multi-platform plugin manifests and agent guide"
```

---

## Task 7: Version sync tooling (TDD)

**Files:**
- Create: `.version-bump.json`
- Create: `scripts/bump-version.mjs`
- Test: `tests/version/bump-version.test.mjs`

- [ ] **Step 1: Create `.version-bump.json`**

```json
{
  "files": [
    { "path": "package.json", "field": "version" },
    { "path": ".claude-plugin/plugin.json", "field": "version" },
    { "path": ".claude-plugin/marketplace.json", "field": "plugins.0.version" },
    { "path": ".cursor-plugin/plugin.json", "field": "version" },
    { "path": ".codex-plugin/plugin.json", "field": "version" },
    { "path": "gemini-extension.json", "field": "version" }
  ]
}
```

- [ ] **Step 2: Write the failing test**

`tests/version/bump-version.test.mjs`:

```javascript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkVersions, bumpVersions } from '../../scripts/bump-version.mjs'

function fixtureRepo() {
  const root = mkdtempSync(join(tmpdir(), 'ver-'))
  writeFileSync(join(root, 'package.json'), JSON.stringify({ version: '0.1.0' }, null, 2))
  mkdirSync(join(root, '.claude-plugin'), { recursive: true })
  writeFileSync(
    join(root, '.claude-plugin', 'marketplace.json'),
    JSON.stringify({ plugins: [{ version: '0.1.0' }] }, null, 2)
  )
  writeFileSync(
    join(root, '.version-bump.json'),
    JSON.stringify(
      { files: [
        { path: 'package.json', field: 'version' },
        { path: '.claude-plugin/marketplace.json', field: 'plugins.0.version' },
      ] },
      null,
      2
    )
  )
  return root
}

test('checkVersions reports in-sync versions with no drift', () => {
  const root = fixtureRepo()
  const result = checkVersions(root)
  assert.equal(result.drift, false)
  assert.deepEqual([...new Set(result.versions.map((v) => v.version))], ['0.1.0'])
})

test('bumpVersions sets every declared field', () => {
  const root = fixtureRepo()
  bumpVersions(root, '0.2.0')
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  const mkt = JSON.parse(readFileSync(join(root, '.claude-plugin', 'marketplace.json'), 'utf8'))
  assert.equal(pkg.version, '0.2.0')
  assert.equal(mkt.plugins[0].version, '0.2.0')
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --test tests/version/bump-version.test.mjs`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `scripts/bump-version.mjs`**

```javascript
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { getPath, setPath } from './lib/jsonpath.mjs'

function loadConfig(root) {
  return JSON.parse(readFileSync(join(root, '.version-bump.json'), 'utf8')).files
}

export function checkVersions(root) {
  const versions = loadConfig(root).map(({ path, field }) => {
    const json = JSON.parse(readFileSync(join(root, path), 'utf8'))
    return { path, field, version: getPath(json, field) }
  })
  const unique = new Set(versions.map((v) => v.version))
  return { versions, drift: unique.size > 1 }
}

export function bumpVersions(root, newVersion) {
  if (!/^\d+\.\d+\.\d+/.test(newVersion)) {
    throw new Error(`'${newVersion}' is not a valid version (expected X.Y.Z)`)
  }
  for (const { path, field } of loadConfig(root)) {
    const file = join(root, path)
    const json = JSON.parse(readFileSync(file, 'utf8'))
    const next = setPath(json, field, newVersion)
    writeFileSync(file, JSON.stringify(next, null, 2) + '\n')
  }
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const arg = process.argv[2]
  if (arg === '--check' || arg === '--audit') {
    const { versions, drift } = checkVersions(root)
    for (const v of versions) console.log(`  ${v.path} (${v.field}) → ${v.version}`)
    if (drift) {
      console.error('❌ DRIFT DETECTED — versions are not in sync')
      process.exit(1)
    }
    console.log('✅ All declared files are in sync.')
  } else if (arg && /^\d+\.\d+\.\d+/.test(arg)) {
    bumpVersions(root, arg)
    console.log(`Bumped all declared files to ${arg}.`)
  } else {
    console.log('Usage: bump-version.mjs <x.y.z> | --check')
    process.exit(arg ? 1 : 0)
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/version/bump-version.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 6: Verify real manifests are in sync**

Run: `node scripts/bump-version.mjs --check`
Expected: all files at `0.1.0`, `✅ All declared files are in sync.`

- [ ] **Step 7: Commit**

```bash
git add .version-bump.json scripts/bump-version.mjs tests/version
git commit -m "feat: add version sync tooling"
```

---

## Task 8: Local quality gate (pre-commit)

**Files:**
- Create: `.pre-commit-config.yaml`

- [ ] **Step 1: Create `.pre-commit-config.yaml`**

```yaml
repos:
  - repo: local
    hooks:
      - id: validate-skills
        name: validate skills
        entry: node scripts/validate-skills.mjs
        language: system
        pass_filenames: false
        files: ^skills/
      - id: version-check
        name: version drift check
        entry: node scripts/bump-version.mjs --check
        language: system
        pass_filenames: false
        files: ^(package\.json|\.claude-plugin/|\.cursor-plugin/|\.codex-plugin/|gemini-extension\.json|\.version-bump\.json)
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: end-of-file-fixer
      - id: trailing-whitespace
      - id: check-json
```

- [ ] **Step 2: Smoke-test the hook commands directly**

Run:
```bash
node scripts/validate-skills.mjs && node scripts/bump-version.mjs --check
```
Expected: validator passes, versions in sync. (Installing the `pre-commit` framework itself is optional for local devs: `pip install pre-commit && pre-commit install`.)

- [ ] **Step 3: Commit**

```bash
git add .pre-commit-config.yaml
git commit -m "ci: add pre-commit quality gate"
```

---

## Task 9: GitHub Actions (CI + release)

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Validate skills
        run: node scripts/validate-skills.mjs
      - name: Version drift check
        run: node scripts/bump-version.mjs --check
      - name: Unit tests
        run: node --test 'tests/**/*.test.mjs'
      - name: Build bundles (dry verify)
        run: node scripts/build-skill-bundles.mjs
```

- [ ] **Step 2: Create `.github/workflows/release.yml`**

```yaml
name: Release
on:
  push:
    tags: ['v*']
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Validate
        run: node scripts/validate-skills.mjs
      - name: Build .skill bundles
        run: node scripts/build-skill-bundles.mjs
      - name: Create release with bundles
        uses: softprops/action-gh-release@v2
        with:
          files: dist/*.skill
```

- [ ] **Step 3: Lint the workflow YAML locally**

Run:
```bash
node -e "const y=require('fs').readFileSync('.github/workflows/ci.yml','utf8'); if(!y.includes('actions/checkout')) throw new Error('bad'); console.log('ci.yml ok')"
node -e "const y=require('fs').readFileSync('.github/workflows/release.yml','utf8'); if(!y.includes('action-gh-release')) throw new Error('bad'); console.log('release.yml ok')"
```
Expected: both `ok`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows
git commit -m "ci: add CI and release workflows"
```

---

## Task 10: Governance & community files

**Files:**
- Create: `README.md`
- Create: `CREDITS.md`
- Create: `CHANGELOG.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `LICENSE`
- Create: `.github/ISSUE_TEMPLATE/bug_report.md`
- Create: `.github/ISSUE_TEMPLATE/skill_request.md`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`

- [ ] **Step 1: Create `README.md`**

```markdown
# Acrosstudio Skills Suite

Acrosstudio's Claude skills for consulting delivery: engagement intake,
McKinsey-style strategy frameworks, and branded PPTX/XLSX deliverables.
The repo root is a Claude Code plugin; `skills/` is the single source of truth.

## Skills
- `acrosstudio-pptx` — branded proposal / estimate / meeting-doc generator.
- _(coming in Plan 2)_ `strat-*` strategy frameworks, `acrosstudio-intake`.
- _(coming in Plan 3)_ `acrosstudio-engagement` orchestrator.

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
```

- [ ] **Step 2: Create `CREDITS.md`**

```markdown
# Credits

Strategy framework **concepts** (situation assessment, business case, operating
model, narrative, etc.) are inspired by
[aapersh/strategy-skills-for-claude](https://github.com/aapersh/strategy-skills-for-claude),
which carries no license. **No text was copied** — all prose in this repository
is original to Acrosstudio.

Repository structure, version-sync tooling, and quality-gate patterns are
modeled on [obra/superpowers](https://github.com/obra/superpowers) (MIT).
```

- [ ] **Step 3: Create `CHANGELOG.md`**

```markdown
# Changelog

## [0.1.0] - 2026-06-28
### Added
- Multi-platform plugin scaffold (Claude Code, Cursor, Codex, Gemini).
- Migrated `acrosstudio-pptx` from a zip blob to source files.
- Build, validate, and version-sync tooling; pre-commit + CI/release workflows.
```

- [ ] **Step 4: Create `CODE_OF_CONDUCT.md`**

```markdown
# Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
Report concerns to generative.ai@acrosstudio.co.jp.
```

- [ ] **Step 5: Create `LICENSE` (MIT)**

```text
MIT License

Copyright (c) 2026 Acrosstudio株式会社

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 6: Create `.github/ISSUE_TEMPLATE/bug_report.md`**

```markdown
---
name: Bug report
about: A skill misbehaves or a build/validation fails
labels: bug
---

**Skill / area:**
**What happened:**
**Expected:**
**Platform:** (Claude Code / claude.ai / Cursor / Codex / Gemini / Agent SDK)
**Steps to reproduce:**
```

- [ ] **Step 7: Create `.github/ISSUE_TEMPLATE/skill_request.md`**

```markdown
---
name: Skill request
about: Propose a new skill for the suite
labels: enhancement
---

**Proposed skill name:** (acrosstudio-* or strat-*)
**Use when… (triggering conditions):**
**What deliverable/analysis it produces:**
**Related skills it composes with:**
```

- [ ] **Step 8: Create `.github/PULL_REQUEST_TEMPLATE.md`**

```markdown
## Summary

## Checklist
- [ ] `npm run validate` passes
- [ ] `npm test` passes
- [ ] Version synced (`node scripts/bump-version.mjs --check`) if manifests changed
- [ ] New/changed skill follows the `acrosstudio-*` / `strat-*` naming convention
```

- [ ] **Step 9: Commit**

```bash
git add README.md CREDITS.md CHANGELOG.md CODE_OF_CONDUCT.md LICENSE .github/ISSUE_TEMPLATE .github/PULL_REQUEST_TEMPLATE.md
git commit -m "docs: add governance and community files"
```

---

## Task 11: Full verification & first tag

**Files:** none (verification only)

- [ ] **Step 1: Run the whole gate end-to-end**

Run:
```bash
npm run validate && npm test && node scripts/bump-version.mjs --check && npm run build
```
Expected: validator 0 errors; all unit tests pass; versions in sync; `dist/acrosstudio-pptx.skill` built.

- [ ] **Step 2: Confirm the built bundle structure**

Run: `unzip -l dist/acrosstudio-pptx.skill | grep -E "acrosstudio-pptx/(SKILL.md|assets/)"`
Expected: lines for `acrosstudio-pptx/SKILL.md` and `acrosstudio-pptx/assets/...`.

- [ ] **Step 3: Confirm the working tree is clean and the blob is gone**

Run: `git status --short && test ! -f acrosstudio-pptx.skill && echo "blob removed"`
Expected: clean tree (dist/ is gitignored), `blob removed`.

- [ ] **Step 4: Tag the release**

```bash
git tag v0.1.0
git log --oneline -8
```
Expected: tag created; commit history shows Tasks 1–11. (Push/release is a manual user action — do not push without the user's go-ahead.)

---

## Self-Review (completed by plan author)

**Spec coverage:** Spec §5 structure → Tasks 1,6,7,8,9,10. §6 naming (pptx) → Task 4/6. §8 multi-platform → Task 6. §9 build/version → Tasks 5,7. §10 quality gates → Tasks 3,8,9. §11 migration + path fix → Task 4. §12 licensing → Task 10 (CREDITS, LICENSE). §13 governance → Tasks 6,10. Spec §6 `strat-*`/`intake` and §7 composition are **explicitly deferred to Plans 2–3** (noted in header) — not gaps.

**Placeholder scan:** No TBD/TODO. Every code/file step shows complete content. README "coming in Plan 2/3" lines are intentional forward references, not placeholders.

**Type consistency:** `listSkillDirs` returns `{name, dir, skillMdPath}` (Task 2) and is consumed consistently in Tasks 3 & 5. `getPath`/`setPath` (Task 2) used in Task 7. `validateSkills` returns `{errors, warnings, count}` — CLI and tests agree. `checkVersions`→`{versions, drift}`, `bumpVersions(root, version)` — tests and CLI agree.

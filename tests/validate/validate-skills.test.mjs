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

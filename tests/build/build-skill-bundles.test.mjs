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

  const built = buildBundles(skillsDir, distDir, '9.9.9')
  assert.equal(built.length, 1)
  const bundle = join(distDir, 'sample-9.9.9.skill')
  assert.ok(existsSync(bundle))

  const listing = execFileSync('unzip', ['-l', bundle], { encoding: 'utf8' })
  assert.ok(listing.includes('sample/SKILL.md'))
})

test('omits the version suffix when none is given', () => {
  const root = mkdtempSync(join(tmpdir(), 'b-'))
  const skillsDir = join(root, 'skills')
  const distDir = join(root, 'dist')
  const skill = join(skillsDir, 'sample')
  mkdirSync(skill, { recursive: true })
  writeFileSync(join(skill, 'SKILL.md'), '---\nname: sample\ndescription: Use when sampling\n---\n')

  const built = buildBundles(skillsDir, distDir)
  assert.equal(built.length, 1)
  assert.ok(existsSync(join(distDir, 'sample.skill')))
})

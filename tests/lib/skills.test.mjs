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

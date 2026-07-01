import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { checkBinaryAttributes } from '../../scripts/validate-skills.mjs'

// Build a repoRoot with a single skill containing one PNG asset and a
// .gitattributes whose contents are caller-supplied.
function fixtureRepo(gitattributes) {
  const root = mkdtempSync(join(tmpdir(), 'attr-'))
  const assets = join(root, 'skills', 'x', 'assets')
  mkdirSync(assets, { recursive: true })
  writeFileSync(join(assets, 'a.png'), 'fake-png')
  if (gitattributes !== null) writeFileSync(join(root, '.gitattributes'), gitattributes)
  return { root, skillsDir: join(root, 'skills') }
}

test('no warnings when used image extensions are marked binary', () => {
  const { root, skillsDir } = fixtureRepo('*.png binary\n')
  assert.deepEqual(checkBinaryAttributes(root, skillsDir).warnings, [])
})

test('warns when a used image extension is not marked binary', () => {
  const { root, skillsDir } = fixtureRepo('*.md text\n')
  const { warnings } = checkBinaryAttributes(root, skillsDir)
  assert.ok(warnings.some((w) => w.includes('png')))
})

test('warns when .gitattributes is missing entirely', () => {
  const { root, skillsDir } = fixtureRepo(null)
  const { warnings } = checkBinaryAttributes(root, skillsDir)
  assert.ok(warnings.some((w) => w.includes('.gitattributes')))
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { auditVersions } from '../../scripts/bump-version.mjs'

// A repo whose only declared file is package.json at 0.1.0.
function fixtureRepo() {
  const root = mkdtempSync(join(tmpdir(), 'audit-'))
  writeFileSync(join(root, 'package.json'), JSON.stringify({ version: '0.1.0' }, null, 2))
  writeFileSync(
    join(root, '.version-bump.json'),
    JSON.stringify({ files: [{ path: 'package.json', field: 'version' }] }, null, 2)
  )
  return root
}

test('auditVersions flags an undeclared file containing the version', () => {
  const root = fixtureRepo()
  writeFileSync(join(root, 'README.md'), '# Demo\n\nCurrent release: 0.1.0\n')
  const { current, drift, undeclared } = auditVersions(root)
  assert.equal(current, '0.1.0')
  assert.equal(drift, false)
  assert.ok(undeclared.some((u) => u.startsWith('README.md:')))
})

test('auditVersions reports no undeclared matches when only declared files hold the version', () => {
  const root = fixtureRepo()
  writeFileSync(join(root, 'README.md'), '# Demo\n\nNo version string here.\n')
  const { undeclared } = auditVersions(root)
  assert.deepEqual(undeclared, [])
})

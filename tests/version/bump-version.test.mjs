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
      {
        files: [
          { path: 'package.json', field: 'version' },
          { path: '.claude-plugin/marketplace.json', field: 'plugins.0.version' }
        ]
      },
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

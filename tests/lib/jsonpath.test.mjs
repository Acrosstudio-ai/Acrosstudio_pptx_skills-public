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

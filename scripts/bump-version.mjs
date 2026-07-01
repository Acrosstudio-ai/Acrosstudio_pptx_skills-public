import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, extname } from 'node:path'
import { getPath, setPath } from './lib/jsonpath.mjs'

const SCAN_EXTENSIONS = new Set(['.json', '.mjs', '.js', '.cjs', '.yml', '.yaml', '.md'])
const PRUNE_DIRS = new Set(['.git', 'node_modules', 'dist'])

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

// The current version is the synced value; under drift, the most common one.
function currentVersion(root) {
  const { versions, drift } = checkVersions(root)
  if (!drift) return { current: versions[0] && versions[0].version, drift }
  const counts = new Map()
  for (const { version } of versions) counts.set(version, (counts.get(version) || 0) + 1)
  let current = null
  let max = -1
  for (const [version, count] of counts) {
    if (count > max) {
      max = count
      current = version
    }
  }
  return { current, drift }
}

// Recursively collect scannable text files, pruning .git/node_modules/dist.
// readdirSync({ recursive }) would descend into .git, so walk manually.
function walkFiles(dir, acc) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!PRUNE_DIRS.has(entry.name)) walkFiles(join(dir, entry.name), acc)
    } else if (entry.isFile() && SCAN_EXTENSIONS.has(extname(entry.name))) {
      acc.push(join(dir, entry.name))
    }
  }
  return acc
}

// Scan every non-declared text file for the current version string and report
// each "relativePath:lineNumber" where it appears.
export function auditVersions(root) {
  const { current, drift } = currentVersion(root)
  const declared = new Set(loadConfig(root).map(({ path }) => path))
  const undeclared = []
  if (!current) return { current, drift, undeclared }
  for (const file of walkFiles(root, [])) {
    const rel = relative(root, file)
    if (declared.has(rel)) continue
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (line.includes(current)) undeclared.push(`${rel}:${i + 1}`)
    })
  }
  return { current, drift, undeclared }
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

// Print the declared-file version table and the in-sync/drift verdict.
function printCheck(root) {
  const { versions, drift } = checkVersions(root)
  for (const v of versions) console.log(`  ${v.path} (${v.field}) → ${v.version}`)
  if (drift) {
    console.error('❌ DRIFT DETECTED — versions are not in sync')
  } else {
    console.log('✅ All declared files are in sync.')
  }
  return drift
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const arg = process.argv[2]
  if (arg === '--check') {
    const drift = printCheck(root)
    process.exit(drift ? 1 : 0)
  } else if (arg === '--audit') {
    const drift = printCheck(root)
    const { undeclared } = auditVersions(root)
    if (undeclared.length > 0) {
      console.log(`\nUndeclared files containing the version string (${undeclared.length}):`)
      for (const u of undeclared) console.log(`  ${u}`)
    } else {
      console.log('No undeclared files contain the version string. All clear.')
    }
    process.exit(drift ? 1 : 0)
  } else if (arg && /^\d+\.\d+\.\d+/.test(arg)) {
    bumpVersions(root, arg)
    console.log(`Bumped all declared files to ${arg}.`)
  } else {
    console.log('Usage: bump-version.mjs <x.y.z> | --check | --audit')
    process.exit(arg ? 1 : 0)
  }
}

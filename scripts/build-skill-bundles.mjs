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

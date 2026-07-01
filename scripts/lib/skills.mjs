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
      skillMdPath: join(skillsDir, entry.name, 'SKILL.md')
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

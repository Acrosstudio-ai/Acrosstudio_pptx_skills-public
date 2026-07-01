import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'
import { listSkillDirs, parseFrontmatter } from './lib/skills.mjs'

const FORBIDDEN_PATHS = ['acrosstudio-proposal3']
const MAX_DESCRIPTION = 1024
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif']

export function validateSkills(skillsDir) {
  const errors = []
  const warnings = []
  const skills = listSkillDirs(skillsDir)

  if (skills.length === 0) {
    errors.push(`No skills found under ${skillsDir}`)
  }

  for (const skill of skills) {
    const content = readFileSync(skill.skillMdPath, 'utf8')
    const fm = parseFrontmatter(content)

    if (!fm.name) errors.push(`${skill.name}: SKILL.md missing frontmatter 'name'`)
    if (!fm.description) errors.push(`${skill.name}: SKILL.md missing frontmatter 'description'`)
    if (fm.name && fm.name !== skill.name) {
      errors.push(`${skill.name}: frontmatter name '${fm.name}' does not match directory`)
    }
    if (fm.description && fm.description.length > MAX_DESCRIPTION) {
      errors.push(`${skill.name}: description exceeds ${MAX_DESCRIPTION} chars`)
    }
    if (fm.description && fm.description.length > 500) {
      warnings.push(`${skill.name}: description over 500 chars (prefer shorter)`)
    }
    for (const forbidden of FORBIDDEN_PATHS) {
      if (content.includes(forbidden)) {
        errors.push(`${skill.name}: SKILL.md references forbidden path '${forbidden}'`)
      }
    }
  }

  return { errors, warnings, count: skills.length }
}

// Recursively collect the image extensions actually present under skillsDir.
function collectImageExtensions(dir, found) {
  if (!existsSync(dir)) return found
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      collectImageExtensions(join(dir, entry.name), found)
    } else if (entry.isFile()) {
      const ext = extname(entry.name).slice(1).toLowerCase()
      if (IMAGE_EXTENSIONS.includes(ext)) found.add(ext)
    }
  }
  return found
}

// Warn (never fail) when image types used under skillsDir are not marked
// `*.<ext> binary` in repoRoot/.gitattributes, which would let Git mangle them.
export function checkBinaryAttributes(repoRoot, skillsDir) {
  const warnings = []
  const used = collectImageExtensions(skillsDir, new Set())
  if (used.size === 0) return { warnings }

  const gitattributesPath = join(repoRoot, '.gitattributes')
  if (!existsSync(gitattributesPath)) {
    warnings.push('.gitattributes is missing; image files under skills/ should be marked binary')
    return { warnings }
  }

  const lines = readFileSync(gitattributesPath, 'utf8').split('\n')
  for (const ext of used) {
    const marked = lines.some((line) => {
      const tokens = line.trim().split(/\s+/)
      return tokens[0] === `*.${ext}` && tokens.includes('binary')
    })
    if (!marked) warnings.push(`.gitattributes does not mark *.${ext} as binary`)
  }
  return { warnings }
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const here = dirname(fileURLToPath(import.meta.url))
  const repoRoot = join(here, '..')
  const skillsDir = join(here, '..', 'skills')
  const { errors, warnings, count } = validateSkills(skillsDir)
  const { warnings: binaryWarnings } = checkBinaryAttributes(repoRoot, skillsDir)
  const allWarnings = [...warnings, ...binaryWarnings]
  for (const w of allWarnings) console.warn(`⚠️  ${w}`)
  for (const e of errors) console.error(`❌ ${e}`)
  console.log(
    `Validated ${count} skill(s); ${errors.length} error(s), ${allWarnings.length} warning(s).`
  )
  process.exit(errors.length > 0 ? 1 : 0)
}

// Validates every skill in `skills/`: frontmatter, naming, size limits and file references.
// Usage: bun scripts/validate-skills.ts

import { access, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const SKILLS_DIR = 'skills'
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const MAX_NAME_LENGTH = 64
const MAX_DESCRIPTION_LENGTH = 1024
const MAX_BODY_LINES = 500

type Frontmatter = Record<string, string>

const parseFrontmatter = (source: string): Frontmatter | null => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match?.[1]) return null

  const result: Frontmatter = {}
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    result[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }
  return result
}

// Matches `references/x.md` and `assets/x` (own skill) as well as `<skill>/references/x.md` (other skill).
const findReferencedFiles = (source: string): string[] => {
  const matches = source.match(/(?:[a-z0-9-]+\/)?(?:references|assets)\/[\w./-]+/g) ?? []
  return [...new Set(matches.map((path) => path.replace(/[.,;:)]+$/, '')))]
}

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const resolveReference = (folder: string, reference: string): string => {
  const isOtherSkill = !reference.startsWith('references/') && !reference.startsWith('assets/')
  return isOtherSkill ? join(SKILLS_DIR, reference) : join(SKILLS_DIR, folder, reference)
}

const validateSkill = async (folder: string): Promise<string[]> => {
  const errors: string[] = []
  const file = Bun.file(join(SKILLS_DIR, folder, 'SKILL.md'))

  if (!(await file.exists())) return [`${folder}: SKILL.md is missing`]

  const source = await file.text()
  const frontmatter = parseFrontmatter(source)
  if (!frontmatter) return [`${folder}: frontmatter is missing or malformed`]

  const { name, description } = frontmatter
  if (!name) {
    errors.push(`${folder}: "name" is missing`)
  } else {
    if (name !== folder) errors.push(`${folder}: name "${name}" does not match the folder name`)
    if (!NAME_PATTERN.test(name)) errors.push(`${folder}: name must be kebab-case`)
    if (name.length > MAX_NAME_LENGTH) errors.push(`${folder}: name is longer than ${MAX_NAME_LENGTH} characters`)
  }

  if (!description) {
    errors.push(`${folder}: "description" is missing`)
  } else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`${folder}: description has ${description.length} characters (max ${MAX_DESCRIPTION_LENGTH})`)
  }

  const lineCount = source.split('\n').length
  if (lineCount > MAX_BODY_LINES) errors.push(`${folder}: SKILL.md has ${lineCount} lines (max ${MAX_BODY_LINES})`)

  for (const reference of findReferencedFiles(source)) {
    if (!(await exists(resolveReference(folder, reference)))) {
      errors.push(`${folder}: referenced file "${reference}" does not exist`)
    }
  }

  return errors
}

const folders = (await readdir(SKILLS_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const allErrors = (await Promise.all(folders.map(validateSkill))).flat()

if (allErrors.length > 0) {
  console.error(allErrors.map((error) => `✗ ${error}`).join('\n'))
  process.exit(1)
}

console.log(`✓ ${folders.length} skills valid`)

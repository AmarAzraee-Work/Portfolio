import { readdirSync } from 'node:fs'
import { dirname, basename } from 'node:path'

// Example text from the design that must be replaced before the site goes live.
export const PLACEHOLDER_PATTERNS = [
  /20XX/,
  /example\.com/,
  /Role title/,
  /Company name/,
  /Qualification · Institution/,
  /Education details go here/,
  /12-345 6789/,
  /60123456789/,
  /\[[A-Za-z][^\]]*\]/,
]

export function findPlaceholders(line) {
  return PLACEHOLDER_PATTERNS.filter((pattern) => pattern.test(line)).map((pattern) => pattern.source)
}

// existsSync ignores letter case on macOS, but Vercel's servers do not, so compare names exactly.
export function existsWithExactCase(path) {
  if (path === '.' || path === '' || path === '/') return true
  const parent = dirname(path)
  if (!existsWithExactCase(parent)) return false
  try {
    return readdirSync(parent).includes(basename(path))
  } catch {
    return false
  }
}

// Run before deploying: fails if placeholder content or required files are missing.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { projects } from '../src/data/projects.js'
import { findPlaceholders, existsWithExactCase } from './content-rules.js'

const problems = []

function scan(path) {
  readFileSync(path, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      const found = findPlaceholders(line)
      if (found.length > 0) problems.push(`${path}:${index + 1}  ${line.trim()}`)
    })
}

const dataDir = 'src/data'
for (const file of readdirSync(dataDir)) {
  if (file.endsWith('.js') && !file.endsWith('.test.js')) scan(join(dataDir, file))
}
scan('index.html')

if (!existsWithExactCase('public/cv/Amar-CV.pdf')) problems.push('public/cv/Amar-CV.pdf is missing')

for (const project of projects) {
  for (const screen of project.screens) {
    if (screen.image && !existsWithExactCase(join('public', screen.image))) {
      problems.push(`Screenshot for "${project.title}" (${screen.label}) not found: public${screen.image}`)
    }
  }
}

if (problems.length > 0) {
  console.error(`Content check failed (${problems.length} problem(s)):\n`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log('Content check passed.')

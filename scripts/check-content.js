// Run before deploying: fails if placeholder content or required files are missing.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { projects } from '../src/data/projects.js'
import { isPlaceholder } from './placeholder.js'

const problems = []

function scanForTodo(path) {
  readFileSync(path, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      if (isPlaceholder(line)) problems.push(`${path}:${index + 1}  ${line.trim()}`)
    })
}

const dataDir = 'src/data'
for (const file of readdirSync(dataDir)) {
  if (file.endsWith('.js') && !file.endsWith('.test.js')) scanForTodo(join(dataDir, file))
}
scanForTodo('index.html')

if (!existsSync('public/cv.pdf')) problems.push('public/cv.pdf is missing')

for (const project of projects) {
  if (project.image && !existsSync(join('public', project.image))) {
    problems.push(`Screenshot for "${project.title}" not found: public${project.image}`)
  }
}

if (problems.length > 0) {
  console.error(`Content check failed (${problems.length} problem(s)):\n`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log('Content check passed.')

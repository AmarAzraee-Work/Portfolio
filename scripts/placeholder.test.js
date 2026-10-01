import { isPlaceholder } from './placeholder.js'

describe('isPlaceholder', () => {
  it.each([
    "tagline: 'TODO: replace — one sentence'",
    "email: 'todo.replace@example.com'",
    "github: 'https://github.com/TODO-replace'",
    '<meta name="description" content="TODO: replace — Amar" />',
  ])('flags the placeholder marker in %s', (line) => {
    expect(isPlaceholder(line)).toBe(true)
  })

  it.each([
    "title: 'Todo App'",
    "description: 'A todo list with drag and drop and shared todos.'",
  ])('does not flag real content that mentions todos: %s', (line) => {
    expect(isPlaceholder(line)).toBe(false)
  })
})

import { findPlaceholders, existsWithExactCase } from './content-rules.js'

describe('findPlaceholders', () => {
  it.each([
    "period: '20XX – Present',",
    "email: 'amar@example.com',",
    "title: 'Role title · Company name',",
    "number: '60123456789',",
    "display: '+60 12-345 6789',",
    "title: 'Qualification · Institution', line: 'Education details go here.'",
    "name: '[City]',",
  ])('flags %s', (line) => {
    expect(findPlaceholders(line).length).toBeGreaterThan(0)
  })

  it.each([
    "tags: ['Laravel', 'MySQL'],",
    "title: 'Staff Timetable System',",
    "stack: 'Laravel · MySQL · Blade',",
  ])('does not flag %s', (line) => {
    expect(findPlaceholders(line)).toEqual([])
  })
})

describe('existsWithExactCase', () => {
  it('matches files only with the exact letter case', () => {
    expect(existsWithExactCase('package.json')).toBe(true)
    expect(existsWithExactCase('PACKAGE.json')).toBe(false)
    expect(existsWithExactCase('src/data/data.test.js')).toBe(true)
    expect(existsWithExactCase('src/Data/data.test.js')).toBe(false)
    expect(existsWithExactCase('does/not/exist.png')).toBe(false)
  })
})

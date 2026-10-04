import { describe, it, expect } from 'vitest'
import { profile } from './profile'
import { projects } from './projects'
import { experience } from './experience'
import { certs } from './certs'
import { stack } from './stack'

const isText = (v) => typeof v === 'string' && v.trim().length > 0
const isHttpsUrl = (v) => typeof v === 'string' && v.startsWith('https://')
const isOptionalHttpsUrl = (v) => v === undefined || isHttpsUrl(v)
const isTextList = (v) => Array.isArray(v) && v.length > 0 && v.every(isText)

describe('profile', () => {
  it('has all required fields', () => {
    expect(isText(profile.name)).toBe(true)
    expect(isText(profile.role)).toBe(true)
    expect(isText(profile.tagline)).toBe(true)
    expect(isTextList(profile.about)).toBe(true)
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(isHttpsUrl(profile.github)).toBe(true)
    expect(isHttpsUrl(profile.linkedin)).toBe(true)
    expect(profile.cvUrl.startsWith('/')).toBe(true)
    expect(isOptionalHttpsUrl(profile.siteRepoUrl)).toBe(true)
  })
})

describe('projects', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it.each(projects.map((p) => [p.title, p]))('%s matches the project shape', (_title, p) => {
    expect(isText(p.title)).toBe(true)
    expect(isText(p.description)).toBe(true)
    expect(isTextList(p.tech)).toBe(true)
    expect(['in production', 'demo']).toContain(p.status)
    expect(typeof p.featured).toBe('boolean')
    expect(isOptionalHttpsUrl(p.liveUrl)).toBe(true)
    expect(isOptionalHttpsUrl(p.githubUrl)).toBe(true)
    if (p.image !== undefined) expect(p.image.startsWith('/')).toBe(true)
  })

  it('has unique titles (titles are used as React keys)', () => {
    const titles = projects.map((p) => p.title)
    expect(new Set(titles).size).toBe(titles.length)
  })
})

describe('experience', () => {
  it.each(experience.map((e) => [e.company, e]))('%s matches the experience shape', (_c, e) => {
    expect(isText(e.company)).toBe(true)
    expect(isText(e.role)).toBe(true)
    expect(isText(e.period)).toBe(true)
    expect(isTextList(e.points)).toBe(true)
    expect(isTextList(e.tech)).toBe(true)
  })
})

describe('certs', () => {
  it.each(certs.map((c) => [c.name, c]))('%s matches the cert shape', (_n, c) => {
    expect(isText(c.name)).toBe(true)
    expect(isText(c.issuer)).toBe(true)
    expect(isText(String(c.year))).toBe(true)
    expect(isOptionalHttpsUrl(c.verifyUrl)).toBe(true)
  })
})

describe('stack', () => {
  it.each(stack.map((g) => [g.category, g]))('%s matches the stack shape', (_c, g) => {
    expect(['Frontend', 'Backend', 'Database', 'Tools']).toContain(g.category)
    expect(isTextList(g.items)).toBe(true)
  })
})

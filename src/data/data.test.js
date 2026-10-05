import { profile } from './profile'
import { projects } from './projects'
import { about } from './about'
import { experience } from './experience'

const SCREEN_IDS = ['tt-week', 'tt-staff', 'sales-landing', 'sales-admin', 'resto-landing', 'resto-menu']
const isText = (v) => typeof v === 'string' && v.trim().length > 0
const isTextList = (v) => Array.isArray(v) && v.length > 0 && v.every(isText)

describe('profile', () => {
  it('has every field the page shows', () => {
    for (const key of ['name', 'shortName', 'role', 'intro', 'email', 'cvUrl']) expect(isText(profile[key])).toBe(true)
    expect(profile.headline).toHaveLength(2)
    expect(profile.headline.every(isText)).toBe(true)
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(isText(profile.whatsapp.display)).toBe(true)
    expect(profile.whatsapp.number).toMatch(/^\d+$/)
    expect(profile.cvUrl.startsWith('/')).toBe(true)
  })
})

describe('projects', () => {
  it('has three projects with unique ids', () => {
    expect(projects).toHaveLength(3)
    expect(new Set(projects.map((p) => p.id)).size).toBe(3)
  })

  it.each(projects.map((p) => [p.title, p]))('%s has every field and known screens', (_t, p) => {
    for (const key of ['id', 'title', 'stack', 'role', 'short', 'desc']) expect(isText(p[key])).toBe(true)
    expect(isTextList(p.tags)).toBe(true)
    expect(p.screens.length).toBeGreaterThan(0)
    for (const screen of p.screens) {
      expect(SCREEN_IDS).toContain(screen.id)
      expect(isText(screen.label)).toBe(true)
      if (screen.image !== undefined) expect(screen.image.startsWith('/')).toBe(true)
    }
  })
})

describe('about', () => {
  it('has a heading, two paragraphs and four tag groups', () => {
    expect(isText(about.eyebrow)).toBe(true)
    expect(isText(about.heading)).toBe(true)
    expect(about.paragraphs).toHaveLength(2)
    expect(about.groups).toHaveLength(4)
    for (const group of about.groups) {
      expect(['Code', 'GitBranch', 'CloudArrowUp', 'Palette']).toContain(group.icon)
      expect(['accent', 'neutral']).toContain(group.variant)
      expect(isText(group.label)).toBe(true)
      expect(isTextList(group.tags)).toBe(true)
    }
  })
})

describe('experience', () => {
  it('has four rows with period, title and line', () => {
    expect(experience).toHaveLength(4)
    for (const row of experience) for (const key of ['period', 'title', 'line']) expect(isText(row[key])).toBe(true)
  })
})

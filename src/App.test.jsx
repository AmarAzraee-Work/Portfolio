import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { profile } from './data/profile'

function stubReducedMotion(reduce) {
  vi.stubGlobal('matchMedia', (query) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
}

// In cube mode only the front face is visible; the others are visibility:hidden by design, so queries
// for content on other faces pass { hidden: true }.
describe('App', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    window.innerWidth = 1280
    window.innerHeight = 800
    stubReducedMotion(false)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('has one h1 with the headline', () => {
    render(<App />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveAccessibleName("Hi, I'm Amar. I build for the web, end to end.")
  })

  it('has the four face headings in order', () => {
    render(<App />)
    // Each heading has a screen-reader copy (sr-only) and an animated copy (aria-hidden); read the former.
    const names = screen.getAllByRole('heading', { level: 2, hidden: true }).map((h) => h.querySelector('.sr-only').textContent)
    expect(names).toEqual([
      "Things I've built",
      'I like making things work, and look good doing it.',
      "Where I've been",
      "Let's build something together.",
    ])
  })

  it('has the header and the section indicator', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Say hello' })).toBeInTheDocument()
    expect(within(screen.getByRole('navigation', { name: 'Sections' })).getAllByRole('button')).toHaveLength(5)
  })

  it('opens and closes a project from its card', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.click(container.querySelector('[aria-label="Sales Page & Admin Panel — view screens"]'))
    expect(screen.getByRole('dialog', { name: 'Sales Page & Admin Panel' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('links Download CV to the PDF', () => {
    const { container } = render(<App />)
    const cv = container.querySelector('a[download]')
    expect(cv).toHaveTextContent('Download CV')
    expect(cv).toHaveAttribute('href', profile.cvUrl)
    expect(cv).toHaveAttribute('download')
  })

  it('opens WhatsApp in a new tab', () => {
    const { container } = render(<App />)
    const link = container.querySelector('a[href^="https://wa.me/"]')
    expect(link).toHaveTextContent('WhatsApp')
    expect(link).toHaveAttribute('href', `https://wa.me/${profile.whatsapp.number}`)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows every face in flat mode under reduced motion', () => {
    stubReducedMotion(true)
    const { container } = render(<App />)
    const faces = container.querySelectorAll('[data-face]')
    expect(faces).toHaveLength(5)
    for (const face of faces) expect(face.style.visibility).not.toBe('hidden')
  })

  it('shows only the front face in cube mode', () => {
    const { container } = render(<App />)
    const faces = [...container.querySelectorAll('[data-face]')]
    expect(faces[0].style.visibility).toBe('visible')
    for (const face of faces.slice(1)) expect(face.style.visibility).toBe('hidden')
  })

  it('has no sound control', () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: /sound/i })).toBeNull()
  })
})

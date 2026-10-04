import { render, screen, act } from '@testing-library/react'
import Reveal from './Reveal'

function stubMatchMedia(reduce) {
  vi.stubGlobal('matchMedia', (query) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
}

describe('Reveal', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('is visible immediately when IntersectionObserver is not available', () => {
    stubMatchMedia(false)
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-visible', 'true')
  })

  it('is visible immediately when the user prefers reduced motion', () => {
    stubMatchMedia(true)
    vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-visible', 'true')
  })

  it('starts hidden and becomes visible when scrolled into view', () => {
    stubMatchMedia(false)
    let trigger
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback) { trigger = callback }
        observe() {}
        disconnect() {}
      },
    )
    render(<Reveal><p>content</p></Reveal>)
    const wrapper = screen.getByText('content').parentElement
    expect(wrapper).toHaveAttribute('data-visible', 'false')

    act(() => trigger([{ isIntersecting: true }]))
    expect(wrapper).toHaveAttribute('data-visible', 'true')
  })

  it('triggers on any visible pixel, so sections taller than the screen still appear', () => {
    stubMatchMedia(false)
    let options
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(_callback, opts) { options = opts }
        observe() {}
        disconnect() {}
      },
    )
    render(<Reveal><p>content</p></Reveal>)
    expect(options.threshold ?? 0).toBe(0)
  })
})

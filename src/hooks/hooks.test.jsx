import { useRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCubeScroll } from './useCubeScroll'
import { useScramble, Scramble } from './useScramble'
import MiniCube from '../components/MiniCube'

function stubReducedMotion(reduce) {
  vi.stubGlobal('matchMedia', (query) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
}

let result
function Harness({ paused = false }) {
  const stageRef = useRef(null)
  const cubeRef = useRef(null)
  const spacerRef = useRef(null)
  result = useCubeScroll({ stageRef, cubeRef, spacerRef, count: 5, paused })
  return (
    <>
      <div ref={stageRef}>
        <div ref={cubeRef}>
          {[0, 1, 2, 3, 4].map((i) => (
            <section key={i} data-face={i}>
              <div data-shade="" />
              {i === 4 && <input aria-label="Your name" />}
            </section>
          ))}
        </div>
      </div>
      <div ref={spacerRef} />
    </>
  )
}

describe('useCubeScroll', () => {
  let scrollTo
  beforeEach(() => {
    scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    window.innerWidth = 1280
    window.innerHeight = 800
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('uses flat mode under reduced motion', () => {
    stubReducedMotion(true)
    const { container } = render(<Harness />)
    expect(result.mode).toBe('flat')
    for (const face of container.querySelectorAll('[data-face]')) {
      expect(face.style.transform).toBe('none')
      expect(face.style.visibility).toBe('visible')
    }
  })

  it('places faces around the cube otherwise', () => {
    stubReducedMotion(false)
    const { container } = render(<Harness />)
    expect(result.mode).toBe('cube')
    expect(container.querySelector('[data-face="1"]').style.transform).toContain('rotateX(-90deg)')
  })

  it('pages faces with the keyboard', () => {
    stubReducedMotion(false)
    render(<Harness />)
    fireEvent.keyDown(window, { key: 'PageDown' })
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 800 }))
    fireEvent.keyDown(window, { key: 'End' })
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 3200 }))
  })

  it('ignores paging keys while paused or typing', () => {
    stubReducedMotion(false)
    const { rerender } = render(<Harness paused />)
    fireEvent.keyDown(window, { key: 'PageDown' })
    expect(scrollTo).not.toHaveBeenCalled()

    rerender(<Harness />)
    fireEvent.keyDown(screen.getByLabelText('Your name'), { key: 'ArrowDown' })
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('follows the window width for the wide layout', () => {
    stubReducedMotion(false)
    render(<Harness />)
    expect(result.wide).toBe(true)
    act(() => {
      window.innerWidth = 700
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.wide).toBe(false)
  })

  it('cleans up page styles on unmount', () => {
    stubReducedMotion(false)
    const { unmount } = render(<Harness />)
    expect(document.documentElement.style.scrollSnapType).toBe('y mandatory')
    unmount()
    expect(document.documentElement.style.scrollSnapType).toBe('')
  })
})

describe('useScramble', () => {
  function ScrambleHarness({ trigger }) {
    const ref = useRef(null)
    useScramble(ref, trigger, true)
    return (
      <div ref={ref}>
        <h2>
          <Scramble text="Where I've been" />
        </h2>
      </div>
    )
  }

  afterEach(() => vi.useRealTimers())

  it('keeps the accessible name and ends on the original text', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    render(<ScrambleHarness trigger={0} />)
    const heading = screen.getByRole('heading', { name: "Where I've been" })

    act(() => vi.advanceTimersByTime(400))
    expect(screen.getByRole('heading', { name: "Where I've been" })).toBe(heading)

    act(() => vi.advanceTimersByTime(2000))
    expect(heading.querySelector('[data-scramble-text]').textContent).toBe("Where I've been")
  })
})

describe('Scramble', () => {
  it('reserves the space of the real text so scrambling never shifts the layout', () => {
    const { container } = render(<Scramble text="Hi, I'm Amar." />)
    const sizer = container.querySelector('[data-scramble-sizer]')
    const animated = container.querySelector('[data-scramble-text]')
    expect(sizer).toHaveTextContent("Hi, I'm Amar.")
    expect(sizer).toHaveStyle({ visibility: 'hidden' })
    expect(animated).toHaveStyle({ position: 'absolute' })
    expect(animated).toHaveAttribute('aria-hidden', 'true')
    expect(container.firstElementChild).toHaveStyle({ position: 'relative', display: 'inline-block' })
  })
})

describe('MiniCube', () => {
  it('jumps to a section when a face is clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<MiniCube onNavigate={onNavigate} reducedMotion />)
    await user.click(screen.getByRole('button', { name: 'Experience' }))
    expect(onNavigate).toHaveBeenCalledWith(3)
    await user.click(screen.getByRole('button', { name: 'Home' }))
    expect(onNavigate).toHaveBeenCalledWith(0)
  })
})

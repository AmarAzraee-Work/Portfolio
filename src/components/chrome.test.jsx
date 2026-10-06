import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Eyebrow from './Eyebrow'
import Header from './Header'
import SectionIndicator from './SectionIndicator'
import SectionCounter from './SectionCounter'
import DeviceFrame from './DeviceFrame'

const LABELS = ['Home', 'Work', 'About', 'Experience', 'Contact']

describe('Header', () => {
  it('shows brand, section links and Say hello on wide screens', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    const onContact = vi.fn()
    render(<Header name="Muhamad Amar" labels={LABELS} active={1} wide onNavigate={onNavigate} onContact={onContact} />)

    expect(screen.getByRole('link', { name: 'Muhamad Amar' })).toBeInTheDocument()
    for (const label of LABELS) expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current')

    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(onNavigate).toHaveBeenCalledWith(2)
    await user.click(screen.getByRole('link', { name: 'Muhamad Amar' }))
    expect(onNavigate).toHaveBeenCalledWith(0)
    await user.click(screen.getByRole('button', { name: 'Say hello' }))
    expect(onContact).toHaveBeenCalled()
  })

  it('hides section links on narrow screens and has no sound control', () => {
    render(<Header name="Muhamad Amar" labels={LABELS} active={0} wide={false} onNavigate={() => {}} onContact={() => {}} />)
    expect(screen.queryByRole('link', { name: 'About' })).toBeNull()
    expect(screen.queryByRole('button', { name: /sound/i })).toBeNull()
  })
})

describe('SectionIndicator', () => {
  it('renders five labelled buttons and marks the active one', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<SectionIndicator labels={LABELS} active={2} onNavigate={onNavigate} />)

    const nav = screen.getByRole('navigation', { name: 'Sections' })
    const buttons = screen.getAllByRole('button')
    expect(nav).toContainElement(buttons[0])
    expect(buttons.map((b) => b.getAttribute('aria-label'))).toEqual(LABELS)
    expect(buttons.filter((b) => b.getAttribute('aria-current') === 'true')).toEqual([buttons[2]])

    await user.click(screen.getByRole('button', { name: 'Experience' }))
    expect(onNavigate).toHaveBeenCalledWith(3)
  })
})

describe('SectionCounter', () => {
  it('shows the active number, total and label', () => {
    const { container } = render(<SectionCounter active={1} total={5} label="Work" />)
    expect(container).toHaveTextContent('02')
    expect(container).toHaveTextContent('/ 05')
    expect(container).toHaveTextContent('Work')
  })
})

describe('DeviceFrame', () => {
  it('shows the browser bar with the screen URL on desktop', () => {
    const { container } = render(<DeviceFrame device="desktop" screen="tt-week" width={900} height={500} />)
    expect(container).toHaveTextContent('amar.dev/work/tt-week')
  })

  it('has no URL bar on tablet and phone', () => {
    for (const device of ['tablet', 'phone']) {
      const { container, unmount } = render(<DeviceFrame device={device} screen="tt-week" width={900} height={500} />)
      expect(container).not.toHaveTextContent('amar.dev/work/')
      unmount()
    }
  })

  it('shows a real screenshot instead of the mock-up when given', () => {
    const { container } = render(<DeviceFrame device="desktop" screen="tt-week" image="/images/tt.png" width={900} height={500} />)
    expect(container.querySelector('img')).toHaveAttribute('src', '/images/tt.png')
    expect(container).not.toHaveTextContent('Aisyah Rahman')
  })
})

describe('Eyebrow', () => {
  it('renders its label', () => {
    const { container } = render(<Eyebrow>Selected work</Eyebrow>)
    expect(container).toHaveTextContent('Selected work')
  })
})

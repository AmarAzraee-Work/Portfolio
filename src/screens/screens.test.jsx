import { render } from '@testing-library/react'
import { ProjectScreen, SCREENS } from './index'

const IDS = ['tt-week', 'tt-staff', 'sales-landing', 'sales-admin', 'resto-landing', 'resto-menu']

const TEXT = {
  'tt-week': ['Aisyah Rahman', 'Tue'],
  'tt-staff': ['Sarah Mokhtar', 'Management'],
  'sales-landing': ['Kopi Pagi'],
  'sales-admin': ['RM 18,420', '#1042'],
  'resto-landing': ['Nasi Lemak Berempah'],
  'resto-menu': ['Nasi Kerabu', 'Rice dishes'],
}

describe('ProjectScreen', () => {
  it('has a component for every screen id', () => {
    expect(Object.keys(SCREENS).sort()).toEqual([...IDS].sort())
  })

  describe.each(IDS)('%s', (id) => {
    it.each(['desktop', 'phone'])('renders a decorative %s layout', (device) => {
      const { container } = render(<ProjectScreen screen={id} device={device} />)
      const root = container.firstElementChild
      expect(root).not.toBeNull()
      expect(root).toHaveAttribute('aria-hidden', 'true')
      expect(root.style.width).toBe(device === 'phone' ? '390px' : '1280px')
      expect(root.textContent.length).toBeGreaterThan(20)
    })

    it('shows its distinctive content on desktop', () => {
      const { container } = render(<ProjectScreen screen={id} device="desktop" />)
      for (const text of TEXT[id]) expect(container.textContent).toContain(text)
    })
  })

  it('renders nothing for an unknown screen', () => {
    const { container } = render(<ProjectScreen screen="nope" />)
    expect(container).toBeEmptyDOMElement()
  })
})

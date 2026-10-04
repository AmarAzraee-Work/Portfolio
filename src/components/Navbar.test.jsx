import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('shows the terminal-style brand', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /amar@portfolio/ })).toBeInTheDocument()
  })

  it('opens the mobile menu and closes it after a link is tapped', async () => {
    const user = userEvent.setup()
    const { container } = render(<Navbar />)
    const toggle = screen.getByRole('button', { name: 'menu' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('#mobile-menu')).toBeNull()

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'close' })).toHaveAttribute('aria-expanded', 'true')
    const menu = container.querySelector('#mobile-menu')
    expect(menu).not.toBeNull()

    await user.click(menu.querySelector('a[href="#projects"]'))
    expect(container.querySelector('#mobile-menu')).toBeNull()
  })

  it('keeps the resume link visible on mobile without opening the menu', () => {
    render(<Navbar />)
    const resumeLinks = screen.getAllByRole('link', { name: 'resume' })
    expect(resumeLinks.some((link) => !link.closest('.hidden'))).toBe(true)
  })
})

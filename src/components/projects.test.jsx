import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import { projects } from '../data/projects'

const project = projects[0] // Staff Timetable System: tt-week, tt-staff

describe('ProjectCard', () => {
  it('shows stack, title and summary', () => {
    render(<ProjectCard project={project} onOpen={() => {}} />)
    const card = screen.getByRole('button', { name: 'Staff Timetable System — view screens' })
    expect(card).toHaveTextContent('Laravel · MySQL · Blade')
    expect(card).toHaveTextContent(project.short)
    expect(card).toHaveTextContent('View screens')
  })

  it('opens on click, Enter and Space', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<ProjectCard project={project} onOpen={onOpen} />)
    const card = screen.getByRole('button', { name: /view screens/ })

    await user.click(card)
    card.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onOpen).toHaveBeenCalledTimes(3)
    expect(onOpen.mock.calls[0][0]).toBe(project)
  })
})

describe('ProjectModal', () => {
  const setup = (props = {}) => {
    const onClose = vi.fn()
    const utils = render(<ProjectModal project={project} onClose={onClose} {...props} />)
    return { onClose, user: userEvent.setup(), ...utils }
  }

  it('is a labelled dialog with focus on Close', () => {
    setup()
    expect(screen.getByRole('dialog', { name: 'Staff Timetable System' })).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    expect(screen.getByText(project.desc)).toBeInTheDocument()
    expect(screen.getByText(`My role: ${project.role}`)).toBeInTheDocument()
  })

  it('switches screens with buttons and arrow keys', async () => {
    const { user } = setup()
    expect(screen.getByRole('button', { name: 'Weekly timetable' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Staff directory' }))
    expect(screen.getByRole('button', { name: 'Staff directory' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('dialog')).toHaveTextContent('amar.dev/work/tt-staff')

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('button', { name: 'Weekly timetable' })).toHaveAttribute('aria-pressed', 'true')
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Weekly timetable' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Next screen' }))
    expect(screen.getByRole('button', { name: 'Staff directory' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Previous screen' }))
    expect(screen.getByRole('button', { name: 'Weekly timetable' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches device', async () => {
    const { user } = setup()
    expect(screen.getByRole('button', { name: 'Desktop' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Phone' }))
    expect(screen.getByRole('button', { name: 'Phone' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('dialog')).not.toHaveTextContent('amar.dev/work/')
  })

  it('closes on Escape and backdrop click, not on clicks inside', async () => {
    const { user, onClose } = setup()
    await user.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
    await user.click(screen.getByTestId('dialog-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('traps focus inside the dialog', async () => {
    const { user } = setup()
    const close = screen.getByRole('button', { name: 'Close' })
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(screen.getByRole('button', { name: 'Next screen' })).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
  })

  it('restores focus and page scroll when it closes', () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    const { unmount } = render(<ProjectModal project={project} onClose={() => {}} returnFocusTo={opener} />)
    expect(document.documentElement.style.overflow).toBe('hidden')
    unmount()
    expect(document.documentElement.style.overflow).toBe('')
    expect(opener).toHaveFocus()
    opener.remove()
  })

  it('keeps page-scrolling keys inside the dialog', () => {
    setup()
    const dialog = screen.getByRole('dialog')
    dialog.scrollBy = vi.fn()
    for (const key of ['PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp']) {
      const notPrevented = fireEvent.keyDown(screen.getByRole('button', { name: 'Close' }), { key })
      expect(notPrevented).toBe(false)
    }
    expect(dialog.scrollBy).toHaveBeenCalled()
  })
})

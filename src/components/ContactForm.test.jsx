import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'

const ENDPOINT = 'https://formspree.io/f/abc'
const EMAIL = 'amar@example.com'

async function fill(user, { name = 'Ali bin Abu', email = 'ali@example.com', message = 'Hello, I have a role for you.' } = {}) {
  if (name) await user.type(screen.getByLabelText('Your name'), name)
  if (email) await user.type(screen.getByLabelText('Email'), email)
  if (message) await user.type(screen.getByLabelText('Message'), message)
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('shows the email instead of a form without an endpoint', () => {
    render(<ContactForm email={EMAIL} reducedMotion />)
    expect(screen.queryByRole('button', { name: /send message/i })).toBeNull()
    expect(screen.getByRole('link', { name: EMAIL })).toHaveAttribute('href', `mailto:${EMAIL}`)
  })

  it('shows errors, focuses the first invalid field and sends nothing', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactForm endpoint={ENDPOINT} email={EMAIL} reducedMotion />)

    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your email so I can reply.')).toBeInTheDocument()
    expect(screen.getByText('Please write a short message (at least 10 characters).')).toBeInTheDocument()
    const name = screen.getByLabelText('Your name')
    expect(name).toHaveFocus()
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(document.getElementById(name.getAttribute('aria-describedby'))).toHaveTextContent('Please enter your name.')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("clears a field's error when the visitor types in it", async () => {
    const user = userEvent.setup()
    render(<ContactForm endpoint={ENDPOINT} email={EMAIL} reducedMotion />)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    await user.type(screen.getByLabelText('Your name'), 'A')
    expect(screen.queryByText('Please enter your name.')).toBeNull()
    expect(screen.getByText('Please enter your email so I can reply.')).toBeInTheDocument()
  })

  it('thanks the visitor by first name and can reset', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    render(<ContactForm endpoint={ENDPOINT} email={EMAIL} reducedMotion />)
    await fill(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(await screen.findByText('Message sent')).toBeInTheDocument()
    expect(screen.getByText("Thanks, Ali. It's on its way, and I'll get back to you soon.")).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send another' }))
    expect(screen.getByLabelText('Your name')).toHaveValue('')
  })

  it('keeps the message and shows the email when sending fails', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<ContactForm endpoint={ENDPOINT} email={EMAIL} reducedMotion />)
    await fill(user)
    await user.click(screen.getByRole('button', { name: /send message/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Something went wrong. Please email me at')
    expect(screen.getByRole('link', { name: EMAIL })).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toHaveValue('Hello, I have a role for you.')
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled()
  })

  it('sends only one request when submitted twice', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn(() => new Promise(() => {}))
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactForm endpoint={ENDPOINT} email={EMAIL} reducedMotion />)
    await fill(user)
    const button = screen.getByRole('button', { name: /send message/i })
    await user.click(button)
    await user.click(button)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  describe('with the fold animation', () => {
    let animations
    beforeEach(() => {
      animations = []
      Element.prototype.animate = vi.fn(function () {
        const animation = { cancel: vi.fn(), onfinish: null }
        animations.push(animation)
        queueMicrotask(() => animation.onfinish?.())
        return animation
      })
    })
    afterEach(() => {
      delete Element.prototype.animate
    })

    it('waits for the request before saying thanks', async () => {
      const user = userEvent.setup()
      let resolve
      vi.stubGlobal('fetch', vi.fn(() => new Promise((r) => (resolve = r))))
      render(<ContactForm endpoint={ENDPOINT} email={EMAIL} />)
      await fill(user)
      await user.click(screen.getByRole('button', { name: /send message/i }))

      await new Promise((r) => setTimeout(r, 10))
      expect(animations.length).toBeGreaterThanOrEqual(2)
      expect(screen.queryByText('Message sent')).toBeNull()

      resolve({ ok: true })
      expect(await screen.findByText('Message sent')).toBeInTheDocument()
    })

    it('cancels the animation when sending fails', async () => {
      const user = userEvent.setup()
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
      render(<ContactForm endpoint={ENDPOINT} email={EMAIL} />)
      await fill(user)
      await user.click(screen.getByRole('button', { name: /send message/i }))

      await screen.findByRole('alert')
      for (const animation of animations) expect(animation.cancel).toHaveBeenCalled()
      expect(screen.getByLabelText('Your name')).toBeVisible()
    })
  })
})

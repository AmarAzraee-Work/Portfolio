import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'

const EMAIL = 'amar@example.com'

async function fillForm(user) {
  await user.type(screen.getByLabelText('name'), 'Ali')
  await user.type(screen.getByLabelText('email'), 'ali@example.com')
  await user.type(screen.getByLabelText('message'), 'Hello there')
}

describe('ContactForm', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('shows the email instead of a form when no Formspree ID is configured', () => {
    render(<ContactForm formId="" fallbackEmail={EMAIL} />)
    expect(screen.queryByRole('button', { name: /send/ })).toBeNull()
    expect(screen.getByRole('link', { name: EMAIL })).toHaveAttribute('href', `mailto:${EMAIL}`)
  })

  it('shows field errors and does not send when fields are empty', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactForm formId="abc123" fallbackEmail={EMAIL} />)

    await user.click(screen.getByRole('button', { name: /send/ }))

    expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your email.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a message.')).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toHaveAttribute('aria-invalid', 'true')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends, shows success and clears the form', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    render(<ContactForm formId="abc123" fallbackEmail={EMAIL} />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /send/ }))

    expect(await screen.findByText(/Message sent/)).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toHaveValue('')
  })

  it('shows the email as a fallback when sending fails', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<ContactForm formId="abc123" fallbackEmail={EMAIL} />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /send/ }))

    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: EMAIL })).toBeInTheDocument()
    expect(screen.getByLabelText('message')).toHaveValue('Hello there')
  })
})

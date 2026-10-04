import { validateContact, sendContact } from './contact'

describe('validateContact', () => {
  it('returns no errors for valid input', () => {
    expect(validateContact({ name: 'Ali', email: 'ali@example.com', message: 'Hi' })).toEqual({})
  })

  it('requires every field, ignoring whitespace', () => {
    const errors = validateContact({ name: '  ', email: '', message: ' ' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name'])
  })

  it('rejects a malformed email', () => {
    expect(validateContact({ name: 'Ali', email: 'ali@', message: 'Hi' })).toEqual({
      email: 'Please enter a valid email address.',
    })
  })
})

describe('sendContact', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('posts JSON to the Formspree endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    await sendContact('abc123', { name: 'Ali', email: 'ali@example.com', message: 'Hi' })
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://formspree.io/f/abc123')
    expect(options.method).toBe('POST')
    expect(options.headers.Accept).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({ name: 'Ali', email: 'ali@example.com', message: 'Hi' })
  })

  it('rejects when Formspree returns an error status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 422 }))
    await expect(sendContact('abc123', {})).rejects.toThrow('422')
  })
})

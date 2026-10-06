import { validateContact, sendContact } from './contact'

const valid = { name: 'Ali', email: 'ali@example.com', message: 'Hello, I have a role for you.' }

describe('validateContact', () => {
  it('accepts valid input', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('explains each problem', () => {
    expect(validateContact({ ...valid, name: '  ' }).name).toBe('Please enter your name.')
    expect(validateContact({ ...valid, email: '' }).email).toBe('Please enter your email so I can reply.')
    expect(validateContact({ ...valid, email: 'ali@' }).email).toBe('That email looks incomplete — check for a missing @ or domain.')
    expect(validateContact({ ...valid, message: 'too short' }).message).toBe('Please write a short message (at least 10 characters).')
  })

  it('accepts a message of exactly 10 characters', () => {
    expect(validateContact({ ...valid, message: '0123456789' })).toEqual({})
  })
})

describe('sendContact', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('posts JSON to the endpoint with a timeout signal', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    await sendContact('https://formspree.io/f/abc', valid)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://formspree.io/f/abc')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(options.headers.Accept).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual(valid)
    expect(options.signal).toBeInstanceOf(AbortSignal)
  })

  it('rejects on an error status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 422 }))
    await expect(sendContact('https://formspree.io/f/abc', valid)).rejects.toThrow('422')
  })

  it('rejects when the request takes too long', async () => {
    vi.stubGlobal(
      'fetch',
      (_url, options) => new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason))),
    )
    await expect(sendContact('https://formspree.io/f/abc', valid, { timeoutMs: 20 })).rejects.toBeDefined()
  })
})

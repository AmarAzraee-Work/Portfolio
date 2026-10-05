import { GLYPHS, scrambleDuration, scrambleFrame } from './scramble'

describe('scrambleFrame', () => {
  it('returns the original text when finished', () => {
    expect(scrambleFrame('Hi there', 1)).toBe('Hi there')
  })

  it('scrambles every non-space character at the start and keeps spaces', () => {
    const out = scrambleFrame('Hi there', 0)
    expect(out[2]).toBe(' ')
    for (const [i, c] of [...out].entries()) {
      if (i !== 2) expect(GLYPHS).toContain(c)
    }
  })

  it('keeps the same length', () => {
    for (const k of [0, 0.3, 0.6, 1]) expect(scrambleFrame('Where I have been', k)).toHaveLength(17)
  })

  it('uses the random source to pick glyphs', () => {
    expect(scrambleFrame('ab', 0, () => 0)).toBe('!!')
  })
})

describe('scrambleDuration', () => {
  it('grows with the text length', () => {
    expect(scrambleDuration(10)).toBe(540)
  })
})

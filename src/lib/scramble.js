// The "decoding" text effect from the design: characters settle left to right.

export const GLYPHS = '!<>-_/[]{}=+*^?#01'

export function scrambleDuration(len) {
  return 380 + len * 16
}

// k is progress from 0 to 1; character i settles once k passes (i / len) * 0.7 + 0.3.
export function scrambleFrame(text, k, rand = Math.random) {
  const len = text.length
  let out = ''
  for (let i = 0; i < len; i++) {
    const c = text[i]
    out += c === ' ' || k >= (i / len) * 0.7 + 0.3 ? c : GLYPHS[Math.floor(rand() * GLYPHS.length)]
  }
  return out
}

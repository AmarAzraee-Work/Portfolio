// Pure maths behind the cube page, taken from the design's animation loop so it can be tested.

export function easeInOutCubic(f) {
  return f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2
}

// Turns the page scroll position into the cube's pose.
// pos: fractional face index (eased), active: the face nearest to the front, rest: exactly on a face.
export function cubeState(scrollY, vh, n = 5) {
  const p = Math.min(n - 1, Math.max(0, scrollY / vh))
  const s = Math.min(n - 2, Math.floor(p))
  const e = easeInOutCubic(p - s)
  const pos = s + e
  return { pos, active: Math.round(pos), s, e, rest: Math.abs(pos - Math.round(pos)) < 1e-4 }
}

// How dark a face gets as it turns away (off = distance in faces from the front).
export function faceShade(off) {
  return off < 1 ? (1 - Math.cos((off * Math.PI) / 2)) * 0.75 : 0
}

export function navKeyAction({ key, shiftKey, paused, inField }) {
  if (paused || inField) return null
  if (key === 'PageDown' || key === 'ArrowDown' || (key === ' ' && !shiftKey)) return 'next'
  if (key === 'PageUp' || key === 'ArrowUp' || (key === ' ' && shiftKey)) return 'prev'
  if (key === 'Home') return 'first'
  if (key === 'End') return 'last'
  return null
}

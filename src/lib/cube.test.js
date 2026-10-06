import { easeInOutCubic, cubeState, faceShade, navKeyAction } from './cube'

describe('easeInOutCubic', () => {
  it('starts at 0, ends at 1 and is symmetric at the midpoint', () => {
    expect(easeInOutCubic(0)).toBe(0)
    expect(easeInOutCubic(1)).toBe(1)
    expect(easeInOutCubic(0.5)).toBe(0.5)
    expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625, 6)
  })
})

describe('cubeState', () => {
  it('rests on the first face at the top', () => {
    expect(cubeState(0, 800)).toMatchObject({ pos: 0, active: 0, rest: true })
  })

  it('is half-way between faces at half a viewport', () => {
    const state = cubeState(400, 800)
    expect(state.pos).toBe(0.5)
    expect(state.active).toBe(1)
    expect(state.rest).toBe(false)
  })

  it('rests on the second face after one viewport', () => {
    expect(cubeState(800, 800)).toMatchObject({ pos: 1, active: 1, rest: true })
  })

  it('uses the last segment near the end', () => {
    const state = cubeState(2960, 800)
    expect(state.s).toBe(3)
    expect(state.active).toBe(4)
  })

  it('clamps beyond the last face and above the top', () => {
    expect(cubeState(99999, 800)).toMatchObject({ pos: 4, active: 4 })
    expect(cubeState(-50, 800).pos).toBe(0)
  })
})

describe('faceShade', () => {
  it('is clear on the face and one face away', () => {
    expect(faceShade(0)).toBe(0)
    expect(faceShade(1)).toBe(0)
  })

  it('darkens faces turning away', () => {
    expect(faceShade(0.5)).toBeCloseTo(0.2197, 3)
  })
})

describe('navKeyAction', () => {
  const key = (k, extra = {}) => navKeyAction({ key: k, shiftKey: false, paused: false, inField: false, ...extra })

  it('maps paging keys', () => {
    expect(key('PageDown')).toBe('next')
    expect(key('ArrowDown')).toBe('next')
    expect(key(' ')).toBe('next')
    expect(key('PageUp')).toBe('prev')
    expect(key('ArrowUp')).toBe('prev')
    expect(key(' ', { shiftKey: true })).toBe('prev')
    expect(key('Home')).toBe('first')
    expect(key('End')).toBe('last')
  })

  it('ignores other keys', () => {
    expect(key('a')).toBeNull()
  })

  it('ignores keys while paused or typing in a field', () => {
    expect(key('PageDown', { paused: true })).toBeNull()
    expect(key('PageDown', { inField: true })).toBeNull()
  })
})

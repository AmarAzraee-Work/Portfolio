import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cubeState, faceShade, navKeyAction } from '../lib/cube'

const WIDE = 860
const reducedMotionQuery = () =>
  typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

const isTyping = (target) => target instanceof Element && !!target.closest('input, textarea, select, [contenteditable="true"]')
const isPressing = (event) => event.key === ' ' && event.target instanceof Element && !!event.target.closest('button, a, [role="button"]')

/**
 * The cube page engine (from the design's layout/frame/drag code).
 * The page is really a tall scroll area (the spacer); every animation frame we read scrollY and
 * turn the cube to match. In flat mode (reduced motion) the faces are just stacked sections.
 */
export function useCubeScroll({ stageRef, cubeRef, spacerRef, count = 5, paused = false }) {
  const [mode, setMode] = useState(() => (reducedMotionQuery()?.matches ? 'flat' : 'cube'))
  const [wide, setWide] = useState(() => window.innerWidth >= WIDE)
  const [active, setActive] = useState(0)

  // Mutable values the animation loop reads every frame; kept in a ref so they never trigger renders.
  const s = useRef({ faces: [], shades: [], faceT: [], D: 0, drag: null, snapTimer: 0, mouse: { x: 0, y: 0 }, tilt: { x: 0, y: 0 }, active: 0 })
  const live = useRef({ mode, wide, paused })
  live.current = { mode, wide, paused }

  const snapOn = useCallback(() => {
    document.documentElement.style.scrollSnapType = live.current.mode === 'flat' ? 'none' : 'y mandatory'
  }, [])

  const layout = useCallback(() => {
    const stage = stageRef.current
    const cube = cubeRef.current
    const spacer = spacerRef.current
    if (!stage || !cube || !spacer) return
    const st = s.current
    st.faces = [...cube.querySelectorAll('[data-face]')]
    st.shades = st.faces.map((face) => face.querySelector('[data-shade]'))
    setWide(window.innerWidth >= WIDE)

    if (live.current.mode === 'flat') {
      Object.assign(stage.style, { position: 'relative', height: 'auto', perspective: 'none', cursor: 'auto', touchAction: '' })
      Object.assign(cube.style, { position: 'relative', transform: 'none', height: 'auto' })
      st.faces.forEach((face) =>
        Object.assign(face.style, { position: 'relative', transform: 'none', visibility: 'visible', height: 'auto', minHeight: '100vh', overflow: 'visible' }),
      )
      st.shades.forEach((shade) => shade && (shade.style.opacity = 0))
      spacer.style.display = 'none'
    } else {
      const H = window.innerHeight
      st.D = H
      Object.assign(stage.style, { position: 'fixed', height: '100%', perspective: `${Math.max(1400, H * 1.8)}px`, cursor: 'grab', touchAction: '' })
      Object.assign(cube.style, { position: 'absolute', height: '100%' })
      st.faceT = st.faces.map((_, i) => `rotateX(${-i * 90}deg) translateZ(${H / 2}px)`)
      st.faces.forEach((face, i) =>
        Object.assign(face.style, { position: 'absolute', height: '100%', minHeight: '0', overflow: 'hidden auto', transform: st.faceT[i] }),
      )
      spacer.style.display = 'block'
      // Snap points must sit at multiples of the height the cube maths uses. On phones 100vh is taller than
      // the visible area while the browser toolbar shows, so size the track from innerHeight instead.
      ;[...spacer.children].forEach((block) => (block.style.height = `${H}px`))
    }
    snapOn()
  }, [stageRef, cubeRef, spacerRef, snapOn])

  // One animation frame: turn the cube to match the scroll position, shade turning faces, ease the tilt.
  const frame = useCallback(() => {
    const st = s.current
    const cube = cubeRef.current
    if (!cube || st.faces.length === 0) return
    const { mode: m, wide: w, paused: p } = live.current
    const tiltOn = !p && w && m !== 'flat' && !st.drag
    st.tilt.x += ((tiltOn ? st.mouse.x : 0) - st.tilt.x) * 0.06
    st.tilt.y += ((tiltOn ? st.mouse.y : 0) - st.tilt.y) * 0.06

    let next
    if (m === 'flat') {
      next = 0
      st.faces.forEach((face, i) => {
        if (face.getBoundingClientRect().top < window.innerHeight * 0.5) next = i
      })
    } else {
      const { pos, e, rest, active: a } = cubeState(window.scrollY, window.innerHeight, count)
      const dip = Math.sin(Math.PI * e)
      const tiltT = `rotateX(${(-st.tilt.y * 2.2).toFixed(3)}deg) rotateY(${(st.tilt.x * 3).toFixed(3)}deg)`
      cube.style.transform = rest ? tiltT : `${tiltT} translateZ(${-st.D / 2 - dip * st.D * 0.5}px) rotateX(${pos * 90}deg)`
      st.faces.forEach((face, i) => {
        face.style.transform = rest && i === a ? 'none' : st.faceT[i]
        const off = Math.abs(i - pos)
        face.style.visibility = off < 0.999 ? 'visible' : 'hidden'
        const shade = st.shades[i]
        if (shade) shade.style.opacity = faceShade(off)
      })
      next = a
    }
    if (next !== st.active) {
      st.active = next
      setActive(next)
    }
  }, [cubeRef, count])

  const goTo = useCallback(
    (i) => {
      const target = Math.max(0, Math.min(count - 1, i))
      const behavior = live.current.mode === 'flat' ? 'auto' : 'smooth'
      if (live.current.mode === 'flat') {
        const face = s.current.faces[target]
        if (face) window.scrollTo({ top: face.getBoundingClientRect().top + window.scrollY, behavior })
      } else {
        window.scrollTo({ top: target * window.innerHeight, behavior })
      }
    },
    [count],
  )

  // Follow the reduced-motion setting live.
  useEffect(() => {
    const query = reducedMotionQuery()
    if (!query) return undefined
    const onChange = () => setMode(query.matches ? 'flat' : 'cube')
    query.addEventListener?.('change', onChange)
    return () => query.removeEventListener?.('change', onChange)
  }, [])

  // Layout before paint so faces never flash in the wrong place; redo it when the mode changes.
  useLayoutEffect(() => {
    layout()
    frame()
  }, [layout, frame, mode])

  useEffect(() => {
    const st = s.current
    const stage = stageRef.current
    let raf = 0
    const loop = () => {
      frame()
      raf = window.requestAnimationFrame(loop)
    }
    raf = window.requestAnimationFrame(loop)

    const onResize = () => layout()
    const onMouse = (event) => {
      st.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      st.mouse.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    const onKey = (event) => {
      const action = navKeyAction({ key: event.key, shiftKey: event.shiftKey, paused: live.current.paused, inField: isTyping(event.target) || isPressing(event) })
      if (!action) return
      event.preventDefault()
      // A face taller than the screen scrolls first; the cube turns once the face reaches its edge.
      const face = live.current.mode === 'cube' ? st.faces[st.active] : null
      if (face && (action === 'next' || action === 'prev')) {
        const room = action === 'next' ? face.scrollHeight - face.clientHeight - face.scrollTop : face.scrollTop
        if (room > 1) {
          const step = event.key.startsWith('Arrow') ? 60 : face.clientHeight * 0.8
          face.scrollBy?.({ top: action === 'next' ? step : -step, behavior: 'smooth' })
          return
        }
      }
      const from = st.active
      goTo({ next: from + 1, prev: from - 1, first: 0, last: count - 1 }[action])
    }

    // Drag to turn (mouse or pen; vertical touch uses normal scrolling).
    const onDown = (event) => {
      if (live.current.mode === 'flat' || live.current.paused || event.button !== 0) return
      if (event.pointerType === 'touch') return
      if (event.target.closest('a,button,input,textarea,select,label,form,[role=button],[data-nodrag]')) return
      st.drag = { y: event.clientY, startY: window.scrollY, d: 0 }
      window.clearTimeout(st.snapTimer)
      document.documentElement.style.scrollSnapType = 'none'
      stage.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    }
    const onMove = (event) => {
      const drag = st.drag
      if (!drag) return
      drag.d = event.clientY - drag.y
      const k = window.innerHeight / (0.6 * st.D)
      window.scrollTo(0, Math.max(0, Math.min((count - 1) * window.innerHeight, drag.startY - drag.d * k)))
    }
    const onUp = () => {
      const drag = st.drag
      if (!drag) return
      st.drag = null
      stage.style.cursor = 'grab'
      document.body.style.userSelect = ''
      const vh = window.innerHeight
      const start = Math.round(drag.startY / vh)
      let target = Math.abs(drag.d) > 50 ? start + (drag.d < 0 ? 1 : -1) : Math.round(window.scrollY / vh)
      target = Math.max(0, Math.min(count - 1, target))
      window.scrollTo({ top: target * vh, behavior: 'smooth' })
      st.snapTimer = window.setTimeout(snapOn, 900)
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    stage?.addEventListener('pointerdown', onDown)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(st.snapTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      stage?.removeEventListener('pointerdown', onDown)
      document.documentElement.style.scrollSnapType = ''
      document.documentElement.style.overflow = ''
      document.body.style.userSelect = ''
    }
  }, [stageRef, frame, layout, goTo, snapOn, count])

  return { active, goTo, mode, wide }
}

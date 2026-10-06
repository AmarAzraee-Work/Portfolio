import { useEffect, useRef } from 'react'
import { Briefcase, HandGrabbing, House, PaperPlaneTilt, Path, User } from '@phosphor-icons/react'

// Faces in the order the design places them: front, right, back, left, top. The bottom shows </>.
const FACES = [
  { section: 1, label: 'Work', Icon: Briefcase, transform: 'translateZ(100px)' },
  { section: 2, label: 'About', Icon: User, transform: 'rotateY(90deg) translateZ(100px)' },
  { section: 3, label: 'Experience', Icon: Path, transform: 'rotateY(180deg) translateZ(100px)' },
  { section: 4, label: 'Contact', Icon: PaperPlaneTilt, transform: 'rotateY(-90deg) translateZ(100px)' },
  { section: 0, label: 'Home', Icon: House, transform: 'rotateX(90deg) translateZ(100px)' },
]

const faceStyle = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  border: '1px solid var(--color-accent-500)',
  borderRadius: 'var(--radius-md)',
  background: 'color-mix(in srgb, var(--color-accent-900) 82%, transparent)',
  color: 'var(--color-accent-200)',
  font: 'inherit',
  fontSize: '15px',
  fontWeight: 500,
  cursor: 'pointer',
  padding: 0,
  transition: 'background .2s, border-color .2s',
}

// The spinning cube in the hero: idles slowly, can be dragged with inertia, and a face click jumps to a section.
export default function MiniCube({ onNavigate, reducedMotion = false }) {
  const cubeRef = useRef(null)
  const m = useRef({ rx: -22, ry: 30, vx: 0, vy: reducedMotion ? 0 : 0.25, drag: null, dragged: false })

  useEffect(() => {
    const st = m.current
    let raf = 0
    const loop = () => {
      if (!st.drag) {
        st.vx *= 0.94
        st.vy = reducedMotion ? st.vy * 0.94 : st.vy * 0.94 + 0.25 * 0.06
        st.rx += st.vx
        st.ry += st.vy
        // Ease the tilt back to the resting angle once it stops spinning on X.
        if (Math.abs(st.vx) < 0.05) {
          const r = ((((st.rx + 22) % 360) + 540) % 360) - 180
          st.rx = -22 + r * 0.97
        }
      }
      if (cubeRef.current) cubeRef.current.style.transform = `rotateX(${st.rx}deg) rotateY(${st.ry}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (event) => {
      const drag = st.drag
      if (!drag) return
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      drag.x = event.clientX
      drag.y = event.clientY
      drag.moved += Math.abs(dx) + Math.abs(dy)
      st.ry += dx * 0.6
      st.rx -= dy * 0.6
      st.vy = dx * 0.6
      st.vx = -dy * 0.6
    }
    const onUp = () => {
      if (!st.drag) return
      st.dragged = st.drag.moved > 6
      st.drag = null
      setTimeout(() => {
        st.dragged = false
      }, 0)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [reducedMotion])

  const onDown = (event) => {
    event.stopPropagation()
    m.current.drag = { x: event.clientX, y: event.clientY, moved: 0 }
  }
  const go = (section) => () => {
    if (!m.current.dragged) onNavigate(section)
  }

  return (
    <div style={{ height: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-90px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 26%, transparent), transparent 65%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        />
        <div
          data-nodrag=""
          onPointerDown={onDown}
          style={{ position: 'relative', width: '200px', height: '200px', perspective: '900px', cursor: 'grab', touchAction: 'none', userSelect: 'none' }}
        >
          <div ref={cubeRef} style={{ position: 'relative', width: '200px', height: '200px', transformStyle: 'preserve-3d' }}>
            {FACES.map(({ section, label, Icon, transform }) => (
              <button key={label} type="button" className="mini-face" onClick={go(section)} style={{ ...faceStyle, transform }}>
                <Icon aria-hidden="true" style={{ fontSize: '32px', color: 'var(--color-accent-300)' }} />
                {label}
              </button>
            ))}
            <div
              aria-hidden="true"
              style={{
                ...faceStyle,
                transform: 'rotateX(-90deg) translateZ(100px)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'default',
                font: '500 30px ui-monospace,Menlo,monospace',
                color: 'var(--color-accent-300)',
              }}
            >
              &lt;/&gt;
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-neutral-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <HandGrabbing aria-hidden="true" style={{ fontSize: '16px', color: 'var(--color-accent)' }} />
        Drag to spin · tap a face to jump
      </div>
    </div>
  )
}

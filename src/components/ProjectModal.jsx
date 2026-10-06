import { useEffect, useId, useRef, useState } from 'react'
import { CaretLeft, CaretRight, Desktop, DeviceMobile, DeviceTablet, X } from '@phosphor-icons/react'
import DeviceFrame from './DeviceFrame'

const DEVICES = [
  ['desktop', 'Desktop', Desktop],
  ['tablet', 'Tablet', DeviceTablet],
  ['phone', 'Phone', DeviceMobile],
]

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const segStyle = (on) => ({
  border: 0,
  background: 'transparent',
  color: on ? 'var(--color-accent)' : 'var(--color-text)',
  boxShadow: on ? 'inset 0 0 0 1px var(--color-accent)' : undefined,
  font: 'inherit',
  fontSize: '13px',
  cursor: on ? undefined : 'pointer',
})

export default function ProjectModal({ project, onClose, returnFocusTo }) {
  const [shot, setShot] = useState(0)
  const [device, setDevice] = useState('desktop')
  const [previewW, setPreviewW] = useState(900)
  const dialogRef = useRef(null)
  const previewRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()

  const count = project.screens.length
  const step = (d) => setShot((s) => (s + d + count) % count)
  const current = project.screens[Math.min(shot, count - 1)]
  const previewH = Math.round(Math.max(240, Math.min(previewW * 0.6, window.innerHeight * 0.58)))

  // Lock page scroll and move focus in; on close, restore both.
  useEffect(() => {
    const html = document.documentElement
    html.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      html.style.overflow = ''
      returnFocusTo?.focus()
    }
  }, [returnFocusTo])

  useEffect(() => {
    const el = previewRef.current
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      if (width) setPreviewW(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      // Keys that would scroll the page behind the dialog scroll the dialog instead.
      const page = { PageDown: 0.8, PageUp: -0.8, ArrowDown: 0.1, ArrowUp: -0.1, Home: -Infinity, End: Infinity }[event.key]
      if (page !== undefined) {
        event.preventDefault()
        const dialog = dialogRef.current
        const top = Number.isFinite(page) ? dialog.clientHeight * page : page * 1e6
        dialog.scrollBy?.({ top })
        return
      }
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') step(1)
      else if (event.key === 'ArrowLeft') step(-1)
      else if (event.key === 'Tab') {
        // Keep Tab inside the dialog (screens are inert, so their mock controls are skipped).
        const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter((el) => !el.closest('[inert]'))
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="dialog-backdrop" data-testid="dialog-backdrop" onClick={onClose} style={{ zIndex: 50, backdropFilter: 'blur(6px)' }}>
      <div
        ref={dialogRef}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        style={{ width: 'min(1120px,100%)', maxHeight: 'calc(100vh - 24px)', overflow: 'auto', padding: 'clamp(16px,2.4vw,28px)', gap: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
            <span className="card-kicker">{project.stack}</span>
            <span id={titleId} className="dialog-title" style={{ fontSize: 'clamp(22px,2.6vw,30px)', letterSpacing: '-.02em' }}>
              {project.title}
            </span>
          </div>
          <button ref={closeRef} className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Close">
            <X aria-hidden="true" style={{ fontSize: '18px' }} />
          </button>
        </div>
        <p className="dialog-body" style={{ margin: 0, maxWidth: '720px', textWrap: 'pretty' }}>
          {project.desc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <div className="seg">
            {project.screens.map((s, i) => (
              <button key={s.id} type="button" className="seg-opt" aria-pressed={i === shot} onClick={() => setShot(i)} style={segStyle(i === shot)}>
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div className="seg">
            {DEVICES.map(([id, label, Icon]) => (
              <button key={id} type="button" className="seg-opt" aria-pressed={id === device} onClick={() => setDevice(id)} style={segStyle(id === device)}>
                <Icon aria-hidden="true" style={{ fontSize: '16px' }} />
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="button" className="btn btn-secondary btn-icon" onClick={() => step(-1)} aria-label="Previous screen">
              <CaretLeft aria-hidden="true" />
            </button>
            <button type="button" className="btn btn-secondary btn-icon" onClick={() => step(1)} aria-label="Next screen">
              <CaretRight aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          ref={previewRef}
          style={{
            position: 'relative',
            height: `${previewH}px`,
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            borderRadius: 'var(--radius-md)',
            background: 'radial-gradient(ellipse at 50% 60%, var(--color-accent-900), var(--color-bg) 75%)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <DeviceFrame device={device} screen={current.id} image={current.image} width={previewW} height={previewH} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '13px', color: 'var(--color-neutral-400)' }}>
          <span style={{ paddingRight: '4px' }}>My role: {project.role}</span>
          {project.tags.map((tag) => (
            <span key={tag} className="tag tag-neutral">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

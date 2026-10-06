import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { ProjectScreen } from '../screens'

// Live-rendered thumbnail of the first screen: the 1280×800 mock-up is scaled to the card width.
function Thumbnail({ screen }) {
  const ref = useRef(null)
  const [scale, setScale] = useState(0.25)

  useEffect(() => {
    const el = ref.current
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      if (width) setScale(width / 1280)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        transform: 'translateZ(22px)',
        position: 'relative',
        aspectRatio: '1280/800',
        overflow: 'hidden',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1280px',
          height: '800px',
          transformOrigin: '0 0',
          transform: `scale(${scale})`,
          pointerEvents: 'none',
        }}
      >
        {screen.image ? (
          <img src={screen.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        ) : (
          <ProjectScreen screen={screen.id} />
        )}
      </div>
    </div>
  )
}

// Mouse-only 3D tilt and glare, as in the design's cardTilt / cardReset.
function tilt(event) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget
  const r = el.getBoundingClientRect()
  const x = (event.clientX - r.left) / r.width
  const y = (event.clientY - r.top) / r.height
  el.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 10).toFixed(2)}deg) rotateY(${((x - 0.5) * 12).toFixed(2)}deg)`
  el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
  el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  el.style.setProperty('--glare', '1')
}

function untilt(event) {
  const el = event.currentTarget
  el.style.transform = ''
  el.style.setProperty('--glare', '0')
}

export default function ProjectCard({ project, onOpen }) {
  const open = (event) => onOpen(project, event.currentTarget)

  return (
    <div
      className="card elev-sm project-card"
      role="button"
      tabIndex={0}
      aria-label={`${project.title} — view screens`}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault() // stop Space from scrolling the page
          open(event)
        }
      }}
      onPointerMove={tilt}
      onPointerLeave={untilt}
      style={{
        position: 'relative',
        cursor: 'pointer',
        padding: '10px 10px 16px',
        gap: '12px',
        transformStyle: 'preserve-3d',
        transition: 'box-shadow .2s, transform .18s ease-out',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 55%)',
          opacity: 'var(--glare,0)',
          transition: 'opacity .25s',
        }}
      />
      <Thumbnail screen={project.screens[0]} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 6px' }}>
        <span className="card-kicker">{project.stack}</span>
        <span className="card-title">{project.title}</span>
        <p className="card-body" style={{ textWrap: 'pretty' }}>
          {project.short}
        </p>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-accent)', paddingTop: '4px' }}>
          View screens
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </div>
  )
}

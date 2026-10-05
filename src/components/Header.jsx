import { Cube } from '@phosphor-icons/react'

export default function Header({ name, labels, active, wide, onNavigate, onContact }) {
  const go = (i) => (event) => {
    event.preventDefault()
    onNavigate(i)
  }

  return (
    <header
      className="nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        gap: 'clamp(14px,2.4vw,28px)',
        padding: '18px clamp(20px,6vw,96px)',
        minHeight: '72px', // the removed 36px sound button used to set this height
        boxSizing: 'border-box',
        background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-bg) 85%, transparent), transparent)',
      }}
    >
      <a href="#" onClick={go(0)} className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px' }}>
        <Cube aria-hidden="true" style={{ color: 'var(--color-accent)', fontSize: '20px' }} />
        {name}
      </a>
      {wide &&
        labels.map((label, i) => (
          <a key={label} href="#" onClick={go(i)} aria-current={i === active ? 'page' : undefined}>
            {label}
          </a>
        ))}
      {/* The design's sound toggle sat here; sound was removed, so this button takes its auto margin. */}
      <button className="btn btn-primary" onClick={onContact} style={{ marginLeft: 'auto' }}>
        Say hello
      </button>
    </header>
  )
}

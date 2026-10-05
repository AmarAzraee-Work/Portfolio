const pad = (n) => String(n).padStart(2, '0')

// Bottom-left "01 / 05 Home". Hidden from screen readers: SectionIndicator already announces the active section.
export default function SectionCounter({ active, total, label }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 'clamp(20px,6vw,96px)',
        bottom: '20px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        fontSize: '12px',
        color: 'var(--color-neutral-500)',
        pointerEvents: 'none',
      }}
    >
      <span style={{ font: '500 13px ui-monospace,Menlo,monospace', color: 'var(--color-accent)' }}>{pad(active + 1)}</span>
      <span>/ {pad(total)}</span>
      <span style={{ paddingLeft: '6px' }}>{label}</span>
    </div>
  )
}

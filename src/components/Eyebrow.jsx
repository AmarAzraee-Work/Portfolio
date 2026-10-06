// The small accent label above each face's heading ("Selected work", "About me"…).
export default function Eyebrow({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: 'var(--color-accent)',
      }}
    >
      <span style={{ width: '24px', height: '1px', background: 'var(--color-accent)' }} />
      {children}
    </div>
  )
}

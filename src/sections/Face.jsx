// One face of the cube. useCubeScroll positions faces by their data-face index; the shade darkens a face as it turns away.
const FACE_BG = 'linear-gradient(165deg, color-mix(in srgb, var(--color-surface) 70%, var(--color-bg)), var(--color-bg) 65%)'

export default function Face({ index, label, labelledBy, background = FACE_BG, inner, children }) {
  return (
    <section
      data-face={index}
      data-screen-label={`0${index + 1} ${label}`}
      aria-labelledby={labelledBy}
      style={{
        position: 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        overflow: 'hidden auto',
        background,
        boxShadow: 'inset 0 0 0 1px var(--color-divider)',
      }}
    >
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(84px,12vh,120px) clamp(20px,6vw,96px) clamp(56px,9vh,88px)',
          maxWidth: '1360px',
          boxSizing: 'border-box',
          ...inner,
        }}
      >
        {children}
      </div>
      <div data-shade="" style={{ position: 'absolute', inset: 0, background: 'var(--color-bg)', opacity: 0, pointerEvents: 'none' }} />
    </section>
  )
}

// Right-edge section markers: small chevrons, with the active section shown as a longer glowing arrow.
// Icons shrink below 860px so they stay out of the way on phones.
export default function SectionIndicator({ labels, active, onNavigate }) {
  return (
    <nav
      aria-label="Sections"
      // Hugs the screen edge on phones so it never overlaps content; the design's spacing from 860px up.
      className="right-1 min-[860px]:right-[clamp(10px,2vw,28px)]"
      style={{
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {labels.map((label, i) => {
        const on = i === active
        return (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-current={on ? 'true' : undefined}
            onClick={() => onNavigate(i)}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '36px',
              height: '22px',
              padding: 0,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {on ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 22 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[15px] w-[18px] min-[860px]:h-[18px] min-[860px]:w-[22px]"
                style={{ color: 'var(--color-accent)', filter: 'drop-shadow(0 0 5px var(--color-accent))' }}
              >
                <path d="M21 9H3M8 3L2 9l6 6" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[12px] w-[12px] min-[860px]:h-[14px] min-[860px]:w-[14px]"
                style={{ color: 'var(--color-neutral-700)' }}
              >
                <path d="M9 3L5 7l4 4" />
              </svg>
            )}
          </button>
        )
      })}
    </nav>
  )
}

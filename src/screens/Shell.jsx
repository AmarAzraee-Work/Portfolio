import { Ph } from './icons'

// Frames from ProjectScreen.dc.html. `inert` + aria-hidden: the screens are pictures, so their
// mock buttons and inputs must not be focusable or announced.
const base = {
  overflow: 'hidden',
  position: 'relative',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  lineHeight: '1.45',
}

export function DesktopShell({ children }) {
  return (
    <div aria-hidden="true" inert style={{ ...base, width: '1280px', height: '800px' }}>
      {children}
    </div>
  )
}

export function PhoneShell({ children }) {
  return (
    <div aria-hidden="true" inert style={{ ...base, width: '390px', height: '844px', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          height: '46px',
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 28px 0',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        <span>9:41</span>
        <span style={{ display: 'flex', gap: '5px', fontSize: '15px' }}>
          <Ph name="cell-signal-full" />
          <Ph name="wifi-high" />
          <Ph name="battery-full" />
        </span>
      </div>
      {children}
    </div>
  )
}

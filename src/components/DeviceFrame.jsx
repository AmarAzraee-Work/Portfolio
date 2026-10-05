import { ProjectScreen } from '../screens'

// Frame sizes from the design: [frame width, frame height] in CSS pixels before scaling.
const FRAME = { desktop: [1280, 830], tablet: [1316, 836], phone: [414, 868] }
const EASE = '.45s cubic-bezier(.4,0,.2,1)'

function Shot({ screen, image, device }) {
  if (image) return <img src={image} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
  return <ProjectScreen screen={screen} device={device} />
}

const dot = { width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-neutral-700)' }

// Shows a project screen in a desktop browser, tablet or phone frame, scaled to fit width × height.
export default function DeviceFrame({ device = 'desktop', screen, image, width, height }) {
  const [fw, fh] = FRAME[device]
  const scale = Math.min((width - 40) / fw, (height - 40) / fh)

  let frame
  if (device === 'desktop') {
    frame = (
      <div style={{ width: '1280px', height: '830px', borderRadius: '12px', overflow: 'hidden', background: 'var(--color-surface)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ height: '30px', display: 'flex', alignItems: 'center', gap: '7px', padding: '0 14px' }}>
          <span style={dot} />
          <span style={dot} />
          <span style={dot} />
          <span style={{ margin: '0 auto', padding: '3px 60px', borderRadius: '6px', background: 'var(--color-bg)', fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            amar.dev/work/{screen}
          </span>
        </div>
        <div style={{ width: '1280px', height: '800px' }}>
          <Shot screen={screen} image={image} device="desktop" />
        </div>
      </div>
    )
  } else if (device === 'tablet') {
    frame = (
      <div
        style={{
          width: '1316px',
          height: '836px',
          borderRadius: '40px',
          padding: '18px',
          boxSizing: 'border-box',
          background: 'var(--color-neutral-900)',
          boxShadow: '0 0 0 2px var(--color-neutral-800), var(--shadow-lg)',
        }}
      >
        <div style={{ width: '1280px', height: '800px', borderRadius: '20px', overflow: 'hidden' }}>
          <Shot screen={screen} image={image} device="desktop" />
        </div>
      </div>
    )
  } else {
    frame = (
      <div
        style={{
          width: '414px',
          height: '868px',
          borderRadius: '58px',
          padding: '12px',
          boxSizing: 'border-box',
          background: 'var(--color-neutral-900)',
          boxShadow: '0 0 0 2px var(--color-neutral-800), var(--shadow-lg)',
        }}
      >
        <div style={{ position: 'relative', width: '390px', height: '844px', borderRadius: '46px', overflow: 'hidden' }}>
          <Shot screen={screen} image={image} device="phone" />
          <div style={{ position: 'absolute', top: '10px', left: '50%', width: '112px', height: '32px', marginLeft: '-56px', borderRadius: '18px', background: 'var(--color-neutral-900)' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: `${Math.round(fw * scale)}px`, height: `${Math.round(fh * scale)}px`, transition: `width ${EASE}, height ${EASE}` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, transformOrigin: '0 0', transform: `scale(${scale})`, transition: `transform ${EASE}` }}>{frame}</div>
    </div>
  )
}

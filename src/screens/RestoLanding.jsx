import { Fragment } from 'react'
import { Ph } from './icons'
import { DesktopShell, PhoneShell } from './Shell'
import { dishes } from './sampleData'

// Ported from docs/design-handoff-v2/ProjectScreen.dc.html. Decorative mock-up: the shell sets aria-hidden.

function Desktop() {
  return (
    <>
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="nav" style={{ padding: '20px 56px' }}>
        <span className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ph name="moon-stars" style={{ color: 'var(--color-accent)' }} />
          Dapur Senja
        </span>
        <a href="#">
          Menu
        </a>
        <a href="#">
          Our story
        </a>
        <a href="#">
          Visit
        </a>
        <button className="btn btn-primary">
          Book a table
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: '48px', padding: '24px 56px 0', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <span style={{ fontSize: '12px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            Malay kitchen · Open late
          </span>
          <h1 style={{ fontSize: '58px', margin: '0', textWrap: 'balance' }}>
            Home-style cooking, served after sunset.
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--color-neutral-300)', margin: '0', maxWidth: '440px' }}>
            Recipes from our grandmother's kitchen, cooked fresh every evening from 5pm until late.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '15px' }}>
              View menu
            </button>
            <button className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '15px' }}>
              <Ph name="calendar-plus" />
              Book a table
            </button>
          </div>
        </div>
        <div style={{ height: '400px', borderRadius: 'var(--radius-lg)', background: 'repeating-linear-gradient(135deg, var(--color-neutral-900) 0 12px, var(--color-bg) 12px 24px)', display: 'grid', placeItems: 'center', font: '12px ui-monospace,Menlo,monospace', color: 'var(--color-neutral-500)', boxShadow: 'var(--shadow-sm)' }}>
          hero dish photo
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr)) minmax(0,1.3fr)', gap: '20px', padding: '36px 56px 40px', marginTop: 'auto', alignItems: 'end' }}>
        {dishes.map((d, dIndex) => (
          <Fragment key={dIndex}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', flex: 'none', borderRadius: 'var(--radius-md)', background: 'repeating-linear-gradient(135deg, var(--color-neutral-900) 0 8px, var(--color-bg) 8px 16px)', boxShadow: 'var(--shadow-sm)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '500' }}>
                {d.n}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-accent-300)' }}>
                {d.p}
              </span>
            </div>
          </div>
          </Fragment>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--color-neutral-300)', paddingLeft: '20px', borderLeft: '1px solid var(--color-divider)' }}>
          <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Ph name="clock" style={{ color: 'var(--color-accent)' }} />
            Daily, 5pm – 1am
          </span>
          <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Ph name="map-pin" style={{ color: 'var(--color-accent)' }} />
            Jalan Telawi, Bangsar
          </span>
          <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Ph name="phone" style={{ color: 'var(--color-accent)' }} />
            03-1234 5678
          </span>
        </div>
      </div>
    </div>
    </>
  )
}

function Phone() {
  return (
    <>
    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minHeight: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '500' }}>
          <Ph name="moon-stars" style={{ color: 'var(--color-accent)' }} />
          Dapur Senja
        </span>
        <Ph name="list" style={{ fontSize: '22px' }} />
      </div>
      <div style={{ margin: '6px 16px 0', height: '250px', borderRadius: 'var(--radius-lg)', background: 'repeating-linear-gradient(135deg, var(--color-neutral-900) 0 12px, var(--color-bg) 12px 24px)', display: 'grid', placeItems: 'center', font: '12px ui-monospace,Menlo,monospace', color: 'var(--color-neutral-500)', boxShadow: 'var(--shadow-sm)' }}>
        hero dish photo
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 20px 0' }}>
        <span style={{ fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
          Malay kitchen · Open late
        </span>
        <h1 style={{ fontSize: '34px', margin: '0', lineHeight: '1.08' }}>
          Home-style cooking, served after sunset.
        </h1>
        <p style={{ margin: '0', color: 'var(--color-neutral-300)', fontSize: '15px' }}>
          Recipes from our grandmother's kitchen, cooked fresh every evening.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '4px' }}>
          <button className="btn btn-primary" style={{ padding: '12px' }}>
            View menu
          </button>
          <button className="btn btn-secondary" style={{ padding: '12px' }}>
            Book a table
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', fontSize: '13px', color: 'var(--color-neutral-300)' }}>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Ph name="clock" style={{ color: 'var(--color-accent)' }} />
          Daily, 5pm – 1am
        </span>
        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Ph name="map-pin" style={{ color: 'var(--color-accent)' }} />
          Jalan Telawi, Bangsar
        </span>
      </div>
    </div>
    </>
  )
}

export default function RestoLanding({ device = 'desktop' }) {
  return device === 'phone' ? (
    <PhoneShell>
      <Phone />
    </PhoneShell>
  ) : (
    <DesktopShell>
      <Desktop />
    </DesktopShell>
  )
}

import { Fragment } from 'react'
import { Ph } from './icons'
import { DesktopShell, PhoneShell } from './Shell'
import { menu } from './sampleData'

// Ported from docs/design-handoff-v2/ProjectScreen.dc.html. Decorative mock-up: the shell sets aria-hidden.

function Desktop() {
  return (
    <>
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="nav" style={{ padding: '18px 40px' }}>
        <span className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ph name="moon-stars" style={{ color: 'var(--color-accent)' }} />
          Dapur Senja
        </span>
        <span style={{ fontSize: '13px', color: 'var(--color-neutral-400)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Ph name="armchair" />
          Table 12
        </span>
      </div>
      <div style={{ flex: '1', display: 'grid', gridTemplateColumns: '200px minmax(0,1fr) 320px', gap: '28px', padding: '8px 40px 32px', minHeight: '0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ padding: '9px 12px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-900)', color: 'var(--color-accent-200)' }}>
            Rice dishes
          </div>
          <div style={{ padding: '9px 12px', color: 'var(--color-neutral-400)' }}>
            Noodles
          </div>
          <div style={{ padding: '9px 12px', color: 'var(--color-neutral-400)' }}>
            Grill
          </div>
          <div style={{ padding: '9px 12px', color: 'var(--color-neutral-400)' }}>
            Sides
          </div>
          <div style={{ padding: '9px 12px', color: 'var(--color-neutral-400)' }}>
            Drinks
          </div>
          <div style={{ padding: '9px 12px', color: 'var(--color-neutral-400)' }}>
            Desserts
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
          <span style={{ fontSize: '24px', fontWeight: '500', paddingBottom: '6px' }}>
            Rice dishes
          </span>
          {menu.map((m, mIndex) => (
            <Fragment key={mIndex}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
              <div style={{ width: '72px', height: '72px', flex: 'none', borderRadius: 'var(--radius-md)', background: 'repeating-linear-gradient(135deg, var(--color-neutral-900) 0 8px, var(--color-bg) 8px 16px)' }} />
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                <span style={{ fontWeight: '500' }}>
                  {m.n}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--color-neutral-400)' }}>
                  {m.d}
                </span>
              </div>
              <span style={{ fontWeight: '500' }}>
                {m.p}
              </span>
              <button className="btn btn-primary btn-icon">
                <Ph name="plus" />
              </button>
            </div>
            </Fragment>
          ))}
        </div>
        <div className="card elev-md" style={{ padding: '18px', gap: '12px', alignSelf: 'start' }}>
          <span style={{ fontSize: '17px', fontWeight: '500' }}>
            Your order
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              2× Nasi Lemak Berempah
            </span>
            <span>
              RM 32.00
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              1× Teh Tarik
            </span>
            <span>
              RM 4.50
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              1× Sambal Sotong
            </span>
            <span>
              RM 12.00
            </span>
          </div>
          <div style={{ height: '1px', background: 'var(--color-divider)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-neutral-400)', fontSize: '13px' }}>
            <span>
              Service charge 6%
            </span>
            <span>
              RM 2.91
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '500' }}>
            <span>
              Total
            </span>
            <span>
              RM 51.41
            </span>
          </div>
          <button className="btn btn-primary btn-block" style={{ padding: '12px' }}>
            Send to kitchen
          </button>
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
        <span style={{ fontSize: '13px', color: 'var(--color-neutral-400)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Ph name="armchair" />
          Table 12
        </span>
      </div>
      <div style={{ display: 'flex', gap: '6px', padding: '6px 16px 14px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <span className="tag tag-outline" style={{ padding: '6px 12px' }}>
          Rice dishes
        </span>
        <span className="tag tag-neutral" style={{ padding: '6px 12px' }}>
          Noodles
        </span>
        <span className="tag tag-neutral" style={{ padding: '6px 12px' }}>
          Grill
        </span>
        <span className="tag tag-neutral" style={{ padding: '6px 12px' }}>
          Sides
        </span>
        <span className="tag tag-neutral" style={{ padding: '6px 12px' }}>
          Drinks
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
        {menu.map((m, mIndex) => (
          <Fragment key={mIndex}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
            <div style={{ width: '60px', height: '60px', flex: 'none', borderRadius: 'var(--radius-md)', background: 'repeating-linear-gradient(135deg, var(--color-neutral-900) 0 8px, var(--color-bg) 8px 16px)' }} />
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
              <span style={{ fontWeight: '500' }}>
                {m.n}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
                {m.d}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-accent-300)' }}>
                {m.p}
              </span>
            </div>
            <button className="btn btn-primary btn-icon" style={{ width: '32px', height: '32px' }}>
              <Ph name="plus" />
            </button>
          </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: '12px 16px 30px', background: 'var(--color-surface)' }}>
        <button className="btn btn-primary" style={{ width: '100%', padding: '13px 16px', justifyContent: 'space-between' }}>
          <span>
            3 items · RM 51.41
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            View order
            <Ph name="arrow-right" />
          </span>
        </button>
      </div>
    </div>
    </>
  )
}

export default function RestoMenu({ device = 'desktop' }) {
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

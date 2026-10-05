import { Fragment } from 'react'
import { Ph } from './icons'
import { DesktopShell, PhoneShell } from './Shell'

// Ported from docs/design-handoff-v2/ProjectScreen.dc.html. Decorative mock-up: the shell sets aria-hidden.

function Desktop() {
  return (
    <>
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'radial-gradient(ellipse at 75% 30%, var(--color-accent-900), var(--color-bg) 60%)' }}>
      <div className="nav" style={{ padding: '20px 56px' }}>
        <span className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ph name="coffee-bean" style={{ color: 'var(--color-accent)' }} />
          Kopi Pagi
        </span>
        <a href="#">
          Our beans
        </a>
        <a href="#">
          How to brew
        </a>
        <a href="#">
          Reviews
        </a>
        <a href="#">
          FAQ
        </a>
        <button className="btn btn-primary">
          Order now
        </button>
      </div>
      <div style={{ flex: '1', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '56px', padding: '40px 56px 0', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <span className="tag tag-accent" style={{ alignSelf: 'flex-start' }}>
            Freshly roasted every Monday
          </span>
          <h1 style={{ fontSize: '56px', margin: '0', textWrap: 'balance' }}>
            Morning coffee that tastes like home.
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--color-neutral-300)', margin: '0', maxWidth: '460px' }}>
            Kampung-style ground coffee, roasted in small batches and delivered to your door in 2–3 days.
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '36px', fontWeight: '500' }}>
              RM 39
            </span>
            <span style={{ color: 'var(--color-neutral-500)' }}>
              / 500g
            </span>
            <span style={{ color: 'var(--color-neutral-600)', textDecoration: 'line-through' }}>
              RM 49
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '15px' }}>
              <Ph name="whatsapp-logo" />
              Order on WhatsApp
            </button>
            <button className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '15px' }}>
              See reviews
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-neutral-400)', fontSize: '13px' }}>
            <span style={{ color: 'var(--color-accent)', letterSpacing: '2px' }}>
              ★★★★★
            </span>
            4.9 from 1,200+ orders
          </div>
        </div>
        <div style={{ height: '440px', borderRadius: 'var(--radius-lg)', background: 'repeating-linear-gradient(135deg, var(--color-neutral-900) 0 12px, var(--color-bg) 12px 24px)', display: 'grid', placeItems: 'center', font: '12px ui-monospace,Menlo,monospace', color: 'var(--color-neutral-500)', boxShadow: 'var(--shadow-sm)' }}>
          product photo
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '24px', padding: '36px 56px 40px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Ph name="fire" style={{ fontSize: '24px', color: 'var(--color-accent)' }} />
          <div>
            <div style={{ fontWeight: '500' }}>
              Small-batch roast
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-neutral-400)' }}>
              Roasted weekly, never sits on a shelf.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Ph name="truck" style={{ fontSize: '24px', color: 'var(--color-accent)' }} />
          <div>
            <div style={{ fontWeight: '500' }}>
              Free delivery over RM 80
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-neutral-400)' }}>
              Peninsular Malaysia, 2–3 working days.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Ph name="arrow-counter-clockwise" style={{ fontSize: '24px', color: 'var(--color-accent)' }} />
          <div>
            <div style={{ fontWeight: '500' }}>
              Not for you? Refunded.
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-neutral-400)' }}>
              Full refund within 7 days.
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

function Phone() {
  return (
    <>
    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minHeight: '0', background: 'radial-gradient(ellipse at 80% 15%, var(--color-accent-900), var(--color-bg) 60%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: '500' }}>
          <Ph name="coffee-bean" style={{ color: 'var(--color-accent)' }} />
          Kopi Pagi
        </span>
        <Ph name="list" style={{ fontSize: '22px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 20px 0' }}>
        <span className="tag tag-accent" style={{ alignSelf: 'flex-start' }}>
          Freshly roasted every Monday
        </span>
        <h1 style={{ fontSize: '36px', margin: '0', lineHeight: '1.08' }}>
          Morning coffee that tastes like home.
        </h1>
        <p style={{ margin: '0', color: 'var(--color-neutral-300)', fontSize: '15px' }}>
          Kampung-style ground coffee, roasted in small batches and delivered in 2–3 days.
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '30px', fontWeight: '500' }}>
            RM 39
          </span>
          <span style={{ color: 'var(--color-neutral-500)' }}>
            / 500g
          </span>
          <span style={{ color: 'var(--color-neutral-600)', textDecoration: 'line-through' }}>
            RM 49
          </span>
        </div>
        <button className="btn btn-primary" style={{ padding: '13px', fontSize: '15px' }}>
          <Ph name="whatsapp-logo" />
          Order on WhatsApp
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-neutral-400)', fontSize: '13px' }}>
          <span style={{ color: 'var(--color-accent)', letterSpacing: '2px' }}>
            ★★★★★
          </span>
          4.9 from 1,200+ orders
        </div>
      </div>
      <div style={{ margin: '20px 20px 0', flex: '1', maxHeight: '250px', borderRadius: 'var(--radius-lg)', background: 'repeating-linear-gradient(135deg, var(--color-neutral-900) 0 12px, var(--color-bg) 12px 24px)', display: 'grid', placeItems: 'center', font: '12px ui-monospace,Menlo,monospace', color: 'var(--color-neutral-500)', boxShadow: 'var(--shadow-sm)' }}>
        product photo
      </div>
    </div>
    </>
  )
}

export default function SalesLanding({ device = 'desktop' }) {
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

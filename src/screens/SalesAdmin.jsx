import { Fragment } from 'react'
import { Ph } from './icons'
import { DesktopShell, PhoneShell } from './Shell'
import { kpis, bars, orders } from './sampleData'

// Ported from docs/design-handoff-v2/ProjectScreen.dc.html. Decorative mock-up: the shell sets aria-hidden.

function Desktop() {
  return (
    <>
    <div style={{ display: 'grid', gridTemplateColumns: '72px minmax(0,1fr)', height: '100%' }}>
      <div style={{ background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px 0' }}>
        <Ph name="coffee-bean" style={{ fontSize: '24px', color: 'var(--color-accent)', paddingBottom: '14px' }} />
        <button className="btn btn-icon" style={{ background: 'var(--color-accent-900)', color: 'var(--color-accent-200)' }}>
          <Ph name="squares-four" style={{ fontSize: '18px' }} />
        </button>
        <button className="btn btn-icon" style={{ color: 'var(--color-neutral-400)' }}>
          <Ph name="receipt" style={{ fontSize: '18px' }} />
        </button>
        <button className="btn btn-icon" style={{ color: 'var(--color-neutral-400)' }}>
          <Ph name="package" style={{ fontSize: '18px' }} />
        </button>
        <button className="btn btn-icon" style={{ color: 'var(--color-neutral-400)' }}>
          <Ph name="users-three" style={{ fontSize: '18px' }} />
        </button>
        <button className="btn btn-icon" style={{ color: 'var(--color-neutral-400)', marginTop: 'auto' }}>
          <Ph name="gear-six" style={{ fontSize: '18px' }} />
        </button>
      </div>
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: 'auto' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Kopi Pagi admin
            </span>
            <span style={{ fontSize: '24px', fontWeight: '500' }}>
              Overview
            </span>
          </div>
          <div className="seg">
            <span className="seg-opt">
              7 days
            </span>
            <span className="seg-opt" style={{ color: 'var(--color-accent)', boxShadow: 'inset 0 0 0 1px var(--color-accent)' }}>
              30 days
            </span>
            <span className="seg-opt">
              90 days
            </span>
          </div>
          <button className="btn btn-secondary">
            <Ph name="download-simple" />
            Export
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '12px' }}>
          {kpis.map((k, kIndex) => (
            <Fragment key={kIndex}>
            <div className="card elev-sm" style={{ gap: '4px', padding: '14px 16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
                {k.l}
              </span>
              <span style={{ fontSize: '26px', fontWeight: '500' }}>
                {k.v}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-accent-300)' }}>
                {k.d}
              </span>
            </div>
            </Fragment>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '12px' }}>
          <div className="card elev-sm" style={{ padding: '16px', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '500' }}>
                Revenue, last 14 days
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                RM
              </span>
            </div>
            <div style={{ height: '170px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              {bars.map((b, bIndex) => (
                <Fragment key={bIndex}>
                <div style={{ flex: '1', height: `${b.h}%`, borderRadius: '4px 4px 0 0', background: 'linear-gradient(to top, var(--color-accent-800), var(--color-accent-600))' }} />
                </Fragment>
              ))}
            </div>
          </div>
          <div className="card elev-sm" style={{ padding: '16px', gap: '12px' }}>
            <span style={{ fontWeight: '500' }}>
              Top products
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                Kopi Pagi 500g
              </span>
              <span style={{ color: 'var(--color-neutral-400)' }}>
                312
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                Kopi Pagi 1kg
              </span>
              <span style={{ color: 'var(--color-neutral-400)' }}>
                96
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                Drip bag box (10)
              </span>
              <span style={{ color: 'var(--color-neutral-400)' }}>
                64
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                Gift set
              </span>
              <span style={{ color: 'var(--color-neutral-400)' }}>
                21
              </span>
            </div>
          </div>
        </div>
        <div className="card elev-sm" style={{ padding: '12px 16px', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>
              Recent orders
            </span>
            <button className="btn btn-ghost">
              View all
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>
                  Order
                </th>
                <th>
                  Customer
                </th>
                <th>
                  Items
                </th>
                <th>
                  Total
                </th>
                <th>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, oIndex) => (
                <Fragment key={oIndex}>
                <tr>
                  <td style={{ color: 'var(--color-neutral-400)' }}>
                    {o.id}
                  </td>
                  <td>
                    {o.c}
                  </td>
                  <td style={{ color: 'var(--color-neutral-400)' }}>
                    {o.i}
                  </td>
                  <td>
                    {o.t}
                  </td>
                  <td>
                    <span className="tag tag-accent">
                      {o.s}
                    </span>
                  </td>
                </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  )
}

function Phone() {
  return (
    <>
    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            Last 30 days
          </span>
          <span style={{ fontSize: '26px', fontWeight: '500' }}>
            Overview
          </span>
        </div>
        <button className="btn btn-secondary btn-icon">
          <Ph name="funnel" style={{ fontSize: '18px' }} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', padding: '0 16px' }}>
        {kpis.map((k, kIndex) => (
          <Fragment key={kIndex}>
          <div className="card elev-sm" style={{ gap: '2px', padding: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-400)' }}>
              {k.l}
            </span>
            <span style={{ fontSize: '20px', fontWeight: '500' }}>
              {k.v}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-accent-300)' }}>
              {k.d}
            </span>
          </div>
          </Fragment>
        ))}
      </div>
      <div className="card elev-sm" style={{ margin: '0 16px', padding: '14px', gap: '12px' }}>
        <span style={{ fontWeight: '500' }}>
          Revenue, last 14 days
        </span>
        <div style={{ height: '110px', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
          {bars.map((b, bIndex) => (
            <Fragment key={bIndex}>
            <div style={{ flex: '1', height: `${b.h}%`, borderRadius: '3px 3px 0 0', background: 'linear-gradient(to top, var(--color-accent-800), var(--color-accent-600))' }} />
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
        <span style={{ fontWeight: '500', padding: '4px 0 0' }}>
          Recent orders
        </span>
        {orders.map((o, oIndex) => (
          <Fragment key={oIndex}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '0' }}>
              <span>
                {o.c}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                {o.id} · {o.i}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <span style={{ fontSize: '13px' }}>
                {o.t}
              </span>
              <span className="tag tag-accent" style={{ padding: '1px 8px' }}>
                {o.s}
              </span>
            </div>
          </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', padding: '10px 8px 28px', background: 'var(--color-surface)', fontSize: '11px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-accent)' }}>
          <Ph name="squares-four" style={{ fontSize: '22px' }} />
          Overview
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-neutral-500)' }}>
          <Ph name="receipt" style={{ fontSize: '22px' }} />
          Orders
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-neutral-500)' }}>
          <Ph name="package" style={{ fontSize: '22px' }} />
          Products
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-neutral-500)' }}>
          <Ph name="gear-six" style={{ fontSize: '22px' }} />
          Settings
        </span>
      </div>
    </div>
    </>
  )
}

export default function SalesAdmin({ device = 'desktop' }) {
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

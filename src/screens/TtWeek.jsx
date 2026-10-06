import { Fragment } from 'react'
import { Ph } from './icons'
import { DesktopShell, PhoneShell } from './Shell'
import { rows, days } from './sampleData'

// Ported from docs/design-handoff-v2/ProjectScreen.dc.html. Decorative mock-up: the shell sets aria-hidden.

function Desktop() {
  return (
    <>
    <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', height: '100%' }}>
      <div style={{ background: 'var(--color-surface)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '16px', padding: '0 10px 20px' }}>
          <Ph name="calendar-check" style={{ color: 'var(--color-accent)', fontSize: '22px' }} />
          ShiftDesk
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-900)', color: 'var(--color-accent-200)' }}>
          <Ph name="calendar-dots" />
          Timetable
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', color: 'var(--color-neutral-400)' }}>
          <Ph name="users" />
          Staff
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', color: 'var(--color-neutral-400)' }}>
          <Ph name="airplane-tilt" />
          Leave requests
          <span className="tag tag-accent" style={{ marginLeft: 'auto', padding: '1px 7px' }}>
            3
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', color: 'var(--color-neutral-400)' }}>
          <Ph name="chart-bar" />
          Reports
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', color: 'var(--color-neutral-400)' }}>
          <Ph name="gear-six" />
          Settings
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-accent-800)', color: 'var(--color-accent-100)', display: 'grid', placeItems: 'center', fontSize: '12px' }}>
            SM
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px' }}>
              Sarah M.
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
              Manager
            </span>
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px', minWidth: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: 'auto' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Outlet · Bangsar
            </span>
            <span style={{ fontSize: '24px', fontWeight: '500' }}>
              Weekly timetable
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', padding: '4px' }}>
            <button className="btn btn-icon" style={{ width: '28px', height: '28px' }}>
              <Ph name="caret-left" />
            </button>
            <span style={{ fontSize: '13px', padding: '0 8px' }}>
              5 – 11 Oct 2026
            </span>
            <button className="btn btn-icon" style={{ width: '28px', height: '28px' }}>
              <Ph name="caret-right" />
            </button>
          </div>
          <button className="btn btn-secondary">
            <Ph name="copy" />
            Copy last week
          </button>
          <button className="btn btn-primary">
            <Ph name="paper-plane-tilt" />
            Publish
          </button>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--color-neutral-400)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--color-accent-700)' }} />
            Morning 08:00–16:00
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--color-neutral-700)' }} />
            Evening 16:00–00:00
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '1px dashed var(--color-neutral-600)' }} />
            Off
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', border: '1px solid var(--color-accent)' }} />
            Leave
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(7,minmax(0,1fr)) 60px', gap: '6px', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', padding: '0 0 4px' }}>
            <span>
              Staff
            </span>
            {days.map((d, dIndex) => (
              <Fragment key={dIndex}>
              <span>
                {d.d}{' '}
                <span style={{ color: 'var(--color-neutral-300)' }}>
                  {d.n}
                </span>
              </span>
              </Fragment>
            ))}
            <span style={{ textAlign: 'right' }}>
              Hrs
            </span>
          </div>
          {rows.map((r, rIndex) => (
            <Fragment key={rIndex}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(7,minmax(0,1fr)) 60px', gap: '6px', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', flex: 'none', borderRadius: '50%', background: 'var(--color-neutral-800)', display: 'grid', placeItems: 'center', fontSize: '11px' }}>
                  {r.ini}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '0' }}>
                  <span style={{ fontSize: '13px' }}>
                    {r.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-neutral-500)' }}>
                    {r.role}
                  </span>
                </div>
              </div>
              {r.days.map((c, cIndex) => (
                <Fragment key={cIndex}>
                <div style={{ height: '52px', display: 'flex' }}>
                  {c.m && (
                    <>
                    <div style={{ flex: '1', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-800)', color: 'var(--color-accent-100)', padding: '7px 9px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '12px' }}>
                      <span>
                        Morning
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-accent-300)' }}>
                        08–16
                      </span>
                    </div>
                    </>
                  )}
                  {c.e && (
                    <>
                    <div style={{ flex: '1', borderRadius: 'var(--radius-md)', background: 'var(--color-neutral-800)', color: 'var(--color-neutral-100)', padding: '7px 9px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '12px' }}>
                      <span>
                        Evening
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-neutral-400)' }}>
                        16–00
                      </span>
                    </div>
                    </>
                  )}
                  {c.o && (
                    <>
                    <div style={{ flex: '1', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-neutral-800)', color: 'var(--color-neutral-600)', display: 'grid', placeItems: 'center', fontSize: '12px' }}>
                      Off
                    </div>
                    </>
                  )}
                  {c.l && (
                    <>
                    <div style={{ flex: '1', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-accent-600)', color: 'var(--color-accent-300)', display: 'grid', placeItems: 'center', fontSize: '12px' }}>
                      Leave
                    </div>
                    </>
                  )}
                </div>
                </Fragment>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '13px', color: 'var(--color-neutral-300)' }}>
                {r.hrs}
              </div>
            </div>
            </Fragment>
          ))}
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            5 – 11 Oct 2026
          </span>
          <span style={{ fontSize: '26px', fontWeight: '500' }}>
            Timetable
          </span>
        </div>
        <button className="btn btn-primary btn-icon">
          <Ph name="plus" style={{ fontSize: '18px' }} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: '4px', padding: '0 16px 16px' }}>
        {days.map((d, dIndex) => (
          <Fragment key={dIndex}>
          {d.on && (
            <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '8px 0', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 0 1px var(--color-accent)', background: 'var(--color-accent-900)', color: 'var(--color-accent-200)' }}>
              <span style={{ fontSize: '11px' }}>
                {d.d}
              </span>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                {d.n}
              </span>
            </div>
            </>
          )}
          {d.off && (
            <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '8px 0', color: 'var(--color-neutral-400)' }}>
              <span style={{ fontSize: '11px' }}>
                {d.d}
              </span>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                {d.n}
              </span>
            </div>
            </>
          )}
          </Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
        {rows.map((r, rIndex) => (
          <Fragment key={rIndex}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
            <div style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '50%', background: 'var(--color-neutral-800)', display: 'grid', placeItems: 'center', fontSize: '12px' }}>
              {r.ini}
            </div>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '0' }}>
              <span>
                {r.name}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                {r.role}
              </span>
            </div>
            {r.tue.m && (
              <>
              <span className="tag tag-accent">
                08–16
              </span>
              </>
            )}
            {r.tue.e && (
              <>
              <span className="tag tag-neutral">
                16–00
              </span>
              </>
            )}
            {r.tue.o && (
              <>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-600)' }}>
                Off
              </span>
              </>
            )}
            {r.tue.l && (
              <>
              <span className="tag tag-outline">
                Leave
              </span>
              </>
            )}
          </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', padding: '10px 8px 28px', background: 'var(--color-surface)', fontSize: '11px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-accent)' }}>
          <Ph name="calendar-dots" style={{ fontSize: '22px' }} />
          Timetable
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-neutral-500)' }}>
          <Ph name="users" style={{ fontSize: '22px' }} />
          Staff
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-neutral-500)' }}>
          <Ph name="airplane-tilt" style={{ fontSize: '22px' }} />
          Leave
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-neutral-500)' }}>
          <Ph name="user-circle" style={{ fontSize: '22px' }} />
          Me
        </span>
      </div>
    </div>
    </>
  )
}

export default function TtWeek({ device = 'desktop' }) {
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

import { Fragment } from 'react'
import { Ph } from './icons'
import { DesktopShell, PhoneShell } from './Shell'
import { staffTable } from './sampleData'

// Ported from docs/design-handoff-v2/ProjectScreen.dc.html. Decorative mock-up: the shell sets aria-hidden.

function Desktop() {
  return (
    <>
    <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr) 300px', height: '100%' }}>
      <div style={{ background: 'var(--color-surface)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', fontSize: '16px', padding: '0 10px 20px' }}>
          <Ph name="calendar-check" style={{ color: 'var(--color-accent)', fontSize: '22px' }} />
          ShiftDesk
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', color: 'var(--color-neutral-400)' }}>
          <Ph name="calendar-dots" />
          Timetable
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-900)', color: 'var(--color-accent-200)' }}>
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
      </div>
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px', minWidth: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: 'auto' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              8 people · 2 on leave
            </span>
            <span style={{ fontSize: '24px', fontWeight: '500' }}>
              Staff
            </span>
          </div>
          <div style={{ position: 'relative', width: '240px' }}>
            <Ph name="magnifying-glass" style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-neutral-500)' }} />
            <input className="input" placeholder="Search staff" style={{ paddingLeft: '32px' }} />
          </div>
          <button className="btn btn-primary">
            <Ph name="plus" />
            Add staff
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="tag tag-outline">
            All
          </span>
          <span className="tag tag-neutral">
            Front of house
          </span>
          <span className="tag tag-neutral">
            Kitchen
          </span>
          <span className="tag tag-neutral">
            Management
          </span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>
                Name
              </th>
              <th>
                Department
              </th>
              <th>
                Role
              </th>
              <th>
                Hours / wk
              </th>
              <th>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {staffTable.map((s, sIndex) => (
              <Fragment key={sIndex}>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-neutral-800)', display: 'grid', placeItems: 'center', fontSize: '11px' }}>
                      {s.ini}
                    </div>
                    {s.name}
                  </div>
                </td>
                <td style={{ color: 'var(--color-neutral-400)' }}>
                  {s.dept}
                </td>
                <td style={{ color: 'var(--color-neutral-400)' }}>
                  {s.role}
                </td>
                <td>
                  {s.hrs}
                </td>
                <td>
                  {s.leave && (
                    <>
                    <span className="tag tag-outline">
                      On leave
                    </span>
                    </>
                  )}
                  {s.active && (
                    <>
                    <span className="tag tag-accent">
                      Active
                    </span>
                    </>
                  )}
                </td>
              </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderLeft: '1px solid var(--color-divider)', padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-accent-800)', color: 'var(--color-accent-100)', display: 'grid', placeItems: 'center', fontSize: '18px' }}>
            AR
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: '500' }}>
              Aisyah Rahman
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
              Supervisor · Front of house
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" style={{ flex: '1' }}>
            <Ph name="phone" />
            Call
          </button>
          <button className="btn btn-secondary" style={{ flex: '1' }}>
            <Ph name="chat-circle" />
            Message
          </button>
        </div>
        <div className="card elev-sm" style={{ gap: '10px' }}>
          <span className="card-kicker">
            This week
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: '500' }}>
              40
            </span>
            <span style={{ color: 'var(--color-neutral-500)' }}>
              / 40 hrs
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'var(--color-neutral-800)' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '3px', background: 'var(--color-accent)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-neutral-500)' }}>
            Upcoming shifts
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span>
              Mon 5 Oct
            </span>
            <span style={{ color: 'var(--color-accent-300)' }}>
              08:00–16:00
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span>
              Tue 6 Oct
            </span>
            <span style={{ color: 'var(--color-accent-300)' }}>
              08:00–16:00
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span>
              Fri 9 Oct
            </span>
            <span style={{ color: 'var(--color-neutral-300)' }}>
              16:00–00:00
            </span>
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
    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minHeight: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
            8 people · 2 on leave
          </span>
          <span style={{ fontSize: '26px', fontWeight: '500' }}>
            Staff
          </span>
        </div>
        <button className="btn btn-primary btn-icon">
          <Ph name="user-plus" style={{ fontSize: '18px' }} />
        </button>
      </div>
      <div style={{ position: 'relative', padding: '0 16px 14px' }}>
        <Ph name="magnifying-glass" style={{ position: 'absolute', left: '28px', top: '11px', color: 'var(--color-neutral-500)' }} />
        <input className="input" placeholder="Search staff" style={{ paddingLeft: '34px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
        {staffTable.map((s, sIndex) => (
          <Fragment key={sIndex}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 4px', background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-text) 8%, transparent) 48px, color-mix(in srgb, var(--color-text) 8%, transparent) calc(100% - 48px), transparent) no-repeat bottom / 100% 1px' }}>
            <div style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '50%', background: 'var(--color-neutral-800)', display: 'grid', placeItems: 'center', fontSize: '12px' }}>
              {s.ini}
            </div>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', minWidth: '0' }}>
              <span>
                {s.name}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>
                {s.role} · {s.dept}
              </span>
            </div>
            {s.leave && (
              <>
              <span className="tag tag-outline">
                Leave
              </span>
              </>
            )}
            {s.active && (
              <>
              <span style={{ fontSize: '13px', color: 'var(--color-neutral-300)' }}>
                {s.hrs}h
              </span>
              </>
            )}
          </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', padding: '10px 8px 28px', background: 'var(--color-surface)', fontSize: '11px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-neutral-500)' }}>
          <Ph name="calendar-dots" style={{ fontSize: '22px' }} />
          Timetable
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: 'var(--color-accent)' }}>
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

export default function TtStaff({ device = 'desktop' }) {
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

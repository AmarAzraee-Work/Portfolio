import { DownloadSimple } from '@phosphor-icons/react'
import Face from './Face'
import Eyebrow from '../components/Eyebrow'
import { Scramble } from '../hooks/useScramble'
import { experience } from '../data/experience'
import { profile } from '../data/profile'
import { sections } from '../data/sections'

// Rows are separated by a hairline that fades out at both ends (Nocturne's rule style).
const rowRule =
  'linear-gradient(to right, transparent, var(--color-divider) 48px, var(--color-divider) calc(100% - 48px), transparent) no-repeat top / 100% 1px'

export default function Experience() {
  return (
    <Face index={3} label="Experience" labelledBy="experience-title" inner={{ gap: 'clamp(20px,4vh,40px)', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px 40px' }}>
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Eyebrow>{sections.experience.eyebrow}</Eyebrow>
          <h2 id="experience-title" style={{ fontSize: 'clamp(34px,4.6vw,60px)', letterSpacing: '-.03em', margin: 0 }}>
            <Scramble text={sections.experience.heading} />
          </h2>
        </div>
        <a className="btn btn-primary" href={profile.cvUrl} download style={{ padding: '10px 16px', textDecoration: 'none' }}>
          <DownloadSimple aria-hidden="true" />
          Download CV
        </a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {experience.map((row, i) => (
          <div
            key={`${row.period}-${row.title}-${i}`}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: '6px 32px', padding: '20px 0', background: rowRule }}
          >
            {/* The newest row's date is highlighted, as in the design. */}
            <span style={{ fontSize: '14px', color: i === 0 ? 'var(--color-accent-300)' : 'var(--color-neutral-400)' }}>{row.period}</span>
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '19px', fontWeight: 500 }}>{row.title}</span>
              <span style={{ color: 'var(--color-neutral-400)' }}>{row.line}</span>
            </div>
          </div>
        ))}
      </div>
    </Face>
  )
}

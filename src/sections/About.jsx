import { CloudArrowUp, Code, GitBranch, Palette } from '@phosphor-icons/react'
import Face from './Face'
import Eyebrow from '../components/Eyebrow'
import { Scramble } from '../hooks/useScramble'
import { about } from '../data/about'

const ICONS = { Code, GitBranch, CloudArrowUp, Palette }

export default function About() {
  return (
    <Face index={2} label="About" labelledBy="about-title">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <h2 id="about-title" style={{ fontSize: 'clamp(34px,4.6vw,60px)', letterSpacing: '-.03em', margin: 0, textWrap: 'balance' }}>
            <Scramble text={about.heading} />
          </h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} style={{ fontSize: '16px', color: 'var(--color-neutral-300)', margin: 0, textWrap: 'pretty' }}>
              {paragraph}
            </p>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {about.groups.map(({ icon, label, variant, tags, outline = [] }) => {
            const Icon = ICONS[icon]
            return (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '12px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon aria-hidden="true" style={{ color: 'var(--color-accent)', fontSize: '16px' }} />
                  {label}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tags.map((tag) => (
                    <span key={tag} className={`tag tag-${variant}`}>
                      {tag}
                    </span>
                  ))}
                  {outline.map((tag) => (
                    <span key={tag} className="tag tag-outline">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Face>
  )
}

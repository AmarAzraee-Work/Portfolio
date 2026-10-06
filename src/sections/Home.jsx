import { ArrowDown, MouseScroll } from '@phosphor-icons/react'
import Face from './Face'
import Eyebrow from '../components/Eyebrow'
import MiniCube from '../components/MiniCube'
import { Scramble } from '../hooks/useScramble'
import { profile } from '../data/profile'
import { sections } from '../data/sections'

export default function Home({ wide, reducedMotion, goTo }) {
  return (
    <Face index={0} label="Home" labelledBy="home-title">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '660px' }}>
          <Eyebrow>{sections.home.eyebrow}</Eyebrow>
          <h1 id="home-title" style={{ fontSize: 'clamp(44px,7vw,92px)', lineHeight: '1.02', letterSpacing: '-.035em', margin: 0, textWrap: 'balance' }}>
            <Scramble text={profile.headline[0]} /> <Scramble text={profile.headline[1]} style={{ color: 'var(--color-neutral-500)' }} />
          </h1>
          <p style={{ fontSize: 'clamp(16px,1.35vw,19px)', color: 'var(--color-neutral-300)', maxWidth: '540px', margin: 0, textWrap: 'pretty' }}>{profile.intro}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '6px' }}>
            <button className="btn btn-primary" onClick={() => goTo(1)} style={{ padding: '12px 20px', fontSize: '15px' }}>
              See my work
              <ArrowDown aria-hidden="true" />
            </button>
            <button className="btn btn-secondary" onClick={() => goTo(4)} style={{ padding: '12px 20px', fontSize: '15px' }}>
              Get in touch
            </button>
          </div>
        </div>
        {wide && <MiniCube onNavigate={goTo} reducedMotion={reducedMotion} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'clamp(32px,7vh,72px)', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
        <MouseScroll aria-hidden="true" style={{ fontSize: '20px', color: 'var(--color-accent)' }} />
        {sections.home.scrollHint}
      </div>
    </Face>
  )
}

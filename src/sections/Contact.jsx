import { ArrowUp, ArrowUpRight, EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react'
import Face from './Face'
import Eyebrow from '../components/Eyebrow'
import ContactForm from '../components/ContactForm'
import { Scramble } from '../hooks/useScramble'
import { profile } from '../data/profile'
import { sections } from '../data/sections'

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  padding: '14px 18px',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--color-surface)',
  textDecoration: 'none',
  color: 'var(--color-text)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'box-shadow .2s',
}

function ContactRow({ href, Icon, label, value, external, wrap }) {
  return (
    <a href={href} className="contact-row" style={rowStyle} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      <Icon aria-hidden="true" style={{ fontSize: '24px', color: 'var(--color-accent)' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: '12px', color: 'var(--color-neutral-500)' }}>{label}</span>
        <span style={{ fontSize: '16px', fontWeight: 500, overflowWrap: wrap ? 'anywhere' : undefined }}>{value}</span>
      </div>
      <ArrowUpRight aria-hidden="true" style={{ fontSize: '18px', color: 'var(--color-neutral-500)' }} />
    </a>
  )
}

export default function Contact({ goTo, reducedMotion }) {
  const { eyebrow, heading, intro } = sections.contact
  return (
    <Face
      index={4}
      label="Contact"
      labelledBy="contact-title"
      background="radial-gradient(ellipse at 15% 100%, var(--color-accent-900), transparent 60%), linear-gradient(165deg, color-mix(in srgb, var(--color-surface) 70%, var(--color-bg)), var(--color-bg) 65%)"
      inner={{ gap: 'clamp(24px,5vh,48px)', padding: 'clamp(84px,12vh,120px) clamp(20px,6vw,96px) clamp(32px,5vh,48px)' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,400px),1fr))', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="contact-title" style={{ fontSize: 'clamp(38px,5.4vw,76px)', lineHeight: '1.03', letterSpacing: '-.035em', margin: 0, textWrap: 'balance' }}>
            <Scramble text={heading} />
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.35vw,19px)', color: 'var(--color-neutral-300)', margin: 0, maxWidth: '520px', textWrap: 'pretty' }}>{intro}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '6px', maxWidth: '460px' }}>
            <ContactRow href={`mailto:${profile.email}`} Icon={EnvelopeSimple} label="Email" value={profile.email} wrap />
            <ContactRow href={`https://wa.me/${profile.whatsapp.number}`} Icon={WhatsappLogo} label="WhatsApp" value={profile.whatsapp.display} external />
          </div>
        </div>
        <ContactForm endpoint={import.meta.env.VITE_CONTACT_ENDPOINT} email={profile.email} reducedMotion={reducedMotion} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-neutral-500)' }}>
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <button className="btn btn-ghost" onClick={() => goTo(0)}>
          <ArrowUp aria-hidden="true" />
          Back to the top
        </button>
      </div>
    </Face>
  )
}

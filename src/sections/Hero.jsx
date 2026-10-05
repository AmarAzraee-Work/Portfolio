import { profile } from '../data/legacy/profile'
import ExternalLink from '../components/ExternalLink'
import { btnPrimary, btnSecondary } from '../components/buttonStyles'

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:pb-24 sm:pt-32">
      <p className="font-mono text-sm text-accent">$ whoami</p>
      <h1 className="mt-4 break-words font-mono text-4xl font-bold text-heading sm:text-6xl">
        {profile.name}
        <span className="cursor text-accent" aria-hidden="true">_</span>
      </h1>
      <p className="mt-3 font-mono text-lg text-muted sm:text-xl">{profile.role}</p>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed">{profile.tagline}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href="#projects" className={btnPrimary}>view projects</a>
        <ExternalLink href={profile.github} className={btnSecondary}>github</ExternalLink>
        <a href={profile.cvUrl} download className={btnSecondary}>download cv</a>
      </div>
    </section>
  )
}

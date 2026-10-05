import { profile } from '../data/legacy/profile'
import Section from '../components/Section'
import ExternalLink from '../components/ExternalLink'
import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <Section id="contact">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="max-w-md text-lg leading-relaxed">
            I&apos;m looking for a full stack developer role. The fastest way to reach me is email.
          </p>
          <ul className="mt-8 space-y-3 font-mono text-sm">
            <li>
              <span className="text-muted">email </span>
              <a href={`mailto:${profile.email}`} className="break-all text-accent hover:underline">
                {profile.email}
              </a>
            </li>
            <li>
              <ExternalLink href={profile.linkedin} className="text-heading hover:text-accent">
                linkedin <span aria-hidden="true">↗</span>
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.github} className="text-heading hover:text-accent">
                github <span aria-hidden="true">↗</span>
              </ExternalLink>
            </li>
          </ul>
        </div>
        <ContactForm endpoint={import.meta.env.VITE_CONTACT_ENDPOINT} email={profile.email} />
      </div>
    </Section>
  )
}

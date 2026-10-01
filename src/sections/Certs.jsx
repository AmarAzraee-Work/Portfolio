import { certs } from '../data/certs'
import Section from '../components/Section'
import ExternalLink from '../components/ExternalLink'

export default function Certs() {
  return (
    <Section id="certs">
      <ul className="divide-y divide-line border-y border-line">
        {certs.map((cert) => (
          <li
            key={cert.name}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <div>
              <p className="text-heading">{cert.name}</p>
              <p className="mt-0.5 font-mono text-xs text-muted">
                {cert.issuer} · {cert.year}
              </p>
            </div>
            <ExternalLink href={cert.verifyUrl} className="shrink-0 font-mono text-sm text-accent hover:underline">
              verify <span aria-hidden="true">↗</span>
              <span className="sr-only"> — {cert.name}</span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  )
}

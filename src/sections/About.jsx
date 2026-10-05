import { profile } from '../data/legacy/profile'
import Section from '../components/Section'

export default function About() {
  return (
    <Section id="about">
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Section>
  )
}

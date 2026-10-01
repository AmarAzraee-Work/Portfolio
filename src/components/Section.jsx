import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function Section({ id, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mx-auto max-w-5xl px-4 py-20 sm:py-24">
      <Reveal>
        <SectionHeading path={id} />
        {children}
      </Reveal>
    </section>
  )
}

import SectionHeading from './SectionHeading'

export default function Section({ id, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mx-auto max-w-5xl px-4 py-20 sm:py-24">
      <SectionHeading path={id} />
      {children}
    </section>
  )
}

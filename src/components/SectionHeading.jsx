export default function SectionHeading({ path }) {
  return (
    <h2 id={`${path}-heading`} className="mb-10 font-mono text-xl font-bold text-heading sm:text-2xl">
      <span className="text-accent">~/</span>
      {path}
    </h2>
  )
}

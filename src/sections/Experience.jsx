import { experience } from '../data/experience'
import Section from '../components/Section'
import Tag from '../components/Tag'

export default function Experience() {
  return (
    <Section id="experience">
      <ol className="ml-1 space-y-12 border-l border-line">
        {experience.map((job) => (
          <li key={`${job.company}-${job.period}`} className="relative pl-6 sm:pl-8">
            <span aria-hidden="true" className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
            <p className="font-mono text-xs text-muted">{job.period}</p>
            <h3 className="mt-1 text-lg font-semibold text-heading">
              {job.role} <span className="font-normal text-muted">@ {job.company}</span>
            </h3>
            <ul className="mt-3 max-w-3xl list-disc space-y-1.5 pl-5 leading-relaxed marker:text-accent">
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
              {job.tech.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}

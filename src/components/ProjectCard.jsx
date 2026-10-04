import { useState } from 'react'
import Tag from './Tag'
import ExternalLink from './ExternalLink'

function StatusBadge({ status }) {
  const isLive = status === 'in production'
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs ${
        isLive ? 'border-accent/40 text-accent' : 'border-line text-muted'
      }`}
    >
      {isLive && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />}
      {status}
    </span>
  )
}

export default function ProjectCard({ project }) {
  const { title, description, image, tech, liveUrl, githubUrl, status, featured } = project
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image) && !imageFailed

  const mediaClass = `aspect-video w-full border-b border-line ${
    featured ? 'md:aspect-auto md:h-full md:border-b-0 md:border-r' : ''
  }`

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-accent/40 ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
    >
      {showImage ? (
        <img
          src={image}
          alt={`Screenshot of ${title}`}
          width="1280"
          height="720"
          loading="lazy"
          onError={() => setImageFailed(true)}
          className={`${mediaClass} object-cover object-top`}
        />
      ) : (
        <div
          data-testid="image-placeholder"
          aria-hidden="true"
          className={`${mediaClass} flex items-center justify-center bg-bg p-4 text-center font-mono text-sm text-muted`}
        >
          {title}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-heading">{title}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="mt-3 leading-relaxed">{description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
          {tech.map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex gap-5 pt-6 font-mono text-sm">
          <ExternalLink href={liveUrl} className="text-accent hover:underline">
            live <span aria-hidden="true">↗</span>
            <span className="sr-only"> — {title}</span>
          </ExternalLink>
          <ExternalLink href={githubUrl} className="text-heading hover:text-accent">
            github <span aria-hidden="true">↗</span>
            <span className="sr-only"> — {title}</span>
          </ExternalLink>
        </div>
      </div>
    </article>
  )
}

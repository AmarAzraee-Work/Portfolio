import { profile } from '../data/profile'
import ExternalLink from './ExternalLink'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 font-mono text-xs text-muted sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          Built with React + Tailwind
          {profile.siteRepoUrl && (
            <>
              {' · '}
              <ExternalLink href={profile.siteRepoUrl} className="text-fg hover:text-accent">
                view source
              </ExternalLink>
            </>
          )}
        </p>
      </div>
    </footer>
  )
}

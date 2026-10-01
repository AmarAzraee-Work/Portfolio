import { useState } from 'react'
import { profile } from '../data/profile'

export const NAV_LINKS = [
  { id: 'about', label: 'about' },
  { id: 'stack', label: 'stack' },
  { id: 'projects', label: 'projects' },
  { id: 'experience', label: 'experience' },
  { id: 'certs', label: 'certs' },
  { id: 'contact', label: 'contact' },
]

const handle = profile.name.split(' ')[0].toLowerCase()

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <a href="#top" onClick={close} className="font-mono text-sm text-heading">
          {handle}@portfolio<span className="text-muted">:</span>
          <span className="text-accent">~$</span>
        </a>

        <ul className="hidden items-center gap-6 font-mono text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className="text-muted transition-colors hover:text-accent">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-accent px-3 py-1.5 text-accent transition-colors hover:bg-accent hover:text-bg"
            >
              resume
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-4 font-mono text-sm md:hidden">
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="rounded border border-accent px-2.5 py-1 text-accent"
          >
            resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="text-heading"
          >
            <span aria-hidden="true">[</span>
            {open ? 'close' : 'menu'}
            <span aria-hidden="true">]</span>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="space-y-1 border-t border-line px-4 py-3 font-mono text-sm md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={close} className="block py-2 text-muted hover:text-accent">
                <span className="text-accent">~/</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

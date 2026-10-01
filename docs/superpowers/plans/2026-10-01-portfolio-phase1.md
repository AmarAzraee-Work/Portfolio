# Portfolio Website (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Amar's single-page, dark "clean terminal" developer portfolio with Vite + React + Tailwind, with all content in `src/data/`.

**Architecture:** A Vite React SPA. `src/data/*.js` holds every piece of content in the shapes from the spec (the future Laravel API contract). `src/sections/*` are page sections that read data and compose small reusable pieces from `src/components/*`. Pure logic (sorting, validation, sending the form) lives in `src/lib/*` so it can be unit-tested without the UI.

**Tech Stack:** Node 22, Vite 8, React 19, Tailwind CSS 4 (`@tailwindcss/vite`), Vitest 5 + Testing Library + jsdom, Formspree (contact form), Vercel (hosting).

**Spec:** `docs/superpowers/specs/2026-10-01-portfolio-design.md`

**Learning note:** Amar is learning while building. Whoever executes a task explains to Amar what the task does and why, using the **Why** line of each task as the starting point.

## Global Constraints

- English-only site copy.
- Dark theme only. Background `#0b0d0e`, surface `#121517`, single accent green `#4ade80`. No other accent colours (red is allowed only for form error text).
- Fonts: JetBrains Mono (headings, labels, nav, tags) and Inter (body text), loaded from Google Fonts.
- Section headings render as `~/about`, `~/stack`, `~/projects`, `~/experience`, `~/certs`, `~/contact`. Navbar brand renders as `amar@portfolio:~$`.
- Tech tags render as `[react]`.
- Never use: purple/blue gradients, blurred blobs, glassmorphism/backdrop blur, emoji in headings, skill percentage bars, generic marketing copy.
- Components and sections never hard-code content; it comes from `src/data/` (UI labels such as "view projects" are fine).
- Every external link: `target="_blank" rel="noopener noreferrer"`. Missing optional URLs render no link.
- Motion: only fade-in on scroll and the hero cursor blink, both disabled under `prefers-reduced-motion`.
- Must work at 360px width with no horizontal scroll.
- Lighthouse (mobile) Performance and Accessibility ≥ 90.
- No React Router, no state library, no UI component library.

## Review Focus

1. **A project with a missing or broken screenshot, or a missing Live/GitHub URL**: the card shows a neutral placeholder with the title and no dead button. Tests in Task 3 (`ExternalLink`) and Task 6 (`ProjectCard`).
2. **Formspree ID not configured, the network fails, or Formspree returns a non-2xx status**: the visitor sees Amar's email as a fallback instead of a broken form or silent failure. Tests in Task 8.
3. **The mobile menu stays open after tapping a link and covers the section**: tapping a link closes it. Test in Task 4.
4. **Reduced motion enabled, or a browser without `IntersectionObserver`**: content is visible immediately and never stuck at opacity 0. Tests in Task 9.
5. **Placeholder content (`TODO`) or a missing CV/screenshot shipped to production**: `npm run check:content` fails and lists every problem. Verified in Task 9.

---

## File Map

```
Portfolio.Amar/
├── index.html                      # HTML shell, fonts, meta tags
├── package.json
├── vite.config.js                  # Vite + React + Tailwind + Vitest config
├── .gitignore
├── .env.example                    # VITE_FORMSPREE_ID=
├── scripts/check-content.js        # pre-deploy check for placeholders/missing files
├── public/
│   ├── favicon.svg
│   ├── cv.pdf                      # provided by Amar
│   └── projects/                   # screenshots, provided by Amar
└── src/
    ├── main.jsx                    # React entry
    ├── index.css                   # Tailwind import, theme tokens, base styles
    ├── App.jsx                     # composes the page
    ├── App.test.jsx                # smoke test: every section renders
    ├── test/setup.js               # jest-dom matchers for Vitest
    ├── data/                       # ALL content
    │   ├── profile.js  projects.js  experience.js  certs.js  stack.js
    │   └── data.test.js            # data shape contract
    ├── lib/
    │   ├── projects.js             # sortProjects()
    │   ├── projects.test.js
    │   ├── contact.js              # validateContact(), sendContact()
    │   └── contact.test.js
    ├── components/
    │   ├── buttonStyles.js         # shared button class strings
    │   ├── Tag.jsx                 # [react]
    │   ├── SectionHeading.jsx      # ~/projects
    │   ├── Section.jsx             # <section> wrapper + heading + Reveal
    │   ├── ExternalLink.jsx        # safe external link, null when no href
    │   ├── components.test.jsx     # Tag, SectionHeading, ExternalLink
    │   ├── Navbar.jsx  Navbar.test.jsx
    │   ├── Footer.jsx
    │   ├── ProjectCard.jsx  ProjectCard.test.jsx
    │   ├── ContactForm.jsx  ContactForm.test.jsx
    │   └── Reveal.jsx  Reveal.test.jsx
    └── sections/
        ├── Hero.jsx  About.jsx  Stack.jsx  Projects.jsx
        └── Experience.jsx  Certs.jsx  Contact.jsx
```

---

### Task 1: Scaffold Vite + React + Tailwind with the theme

**Why:** We set up the project by hand instead of running `npm create vite` because the folder already contains `docs/`, and writing each config file yourself shows what every file is for. The Tailwind `@theme` block turns our colours and fonts into utility classes (`bg-bg`, `text-accent`, `font-mono`), so the design rules live in one place.

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `.env.example`, `public/favicon.svg`, `src/main.jsx`, `src/index.css`, `src/App.jsx`

**Interfaces:**
- Produces: Tailwind colour utilities `bg`, `surface`, `line`, `fg`, `heading`, `muted`, `accent` (e.g. `bg-surface`, `border-line`, `text-fg`); `font-mono`, `font-sans`; CSS class `.cursor` (blinking); npm scripts `dev`, `build`, `preview`, `test`, `test:watch`, `check:content`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "portfolio-amar",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "check:content": "node scripts/check-content.js"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install react react-dom
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: both finish without errors; `package.json` now has `dependencies` and `devDependencies`; `package-lock.json` and `node_modules/` exist.

- [ ] **Step 3: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Amar — Full Stack Developer</title>
    <meta name="description" content="TODO: replace — Amar, Full Stack Developer (React + Laravel). Projects, experience and contact." />
    <meta name="theme-color" content="#0b0d0e" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `.gitignore` and `.env.example`**

`.gitignore`:
```
node_modules
dist
.env
.env.local
.DS_Store
```

`.env.example`:
```
# Copy to .env.local and paste your Formspree form ID (the part after /f/ in the form URL)
VITE_FORMSPREE_ID=
```

- [ ] **Step 6: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0b0d0e"/>
  <text x="5" y="22" font-family="monospace" font-size="16" font-weight="700" fill="#4ade80">&gt;_</text>
</svg>
```

- [ ] **Step 7: Create `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0b0d0e;
  --color-surface: #121517;
  --color-line: #23282b;
  --color-fg: #c9d1d6;
  --color-heading: #f1f5f7;
  --color-muted: #8a959c;
  --color-accent: #4ade80;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem; /* keeps section headings visible below the sticky navbar */
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

@keyframes blink {
  50% { opacity: 0; }
}

.cursor {
  animation: blink 1s step-end infinite;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .cursor { animation: none; }
}
```

- [ ] **Step 8: Create `src/main.jsx` and a temporary `src/App.jsx`**

`src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`src/App.jsx` (temporary, replaced in Task 4):
```jsx
export default function App() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-24">
      <h1 className="font-mono text-4xl text-heading">
        hello<span className="cursor text-accent">_</span>
      </h1>
      <p className="mt-4 text-muted">Tailwind theme is working.</p>
    </main>
  )
}
```

- [ ] **Step 9: Verify build and dev server**

Run: `npm run build`
Expected: `✓ built in ...` with no errors; a `dist/` folder exists.

Run: `npm run dev`, open `http://localhost:5173`.
Expected: near-black background, white monospace "hello" with a blinking green `_`, grey text below. Stop the server afterwards.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html .gitignore .env.example public/favicon.svg src/
git commit -m "chore: scaffold Vite + React + Tailwind with dark theme tokens"
```

---

### Task 2: Test setup and content data files

**Why:** Content is separated from UI so that adding a project means editing one data file, and later Phase 2 can swap these files for `fetch('/api/...')` without touching components. The data test acts as a contract: if a project is missing a required field or uses a wrong `status`, the test catches it before the page breaks.

**Files:**
- Modify: `vite.config.js`
- Create: `src/test/setup.js`, `src/data/data.test.js`, `src/data/profile.js`, `src/data/projects.js`, `src/data/experience.js`, `src/data/certs.js`, `src/data/stack.js`

**Interfaces:**
- Produces (named exports):
  - `profile`: `{ name, role, tagline, about: string[], email, github, linkedin, cvUrl, siteRepoUrl? }`
  - `projects`: `Array<{ title, description, image?, tech: string[], liveUrl?, githubUrl?, status: 'in production'|'demo', featured: boolean }>`
  - `experience`: `Array<{ company, role, period, points: string[], tech: string[] }>` (newest first)
  - `certs`: `Array<{ name, issuer, year, verifyUrl? }>`
  - `stack`: `Array<{ category: 'Frontend'|'Backend'|'Database'|'Tools', items: string[] }>`

- [ ] **Step 1: Add Vitest config to `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

Create `src/test/setup.js`:
```js
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 2: Write the failing data contract test `src/data/data.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { profile } from './profile'
import { projects } from './projects'
import { experience } from './experience'
import { certs } from './certs'
import { stack } from './stack'

const isText = (v) => typeof v === 'string' && v.trim().length > 0
const isHttpsUrl = (v) => typeof v === 'string' && v.startsWith('https://')
const isOptionalHttpsUrl = (v) => v === undefined || isHttpsUrl(v)
const isTextList = (v) => Array.isArray(v) && v.length > 0 && v.every(isText)

describe('profile', () => {
  it('has all required fields', () => {
    expect(isText(profile.name)).toBe(true)
    expect(isText(profile.role)).toBe(true)
    expect(isText(profile.tagline)).toBe(true)
    expect(isTextList(profile.about)).toBe(true)
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(isHttpsUrl(profile.github)).toBe(true)
    expect(isHttpsUrl(profile.linkedin)).toBe(true)
    expect(profile.cvUrl.startsWith('/')).toBe(true)
    expect(isOptionalHttpsUrl(profile.siteRepoUrl)).toBe(true)
  })
})

describe('projects', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it.each(projects.map((p) => [p.title, p]))('%s matches the project shape', (_title, p) => {
    expect(isText(p.title)).toBe(true)
    expect(isText(p.description)).toBe(true)
    expect(isTextList(p.tech)).toBe(true)
    expect(['in production', 'demo']).toContain(p.status)
    expect(typeof p.featured).toBe('boolean')
    expect(isOptionalHttpsUrl(p.liveUrl)).toBe(true)
    expect(isOptionalHttpsUrl(p.githubUrl)).toBe(true)
    if (p.image !== undefined) expect(p.image.startsWith('/')).toBe(true)
  })

  it('has unique titles (titles are used as React keys)', () => {
    const titles = projects.map((p) => p.title)
    expect(new Set(titles).size).toBe(titles.length)
  })
})

describe('experience', () => {
  it.each(experience.map((e) => [e.company, e]))('%s matches the experience shape', (_c, e) => {
    expect(isText(e.company)).toBe(true)
    expect(isText(e.role)).toBe(true)
    expect(isText(e.period)).toBe(true)
    expect(isTextList(e.points)).toBe(true)
    expect(isTextList(e.tech)).toBe(true)
  })
})

describe('certs', () => {
  it.each(certs.map((c) => [c.name, c]))('%s matches the cert shape', (_n, c) => {
    expect(isText(c.name)).toBe(true)
    expect(isText(c.issuer)).toBe(true)
    expect(isText(String(c.year))).toBe(true)
    expect(isOptionalHttpsUrl(c.verifyUrl)).toBe(true)
  })
})

describe('stack', () => {
  it.each(stack.map((g) => [g.category, g]))('%s matches the stack shape', (_c, g) => {
    expect(['Frontend', 'Backend', 'Database', 'Tools']).toContain(g.category)
    expect(isTextList(g.items)).toBe(true)
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/data`
Expected: FAIL with `Failed to resolve import "./profile"` (the data files do not exist yet).

- [ ] **Step 4: Create the data files with clearly marked placeholder content**

`src/data/profile.js`:
```js
// TODO: replace — fill in your real details. `npm run check:content` lists every TODO left.
export const profile = {
  name: 'Amar',
  role: 'Full Stack Developer',
  tagline: 'TODO: replace — one specific sentence, e.g. "I build Laravel + React apps that real users depend on."',
  about: [
    'TODO: replace — paragraph 1: your background and how you got into development.',
    'TODO: replace — paragraph 2: what you like building and the kind of team you want to join.',
  ],
  email: 'todo.replace@example.com',
  github: 'https://github.com/TODO-replace',
  linkedin: 'https://www.linkedin.com/in/TODO-replace',
  cvUrl: '/cv.pdf',
  siteRepoUrl: 'https://github.com/TODO-replace/portfolio',
}
```

`src/data/projects.js`:
```js
// TODO: replace — these example entries show every variant (featured, missing image, missing links).
// Put screenshots in public/projects/ and reference them as '/projects/<file>.png'.
export const projects = [
  {
    title: 'Example Production App',
    description: 'TODO: replace — what problem it solves and who uses it, in one or two sentences.',
    image: '/projects/example-app.png',
    tech: ['react', 'laravel', 'mysql'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/TODO-replace/example-app',
    status: 'in production',
    featured: true,
  },
  {
    title: 'Example Client Project',
    description: 'TODO: replace — a live project whose code is private, so it has no GitHub link.',
    image: '/projects/example-client.png',
    tech: ['laravel', 'blade', 'mysql'],
    liveUrl: 'https://example.org',
    status: 'in production',
    featured: false,
  },
  {
    title: 'Example Demo Project',
    description: 'TODO: replace — a project without a live link or screenshot, to show the fallbacks.',
    tech: ['react', 'tailwind'],
    githubUrl: 'https://github.com/TODO-replace/example-demo',
    status: 'demo',
    featured: false,
  },
]
```

`src/data/experience.js`:
```js
// TODO: replace — newest first.
export const experience = [
  {
    company: 'TODO: replace — Company Name',
    role: 'Software Developer Intern',
    period: 'TODO: replace — Mar 2025 – Aug 2025',
    points: [
      'TODO: replace — something you built or shipped, with an outcome if possible.',
      'TODO: replace — another responsibility or achievement.',
    ],
    tech: ['laravel', 'react', 'mysql'],
  },
]
```

`src/data/certs.js`:
```js
// TODO: replace — your real certifications. verifyUrl is optional.
export const certs = [
  {
    name: 'TODO: replace — Certification Name',
    issuer: 'TODO: replace — Issuer',
    year: 2025,
    verifyUrl: 'https://example.com/verify',
  },
  {
    name: 'TODO: replace — Certification Without Verify Link',
    issuer: 'TODO: replace — Issuer',
    year: 2024,
  },
]
```

`src/data/stack.js`:
```js
// TODO: replace — review and adjust to what you actually use.
export const stack = [
  { category: 'Frontend', items: ['react', 'javascript', 'tailwind', 'html', 'css'] },
  { category: 'Backend', items: ['laravel', 'php', 'rest apis'] },
  { category: 'Database', items: ['mysql'] },
  { category: 'Tools', items: ['git', 'github', 'vite', 'composer'] },
]
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/data`
Expected: PASS, all data tests green.

- [ ] **Step 6: Commit**

```bash
git add vite.config.js src/test src/data
git commit -m "feat: add content data files with shape contract tests"
```

---

### Task 3: Small reusable components (Tag, SectionHeading, Section, ExternalLink, button styles)

**Why:** These small pieces repeat across many sections. Building them once keeps the look consistent (every heading is `~/something`, every tag is `[thing]`) and puts the "no dead links" rule in a single place: `ExternalLink` renders nothing when there is no URL.

**Files:**
- Create: `src/components/Tag.jsx`, `src/components/SectionHeading.jsx`, `src/components/Section.jsx`, `src/components/ExternalLink.jsx`, `src/components/buttonStyles.js`, `src/components/components.test.jsx`

**Interfaces:**
- Produces:
  - `Tag({ children })`: renders `[children]`
  - `SectionHeading({ path })`: renders `<h2 id="{path}-heading">~/{path}</h2>`
  - `Section({ id, children })`: `<section id={id} aria-labelledby="{id}-heading">` containing `SectionHeading path={id}` and children
  - `ExternalLink({ href, className, children })`: `null` when `href` is falsy; otherwise `<a target="_blank" rel="noopener noreferrer">`
  - `btnPrimary`, `btnSecondary`: class strings

- [ ] **Step 1: Write the failing tests `src/components/components.test.jsx`**

```jsx
import { render, screen } from '@testing-library/react'
import Tag from './Tag'
import SectionHeading from './SectionHeading'
import Section from './Section'
import ExternalLink from './ExternalLink'

describe('Tag', () => {
  it('wraps the label in square brackets', () => {
    const { container } = render(<Tag>react</Tag>)
    expect(container).toHaveTextContent('[react]')
  })
})

describe('SectionHeading', () => {
  it('renders the path as ~/path with an id for aria-labelledby', () => {
    render(<SectionHeading path="projects" />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('~/projects')
    expect(heading).toHaveAttribute('id', 'projects-heading')
  })
})

describe('Section', () => {
  it('renders a labelled section with its heading and children', () => {
    render(<Section id="about"><p>hello</p></Section>)
    const section = screen.getByRole('region', { name: '~/about' })
    expect(section).toHaveAttribute('id', 'about')
    expect(section).toHaveTextContent('hello')
  })
})

describe('ExternalLink', () => {
  it('renders nothing when href is missing', () => {
    const { container } = render(<ExternalLink href={undefined}>live</ExternalLink>)
    expect(container).toBeEmptyDOMElement()
  })

  it('opens in a new tab safely', () => {
    render(<ExternalLink href="https://example.com">live</ExternalLink>)
    const link = screen.getByRole('link', { name: 'live' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components`
Expected: FAIL with `Failed to resolve import "./Tag"`.

- [ ] **Step 3: Implement the components**

`src/components/Tag.jsx`:
```jsx
export default function Tag({ children }) {
  return (
    <span className="whitespace-nowrap font-mono text-xs text-muted">
      <span aria-hidden="true">[</span>
      {children}
      <span aria-hidden="true">]</span>
    </span>
  )
}
```

`src/components/SectionHeading.jsx`:
```jsx
export default function SectionHeading({ path }) {
  return (
    <h2 id={`${path}-heading`} className="mb-10 font-mono text-xl font-bold text-heading sm:text-2xl">
      <span className="text-accent">~/</span>
      {path}
    </h2>
  )
}
```

`src/components/Section.jsx`:
```jsx
import SectionHeading from './SectionHeading'

export default function Section({ id, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mx-auto max-w-5xl px-4 py-20 sm:py-24">
      <SectionHeading path={id} />
      {children}
    </section>
  )
}
```

`src/components/ExternalLink.jsx`:
```jsx
export default function ExternalLink({ href, className = '', children }) {
  if (!href) return null
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
```

`src/components/buttonStyles.js`:
```js
// Shared class strings so every button looks the same without a UI library.
export const btnPrimary =
  'inline-flex items-center rounded border border-accent bg-accent px-4 py-2 font-mono text-sm font-medium text-bg transition-colors hover:bg-transparent hover:text-accent'

export const btnSecondary =
  'inline-flex items-center rounded border border-line px-4 py-2 font-mono text-sm text-heading transition-colors hover:border-accent hover:text-accent'
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat: add Tag, SectionHeading, Section, ExternalLink and button styles"
```

---

### Task 4: Page shell (Navbar, Hero, Footer, App)

**Why:** This is the first thing a recruiter sees. The sticky navbar keeps the CV one click away, and the hero answers "who, what role, where's the proof" at once. The mobile menu must close after a tap, otherwise it covers the section the visitor just jumped to. The App smoke test grows with each later task, so every section is proven to render.

**Files:**
- Create: `src/components/Navbar.jsx`, `src/components/Navbar.test.jsx`, `src/components/Footer.jsx`, `src/sections/Hero.jsx`, `src/App.test.jsx`
- Modify: `src/App.jsx` (replace temporary content)

**Interfaces:**
- Consumes: `profile` (Task 2); `ExternalLink`, `btnPrimary`, `btnSecondary` (Task 3)
- Produces: `NAV_LINKS: Array<{ id, label }>` exported from `Navbar.jsx`; App layout with `<main id="main">` where later tasks insert sections between `<Hero />` and the end of `main`.

- [ ] **Step 1: Write the failing tests**

`src/components/Navbar.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('shows the terminal-style brand', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /amar@portfolio/ })).toBeInTheDocument()
  })

  it('opens the mobile menu and closes it after a link is tapped', async () => {
    const user = userEvent.setup()
    const { container } = render(<Navbar />)
    const toggle = screen.getByRole('button', { name: 'menu' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('#mobile-menu')).toBeNull()

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'close' })).toHaveAttribute('aria-expanded', 'true')
    const menu = container.querySelector('#mobile-menu')
    expect(menu).not.toBeNull()

    await user.click(menu.querySelector('a[href="#projects"]'))
    expect(container.querySelector('#mobile-menu')).toBeNull()
  })
})
```

`src/App.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import App from './App'
import { profile } from './data/profile'

describe('App', () => {
  it('renders the hero with the name as the only h1', () => {
    render(<App />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(profile.name)
  })

  it('has a skip link to the main content', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/Navbar.test.jsx src/App.test.jsx`
Expected: FAIL. Navbar fails with `Failed to resolve import "./Navbar"`; App fails because the temporary App has no profile name or skip link.

- [ ] **Step 3: Implement Navbar**

`src/components/Navbar.jsx`:
```jsx
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

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="font-mono text-sm text-heading md:hidden"
        >
          <span aria-hidden="true">[</span>
          {open ? 'close' : 'menu'}
          <span aria-hidden="true">]</span>
        </button>
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
          <li>
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="block py-2 text-accent"
            >
              resume
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Implement Hero, Footer and App**

`src/sections/Hero.jsx`:
```jsx
import { profile } from '../data/profile'
import ExternalLink from '../components/ExternalLink'
import { btnPrimary, btnSecondary } from '../components/buttonStyles'

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:pb-24 sm:pt-32">
      <p className="font-mono text-sm text-accent">$ whoami</p>
      <h1 className="mt-4 break-words font-mono text-4xl font-bold text-heading sm:text-6xl">
        {profile.name}
        <span className="cursor text-accent" aria-hidden="true">_</span>
      </h1>
      <p className="mt-3 font-mono text-lg text-muted sm:text-xl">{profile.role}</p>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed">{profile.tagline}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href="#projects" className={btnPrimary}>view projects</a>
        <ExternalLink href={profile.github} className={btnSecondary}>github</ExternalLink>
        <a href={profile.cvUrl} download className={btnSecondary}>download cv</a>
      </div>
    </section>
  )
}
```

`src/components/Footer.jsx`:
```jsx
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
```

`src/App.jsx`:
```jsx
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS (all tests so far, including Navbar and App).

- [ ] **Step 6: Check in the browser**

Run: `npm run dev`, open `http://localhost:5173`.
Expected: sticky navbar with `amar@portfolio:~$`; hero with name, blinking cursor, role, tagline and three buttons. At 360px width the `[menu]` button appears, opens the list, and tapping a link closes it.

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/App.test.jsx src/components/Navbar.jsx src/components/Navbar.test.jsx src/components/Footer.jsx src/sections/Hero.jsx
git commit -m "feat: add navbar, hero, footer and page shell"
```

---

### Task 5: About and Stack sections

**Why:** About gives a human picture in a few seconds. Stack lists skills as plain tags grouped by category, with no percentage bars, because "React 90%" means nothing to a recruiter, while a clear grouped list is scannable and honest.

**Files:**
- Create: `src/sections/About.jsx`, `src/sections/Stack.jsx`
- Modify: `src/App.jsx`, `src/App.test.jsx`

**Interfaces:**
- Consumes: `profile.about`, `stack` (Task 2); `Section`, `Tag` (Task 3)

- [ ] **Step 1: Add the failing assertions to `src/App.test.jsx`**

Add this test inside the existing `describe('App', ...)` block, and add `import { stack } from './data/stack'` at the top:
```jsx
  it('renders the about and stack sections from data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: '~/about' })).toBeInTheDocument()
    expect(screen.getByText(profile.about[0])).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '~/stack' })).toBeInTheDocument()
    for (const group of stack) {
      expect(screen.getByRole('heading', { level: 3, name: group.category })).toBeInTheDocument()
    }
  })
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL with `Unable to find an accessible element with the role "heading" and name "~/about"`.

- [ ] **Step 3: Implement About and Stack**

`src/sections/About.jsx`:
```jsx
import { profile } from '../data/profile'
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
```

`src/sections/Stack.jsx`:
```jsx
import { stack } from '../data/stack'
import Section from '../components/Section'
import Tag from '../components/Tag'

export default function Stack() {
  return (
    <Section id="stack">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((group) => (
          <div key={group.category}>
            <h3 className="font-mono text-sm text-heading">{group.category}</h3>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
              {group.items.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

`src/App.jsx`: add the imports and render the sections after `<Hero />`:
```jsx
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Stack from './sections/Stack'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Stack />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/App.test.jsx src/sections/About.jsx src/sections/Stack.jsx
git commit -m "feat: add about and stack sections"
```

---

### Task 6: Projects section with ProjectCard

**Why:** This is the most important section, because live projects with real users are Amar's strongest proof. Featured projects sort first and render larger. The card has to hold up with messy real data: a missing or broken screenshot shows a clean placeholder, and a missing link shows no button. `sortProjects` lives in `src/lib` because it is pure logic that is easy to test without rendering anything.

**Files:**
- Create: `src/lib/projects.js`, `src/lib/projects.test.js`, `src/components/ProjectCard.jsx`, `src/components/ProjectCard.test.jsx`, `src/sections/Projects.jsx`
- Modify: `src/App.jsx`, `src/App.test.jsx`

**Interfaces:**
- Consumes: `projects` (Task 2); `Section`, `Tag`, `ExternalLink` (Task 3)
- Produces: `sortProjects(list) → new array, featured first, original order kept within each group`; `ProjectCard({ project })`

- [ ] **Step 1: Write the failing tests**

`src/lib/projects.test.js`:
```js
import { sortProjects } from './projects'

describe('sortProjects', () => {
  it('puts featured projects first and keeps the original order otherwise', () => {
    const list = [
      { title: 'a', featured: false },
      { title: 'b', featured: true },
      { title: 'c', featured: false },
      { title: 'd', featured: true },
    ]
    expect(sortProjects(list).map((p) => p.title)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('does not mutate the input array', () => {
    const list = [{ title: 'a', featured: false }, { title: 'b', featured: true }]
    sortProjects(list)
    expect(list.map((p) => p.title)).toEqual(['a', 'b'])
  })
})
```

`src/components/ProjectCard.test.jsx`:
```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProjectCard from './ProjectCard'

const full = {
  title: 'Shop App',
  description: 'Online shop for a local business.',
  image: '/projects/shop.png',
  tech: ['react', 'laravel'],
  liveUrl: 'https://shop.example.com',
  githubUrl: 'https://github.com/amar/shop',
  status: 'in production',
  featured: true,
}

describe('ProjectCard', () => {
  it('renders title, description, tags, status and both links', () => {
    render(<ProjectCard project={full} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Shop App' })).toBeInTheDocument()
    expect(screen.getByText('Online shop for a local business.')).toBeInTheDocument()
    expect(screen.getByText('in production')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /live/ })).toHaveAttribute('href', full.liveUrl)
    expect(screen.getByRole('link', { name: /github/ })).toHaveAttribute('href', full.githubUrl)
    expect(screen.getByRole('img', { name: 'Screenshot of Shop App' })).toHaveAttribute('loading', 'lazy')
  })

  it('hides links that are missing', () => {
    render(<ProjectCard project={{ ...full, liveUrl: undefined }} />)
    expect(screen.queryByRole('link', { name: /live/ })).toBeNull()
    expect(screen.getByRole('link', { name: /github/ })).toBeInTheDocument()
  })

  it('shows a placeholder when there is no image', () => {
    render(<ProjectCard project={{ ...full, image: undefined }} />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByTestId('image-placeholder')).toHaveTextContent('Shop App')
  })

  it('swaps to the placeholder when the image fails to load', () => {
    render(<ProjectCard project={full} />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByTestId('image-placeholder')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/projects.test.js src/components/ProjectCard.test.jsx`
Expected: FAIL with `Failed to resolve import "./projects"` and `Failed to resolve import "./ProjectCard"`.

- [ ] **Step 3: Implement `sortProjects` and `ProjectCard`**

`src/lib/projects.js`:
```js
// Featured first. Array.prototype.sort is stable, so the order inside each group is kept.
export function sortProjects(list) {
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
}
```

`src/components/ProjectCard.jsx`:
```jsx
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
```

- [ ] **Step 4: Run the unit tests to verify they pass**

Run: `npx vitest run src/lib/projects.test.js src/components/ProjectCard.test.jsx`
Expected: PASS (6 tests).

- [ ] **Step 5: Add the failing App assertion**

Add inside `describe('App', ...)` in `src/App.test.jsx`, and add `import { projects } from './data/projects'` at the top:
```jsx
  it('renders every project card', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: '~/projects' })).toBeInTheDocument()
    for (const project of projects) {
      expect(screen.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument()
    }
  })
```

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL with `Unable to find an accessible element with the role "heading" and name "~/projects"`.

- [ ] **Step 6: Implement the Projects section and add it to App**

`src/sections/Projects.jsx`:
```jsx
import { projects } from '../data/projects'
import { sortProjects } from '../lib/projects'
import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
  return (
    <Section id="projects">
      <div className="grid gap-6 md:grid-cols-2">
        {sortProjects(projects).map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  )
}
```

`src/App.jsx`: add `import Projects from './sections/Projects'` and render `<Projects />` right after `<Stack />` inside `<main>`.

- [ ] **Step 7: Run all tests and check in the browser**

Run: `npm test`
Expected: PASS.

Run: `npm run dev`. Expected: the featured project spans the full width on desktop with the image beside the text; the "Example Demo Project" shows a placeholder block and only a `github ↗` link; the example screenshots (missing files) fall back to placeholders.

- [ ] **Step 8: Commit**

```bash
git add src/lib src/components/ProjectCard.jsx src/components/ProjectCard.test.jsx src/sections/Projects.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: add projects section with featured sorting and image fallbacks"
```

---

### Task 7: Experience and Certs sections

**Why:** The internship supports the projects. A timeline shows progression at a glance. Certs are a compact list with a verify link where one exists, because a verifiable cert is worth more than a picture of one.

**Files:**
- Create: `src/sections/Experience.jsx`, `src/sections/Certs.jsx`
- Modify: `src/App.jsx`, `src/App.test.jsx`

**Interfaces:**
- Consumes: `experience`, `certs` (Task 2); `Section`, `Tag`, `ExternalLink` (Task 3)

- [ ] **Step 1: Add the failing App assertions**

Add inside `describe('App', ...)` in `src/App.test.jsx`, plus `import { experience } from './data/experience'` and `import { certs } from './data/certs'` at the top:
```jsx
  it('renders experience and certs from data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: '~/experience' })).toBeInTheDocument()
    for (const job of experience) {
      expect(screen.getByText(job.points[0])).toBeInTheDocument()
    }
    expect(screen.getByRole('heading', { level: 2, name: '~/certs' })).toBeInTheDocument()
    for (const cert of certs) {
      expect(screen.getByText(cert.name)).toBeInTheDocument()
    }
    const verifyLinks = screen.queryAllByRole('link', { name: /verify/ })
    expect(verifyLinks).toHaveLength(certs.filter((c) => c.verifyUrl).length)
  })
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL with `Unable to find an accessible element with the role "heading" and name "~/experience"`.

- [ ] **Step 3: Implement Experience and Certs**

`src/sections/Experience.jsx`:
```jsx
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
```

`src/sections/Certs.jsx`:
```jsx
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
```

`src/App.jsx`: add `import Experience from './sections/Experience'` and `import Certs from './sections/Certs'`, and render `<Experience />` then `<Certs />` after `<Projects />` inside `<main>`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Experience.jsx src/sections/Certs.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: add experience timeline and certs list"
```

---

### Task 8: Contact section with Formspree form

**Why:** The contact form is the only part of the site that talks to the network, so it is the part most likely to fail. Validation and sending live in `src/lib/contact.js` (pure functions, easy to test), and the form component only manages UI state (`idle → sending → success | error`). The Formspree ID comes from an environment variable (`VITE_FORMSPREE_ID`): config is kept out of the code, and if it is missing the visitor still gets Amar's email instead of a broken form.

**Files:**
- Create: `src/lib/contact.js`, `src/lib/contact.test.js`, `src/components/ContactForm.jsx`, `src/components/ContactForm.test.jsx`, `src/sections/Contact.jsx`
- Modify: `src/App.jsx`, `src/App.test.jsx`

**Interfaces:**
- Consumes: `profile` (Task 2); `Section`, `ExternalLink`, `btnPrimary` (Task 3)
- Produces:
  - `validateContact({ name, email, message }) → { name?: string, email?: string, message?: string }` (empty object = valid)
  - `sendContact(formId, values) → Promise<void>`, rejects on network error or non-2xx
  - `ContactForm({ formId, fallbackEmail })`

- [ ] **Step 1: Write the failing tests**

`src/lib/contact.test.js`:
```js
import { validateContact, sendContact } from './contact'

describe('validateContact', () => {
  it('returns no errors for valid input', () => {
    expect(validateContact({ name: 'Ali', email: 'ali@example.com', message: 'Hi' })).toEqual({})
  })

  it('requires every field, ignoring whitespace', () => {
    const errors = validateContact({ name: '  ', email: '', message: ' ' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name'])
  })

  it('rejects a malformed email', () => {
    expect(validateContact({ name: 'Ali', email: 'ali@', message: 'Hi' })).toEqual({
      email: 'Please enter a valid email address.',
    })
  })
})

describe('sendContact', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('posts JSON to the Formspree endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    await sendContact('abc123', { name: 'Ali', email: 'ali@example.com', message: 'Hi' })
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://formspree.io/f/abc123')
    expect(options.method).toBe('POST')
    expect(options.headers.Accept).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({ name: 'Ali', email: 'ali@example.com', message: 'Hi' })
  })

  it('rejects when Formspree returns an error status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 422 }))
    await expect(sendContact('abc123', {})).rejects.toThrow('422')
  })
})
```

`src/components/ContactForm.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'

const EMAIL = 'amar@example.com'

async function fillForm(user) {
  await user.type(screen.getByLabelText('name'), 'Ali')
  await user.type(screen.getByLabelText('email'), 'ali@example.com')
  await user.type(screen.getByLabelText('message'), 'Hello there')
}

describe('ContactForm', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('shows the email instead of a form when no Formspree ID is configured', () => {
    render(<ContactForm formId="" fallbackEmail={EMAIL} />)
    expect(screen.queryByRole('button', { name: /send/ })).toBeNull()
    expect(screen.getByRole('link', { name: EMAIL })).toHaveAttribute('href', `mailto:${EMAIL}`)
  })

  it('shows field errors and does not send when fields are empty', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactForm formId="abc123" fallbackEmail={EMAIL} />)

    await user.click(screen.getByRole('button', { name: /send/ }))

    expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter your email.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a message.')).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toHaveAttribute('aria-invalid', 'true')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends, shows success and clears the form', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    render(<ContactForm formId="abc123" fallbackEmail={EMAIL} />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /send/ }))

    expect(await screen.findByText(/Message sent/)).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toHaveValue('')
  })

  it('shows the email as a fallback when sending fails', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<ContactForm formId="abc123" fallbackEmail={EMAIL} />)

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /send/ }))

    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: EMAIL })).toBeInTheDocument()
    expect(screen.getByLabelText('message')).toHaveValue('Hello there')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/contact.test.js src/components/ContactForm.test.jsx`
Expected: FAIL with `Failed to resolve import "./contact"` and `Failed to resolve import "./ContactForm"`.

- [ ] **Step 3: Implement `src/lib/contact.js`**

```js
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Please enter your name.'
  if (!email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Please enter a valid email address.'
  if (!message.trim()) errors.message = 'Please enter a message.'
  return errors
}

export async function sendContact(formId, values) {
  const response = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  })
  if (!response.ok) throw new Error(`Formspree responded with ${response.status}`)
}
```

- [ ] **Step 4: Implement `src/components/ContactForm.jsx`**

```jsx
import { useState } from 'react'
import { validateContact, sendContact } from '../lib/contact'
import { btnPrimary } from './buttonStyles'

const EMPTY = { name: '', email: '', message: '', _gotcha: '' }

function Field({ label, name, type = 'text', multiline = false, value, error, onChange }) {
  const Control = multiline ? 'textarea' : 'input'
  const errorId = `${name}-error`
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-xs text-muted">
        {label}
      </label>
      <Control
        id={name}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? 5 : undefined}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-1.5 w-full rounded border border-line bg-bg px-3 py-2 text-heading focus:border-accent"
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

function EmailLink({ email }) {
  return (
    <a href={`mailto:${email}`} className="text-accent hover:underline">
      {email}
    </a>
  )
}

export default function ContactForm({ formId, fallbackEmail }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  if (!formId) {
    return (
      <p className="leading-relaxed">
        Email me directly at <EmailLink email={fallbackEmail} />.
      </p>
    )
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validateContact(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('sending')
    try {
      await sendContact(formId, values)
      setValues(EMPTY)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="name" name="name" value={values.name} error={errors.name} onChange={handleChange} />
      <Field label="email" name="email" type="email" value={values.email} error={errors.email} onChange={handleChange} />
      <Field label="message" name="message" multiline value={values.message} error={errors.message} onChange={handleChange} />

      {/* Honeypot: hidden from people, bots fill it in, Formspree drops those submissions. */}
      <input
        type="text"
        name="_gotcha"
        value={values._gotcha}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <button type="submit" disabled={status === 'sending'} className={`${btnPrimary} disabled:opacity-60`}>
        {status === 'sending' ? 'sending…' : 'send message'}
      </button>

      <div role="status" aria-live="polite" className="min-h-6 text-sm">
        {status === 'success' && <p className="text-accent">Message sent. I&apos;ll get back to you soon.</p>}
        {status === 'error' && (
          <p>
            Something went wrong. Please email me directly at <EmailLink email={fallbackEmail} />.
          </p>
        )}
      </div>
    </form>
  )
}
```

- [ ] **Step 5: Run the unit tests to verify they pass**

Run: `npx vitest run src/lib/contact.test.js src/components/ContactForm.test.jsx`
Expected: PASS (9 tests).

- [ ] **Step 6: Add the failing App assertion**

Add inside `describe('App', ...)` in `src/App.test.jsx`:
```jsx
  it('renders the contact section with direct links', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: '~/contact' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: profile.email }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /linkedin/ })).toHaveAttribute('href', profile.linkedin)
  })
```

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL with `Unable to find an accessible element with the role "heading" and name "~/contact"`.

- [ ] **Step 7: Implement the Contact section and add it to App**

`src/sections/Contact.jsx`:
```jsx
import { profile } from '../data/profile'
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
              <span className="text-muted">linkedin </span>
              <ExternalLink href={profile.linkedin} className="text-heading hover:text-accent">
                linkedin <span aria-hidden="true">↗</span>
              </ExternalLink>
            </li>
            <li>
              <span className="text-muted">github </span>
              <ExternalLink href={profile.github} className="text-heading hover:text-accent">
                github <span aria-hidden="true">↗</span>
              </ExternalLink>
            </li>
          </ul>
        </div>
        <ContactForm formId={import.meta.env.VITE_FORMSPREE_ID} fallbackEmail={profile.email} />
      </div>
    </Section>
  )
}
```

`src/App.jsx`: add `import Contact from './sections/Contact'` and render `<Contact />` after `<Certs />` inside `<main>`.

- [ ] **Step 8: Run all tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/lib/contact.js src/lib/contact.test.js src/components/ContactForm.jsx src/components/ContactForm.test.jsx src/sections/Contact.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: add contact section with validated Formspree form and email fallback"
```

---

### Task 9: Scroll fade-in, content check, and final verification

**Why:** The fade-in is the only decorative motion, so it must never hide content: if the visitor prefers reduced motion or the browser lacks `IntersectionObserver`, content shows immediately. The content-check script is a safety net so placeholder text or a missing CV can never reach recruiters. The final checks prove the spec's quality targets instead of assuming them.

**Files:**
- Create: `src/components/Reveal.jsx`, `src/components/Reveal.test.jsx`, `scripts/check-content.js`
- Modify: `src/components/Section.jsx`

**Interfaces:**
- Consumes: `Section` (Task 3); every data file (Task 2)
- Produces: `Reveal({ children })`, a wrapper `div` with `data-visible="true|false"`

- [ ] **Step 1: Write the failing tests `src/components/Reveal.test.jsx`**

```jsx
import { render, screen, act } from '@testing-library/react'
import Reveal from './Reveal'

function stubMatchMedia(reduce) {
  vi.stubGlobal('matchMedia', (query) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }))
}

describe('Reveal', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('is visible immediately when IntersectionObserver is not available', () => {
    stubMatchMedia(false)
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-visible', 'true')
  })

  it('is visible immediately when the user prefers reduced motion', () => {
    stubMatchMedia(true)
    vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
    render(<Reveal><p>content</p></Reveal>)
    expect(screen.getByText('content').parentElement).toHaveAttribute('data-visible', 'true')
  })

  it('starts hidden and becomes visible when scrolled into view', () => {
    stubMatchMedia(false)
    let trigger
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback) { trigger = callback }
        observe() {}
        disconnect() {}
      },
    )
    render(<Reveal><p>content</p></Reveal>)
    const wrapper = screen.getByText('content').parentElement
    expect(wrapper).toHaveAttribute('data-visible', 'false')

    act(() => trigger([{ isIntersecting: true }]))
    expect(wrapper).toHaveAttribute('data-visible', 'true')
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/Reveal.test.jsx`
Expected: FAIL with `Failed to resolve import "./Reveal"`.

- [ ] **Step 3: Implement `src/components/Reveal.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'

function shouldSkipAnimation() {
  const reduceMotion =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return reduceMotion || typeof window.IntersectionObserver !== 'function'
}

export default function Reveal({ children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(shouldSkipAnimation)

  useEffect(() => {
    if (visible) return undefined
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={`transition-[opacity,translate] duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/Reveal.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Wrap section content in Reveal**

`src/components/Section.jsx`:
```jsx
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
```

Run: `npm test`
Expected: PASS (jsdom has no `IntersectionObserver`, so every section renders visible in the App test).

- [ ] **Step 6: Create `scripts/check-content.js`**

```js
// Run before deploying: fails if placeholder content or required files are missing.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { projects } from '../src/data/projects.js'

const problems = []

function scanForTodo(path) {
  readFileSync(path, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      if (/todo/i.test(line)) problems.push(`${path}:${index + 1}  ${line.trim()}`)
    })
}

const dataDir = 'src/data'
for (const file of readdirSync(dataDir)) {
  if (file.endsWith('.js') && !file.endsWith('.test.js')) scanForTodo(join(dataDir, file))
}
scanForTodo('index.html')

if (!existsSync('public/cv.pdf')) problems.push('public/cv.pdf is missing')

for (const project of projects) {
  if (project.image && !existsSync(join('public', project.image))) {
    problems.push(`Screenshot for "${project.title}" not found: public${project.image}`)
  }
}

if (problems.length > 0) {
  console.error(`Content check failed (${problems.length} problem(s)):\n`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log('Content check passed.')
```

- [ ] **Step 7: Verify the content check catches placeholders**

Run: `npm run check:content`
Expected: FAIL (exit code 1) listing the `TODO` lines in `src/data/*.js` and `index.html`, `public/cv.pdf is missing`, and the two missing example screenshots. This is correct for now; it must pass before deploying.

- [ ] **Step 8: Full verification**

Run: `npm test`
Expected: all tests PASS.

Run: `npm run build`
Expected: `✓ built in ...`, no errors or warnings.

Run: `npm run preview`, open the printed URL, then check:
- At 360px, 768px and 1280px widths: no horizontal scroll; the featured project card switches to side-by-side at ≥768px.
- Keyboard only: `Tab` first shows "Skip to content"; every link and button shows a green focus outline; the mobile menu opens with `Enter`.
- With OS "Reduce motion" on: sections appear without fading and the cursor does not blink.
- Lighthouse (Chrome DevTools → Lighthouse → Mobile): Performance ≥ 90 and Accessibility ≥ 90. Fix any reported contrast or label issue before continuing.

- [ ] **Step 9: Commit**

```bash
git add src/components/Reveal.jsx src/components/Reveal.test.jsx src/components/Section.jsx scripts/check-content.js
git commit -m "feat: add reduced-motion-safe scroll reveal and pre-deploy content check"
```

---

## After this plan (not tasks, for Amar)

1. Replace every `TODO` with real content, add `public/cv.pdf` and screenshots in `public/projects/`, until `npm run check:content` passes.
2. Create a free Formspree form and put its ID in `.env.local` as `VITE_FORMSPREE_ID=...`.
3. Push to GitHub, import the repo in Vercel, and add `VITE_FORMSPREE_ID` in Vercel → Project → Settings → Environment Variables.

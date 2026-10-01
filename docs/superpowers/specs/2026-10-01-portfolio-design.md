# Portfolio Website — Design Spec

**Date:** 2026-10-01
**Owner:** Amar
**Status:** Draft for review

## 1. Purpose

A personal portfolio website to help Amar get hired as a **Full Stack Developer** (React + Laravel). The primary audience is recruiters, HR staff and technical interviewers, who usually spend 30–60 seconds on a portfolio.

**Success criteria**
- Within a few seconds, a visitor knows who Amar is, what role Amar wants, and the core stack.
- Projects with live demos and real production use are the most prominent content.
- A visitor can download the CV and contact Amar from anywhere on the page within one click.
- The site does not look like a generic template or "AI slop".
- The site scores ≥ 90 on Lighthouse Performance and Accessibility (mobile).

**Secondary goal:** Amar is learning while building. Every implementation step is explained (what and why).

## 2. Scope

**Phase 1 (this spec):** frontend-only, single-page site with content stored in local data files.

**Phase 2 (future, out of scope here):** a Laravel API + admin panel to manage projects, certs and experience. Phase 1 is structured so the data files can be replaced by API calls without changing the component props.

**Out of scope for Phase 1:** blog, multiple languages (site is English only), routing/multi-page, CMS, dark/light toggle (dark only), analytics.

## 3. Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Build tool | Vite | Fast dev server, current standard for new React projects |
| UI | React (JSX) | Amar already knows React; skills transfer directly to work |
| Styling | Tailwind CSS | Utility classes, easy dark theme, widely used in industry |
| Contact form | Formspree | Sends form submissions to email without a backend |
| Hosting | Vercel | Free, auto-deploys from GitHub |

No React Router, no state library, no UI component library.

## 4. Visual Design

**Concept:** "a clean terminal", developer-flavoured but readable for non-technical HR.

- **Background:** near-black `#0b0d0e`; surfaces slightly lighter (e.g. `#121517`); borders subtle grey.
- **Text:** light grey for body, near-white for headings, muted grey for secondary text.
- **Accent:** a single green, `#4ade80`, used only for links, key buttons, the cursor and status highlights. No other accent colours.
- **Typography:** JetBrains Mono for headings, labels, nav and tech tags; a clean sans-serif (e.g. Inter) for paragraphs.
- **Identity details:**
  - Section headings styled as paths: `~/about`, `~/stack`, `~/projects`, `~/experience`, `~/certs`, `~/contact`.
  - Navbar brand: `amar@portfolio:~$`.
  - Tech tags rendered as `[react]`, `[laravel]`.
  - A blinking cursor after Amar's name in the hero (the only terminal-style animation).
- **Motion:** subtle fade-in on scroll only; fully disabled under `prefers-reduced-motion`.

**Explicitly avoided ("AI slop" tells):** purple/blue gradients, floating blurred blobs, glassmorphism cards, emoji in headings, skill percentage bars, generic copy such as "Crafting seamless digital experiences", identical three-column feature cards, decorative animation without purpose.

## 5. Page Structure

Single page, sticky navbar with anchor links. Order:

1. **Navbar:** brand, anchor links to each section, `Resume` button (opens `/cv.pdf`). Collapses to a menu on mobile.
2. **Hero:** name with blinking cursor, role "Full Stack Developer", one specific sentence about Amar, buttons: `View Projects`, `GitHub`, `Download CV`.
3. **`~/about`:** 2–3 short paragraphs.
4. **`~/stack`:** grouped tags: Frontend, Backend, Database, Tools. Text and tags only.
5. **`~/projects`:** project cards. Featured projects first and larger. Each card: screenshot, title, 1–2 sentence description (problem solved), tech tags, `Live` and `GitHub` links, status label (`in production` highlighted in green, or `demo`).
6. **`~/experience`:** timeline of internships/jobs: company, role, period, 2–3 bullet points, tech tags.
7. **`~/certs`:** list of certifications: name, issuer, year, verify link.
8. **`~/contact`:** email, LinkedIn, GitHub, and a Formspree contact form (name, email, message).
9. **Footer:** "Built with React + Tailwind", link to this site's repo, year.

Responsive: designed mobile-first; must work at 360px width with no horizontal scroll.

## 6. Code Structure

```
Portfolio.Amar/
├── public/
│   ├── cv.pdf
│   └── projects/            # project screenshots
├── src/
│   ├── data/                # ALL content lives here
│   │   ├── profile.js       # name, role, tagline, bio, email, social links
│   │   ├── projects.js
│   │   ├── experience.js
│   │   ├── certs.js
│   │   └── stack.js
│   ├── components/          # small reusable UI pieces
│   │   ├── Navbar.jsx
│   │   ├── SectionHeading.jsx
│   │   ├── ProjectCard.jsx
│   │   └── Tag.jsx
│   ├── sections/            # one file per page section
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Stack.jsx
│   │   ├── Projects.jsx
│   │   ├── Experience.jsx
│   │   ├── Certs.jsx
│   │   └── Contact.jsx
│   ├── App.jsx              # composes sections in order
│   ├── main.jsx
│   └── index.css            # Tailwind import + base styles
└── docs/superpowers/specs/  # this spec
```

**Rule:** components and sections never hard-code content; they read from `src/data/`.

## 7. Data Shapes

These shapes are the contract that the Phase 2 Laravel API will also return.

```js
// profile.js
{ name, role, tagline, about: [paragraph, ...], email, github, linkedin, cvUrl }

// projects.js — array
{ title, description, image, tech: [string], liveUrl, githubUrl,
  status: "in production" | "demo", featured: boolean }

// experience.js — array, newest first
{ company, role, period, points: [string], tech: [string] }

// certs.js — array
{ name, issuer, year, verifyUrl }

// stack.js — array of groups
{ category: "Frontend" | "Backend" | "Database" | "Tools", items: [string] }
```

Optional fields (`liveUrl`, `githubUrl`, `verifyUrl`, `image`) may be missing; the UI hides the matching link or shows a plain placeholder block instead of a broken image.

## 8. Error Handling & Edge Cases

- Missing optional URLs → the link is not rendered (no dead buttons).
- Missing project image → neutral placeholder showing the project title.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Contact form: client-side required fields + email format; shows sending / success / error states; on error, shows the email address as a fallback.

## 9. Accessibility & Performance

- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`), one `h1`.
- Text contrast meets WCAG AA on the dark background.
- Visible keyboard focus styles using the accent colour.
- All images have `alt` text; images are lazy-loaded below the fold.
- Reduced-motion respected.

## 10. Testing & Verification

- Manual check in the browser at desktop and mobile widths (360px, 768px, 1280px).
- Keyboard-only navigation check.
- Lighthouse (mobile): Performance and Accessibility ≥ 90.
- `npm run build` succeeds with no errors.
- No unit tests for Phase 1: the components are presentational with no logic worth unit testing.

## 11. Content Amar Needs to Provide

- Name, one-sentence tagline, 2–3 about paragraphs
- Email, GitHub URL, LinkedIn URL
- `cv.pdf`
- For each project: title, description, tech, live URL, GitHub URL, status, screenshot
- Internship details: company, role, period, points, tech
- Certifications: name, issuer, year, verify link
- Stack list by category
- Formspree form ID (Amar creates the free account)

Placeholder content clearly marked `TODO: replace` may be used during development, but the site is not deployed until real content replaces it.

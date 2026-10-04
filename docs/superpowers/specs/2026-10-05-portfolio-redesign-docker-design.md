# Portfolio Redesign + Docker — Design Spec

**Date:** 2026-10-05
**Owner:** Amar
**Status:** Draft for review
**Supersedes:** sections 4–9 of `2026-10-01-portfolio-design.md` (visual design, page structure, code structure, data shapes, edge cases, accessibility). Sections 1–3 (purpose, scope, stack) and the learning goal still apply unless changed below.

## 1. Why

Phase 1 shipped a working "clean terminal" site. Amar judged it too plain and too code-flavoured for non-technical HR readers. A new design was produced in Claude Design (bento hero + product showcase) and handed off in `docs/design-handoff/`. Amar also wants to learn Docker on this project.

**Success criteria (in addition to Phase 1's):**
- The built page matches `docs/design-handoff/reference/screenshot-desktop.png` (1280px) and `screenshot-mobile.png` (375px).
- An HR reader sees, without scrolling on desktop: open-to-work status, role, core stack, number of live projects, a featured live project.
- Lighthouse (mobile and desktop) Accessibility ≥ 95, Performance ≥ 90.
- `docker compose up` runs the dev site; `docker compose --profile prod up --build` serves the production build from Nginx.

## 2. Source of truth

1. This spec (wins on any conflict).
2. `docs/design-handoff/design-system/BRAND-BOOK.md`, `tokens.json`, `components/*.md` — visual rules and exact values.
3. `docs/design-handoff/design-system/components/bundle.js` + `bundle.css` — prototype markup, class structure, states. Rewritten as JSX + Tailwind; not copied.
4. `docs/design-handoff/reference/*` — screenshots and HTML prototypes.

`docs/design-handoff/BUILD-NOTES.md` is the design tool's original build note; where it conflicts with this spec, this spec wins (see §3).

## 3. Decisions that differ from the handoff

| Topic | Handoff | Decision | Reason |
|---|---|---|---|
| Content files | one `src/content.js` | keep `src/data/*.js`, one file per kind, using the handoff's field names | one file per resource maps 1:1 to future Laravel API endpoints; existing tests and content check build on it |
| React | 18 | 19 (already installed) | no API used by the design differs |
| Tailwind | v3 config (`tailwind.tokens.js`) | v4 `@theme` block in `src/index.css` with the same token names | already on v4 |
| Contact config | `VITE_CONTACT_ENDPOINT` | adopt `VITE_CONTACT_ENDPOINT` (full URL), replacing `VITE_FORMSPREE_ID` | a full URL lets Phase 2 point the form at Laravel without code changes |
| CV path | `/cv/Amar-CV.pdf` | adopt | — |
| Placeholders | `[square brackets]` | adopt; replaces `TODO: replace` | matches handoff content; `check:content` detects them |
| Project `index` ("01") | hand-written per project | derived from display order | avoids duplicate or out-of-order numbers |
| Hero stat "[3] live projects" | hand-written | derived: count of projects with `status: 'live'` | the number can never disagree with the Work section or be invented |
| `mock` wireframes | drawn in frames when no screenshot | not built | handoff says design comps only; real screenshots or the placeholder are used |

## 4. Visual design

Implement the handoff exactly. Summary of what changes from Phase 1:

- **Tokens** (from `tokens.json` / `tailwind.tokens.js`): colours `bg #0b0d0e`, `surface #151a1c`, `surface-raised #1b2124`, `border #1f2528` (decorative only), `border-input #66727a` (controls), `text #c9d1d6`, `heading #f1f5f7`, `muted #8a959c`, `accent #4ade80`, `on-accent #0b0d0e`, `accent-soft #10251a`, `neutral-soft #232a2e`, `danger #fca5a5`; radii `sm 6px`, `md 10px`, `lg 16px`; type scale `display 56/60` (`36/40` mobile), `h2 36/42` (`28/34`), `h3 24/30`, `h3-lg 32/38`, `lead 20/30`, `body 16/26`, `small 14/22`, `label` mono 12 uppercase +0.04em, `tag` mono 12, `stat` mono 48/52; focus ring `0 0 0 2px bg, 0 0 0 4px accent`; content max width 1200px; nav height 64px.
- **Fonts:** Inter 400/500/600/700, JetBrains Mono 400/500.
- **Labels:** plain words (Work, Experience, Certifications, About, Contact). The `~/path` headings, `[tag]` brackets and blinking cursor from Phase 1 are removed.
- **Motion:** `Reveal` fade-and-rise 12px / 500ms; live and open-to-work dots pulse slowly; both off under `prefers-reduced-motion`.
- **Allowed exceptions from Phase 1 rules:** navbar uses `bg` at 92% with a light backdrop blur for legibility (brand book §Colour); `danger` text for form errors.

## 5. Page structure

Sticky **Navbar** → **Hero bento** (`#top`) → **Work** (`#work`, 01) → **Experience** (`#experience`, 02) → **Certifications** (`#certifications`, 03) → **About** (`#about`, 04) → **Contact** (`#contact`, 05) → **Footer**. One `<h1>` (hero headline); each section opens with `SectionHeading` (`<h2>` + mono index + optional subtitle); project names, roles and the form success title are `<h3>`. Every section has `scroll-margin-top: 64px`.

- **Navbar:** wordmark "Amar." (dot in accent) → `#top`; links Work, Experience, Certifications, Contact; primary small button "Download CV" (downloads PDF). Below `md` (768px): links move into a menu sheet; **Contact link and Download CV stay visible**; the menu button has `aria-expanded`/`aria-controls`, closes on link tap and on Escape.
- **Hero bento:** 4 columns × 4 rows, 16px gap (desktop). Tiles and placement as in BRAND-BOOK §Hero bento: intro (Open-to-work badge when `openToWork`, H1 headline, role line, "See my work" → `#work`, "Download CV"), photo (real photo or labelled silhouette placeholder), location ("Based in" / "[City], Malaysia" / work mode), stat ("Shipped" / derived live count / "live projects with real users"), stack (TagList + one-line caption), currently ("Currently" / "Learning Docker" / "Let's talk →" `#contact`), featured project (whole tile links to the featured project row; name, Live badge, BrowserFrame, "View →"). Below `md`: one column in order intro → stat → location → featured → stack → currently → photo.
- **Work:** featured project full width (screenshot 7 / text 5, optional overlapping PhoneFrame); others two-up, one column below `md`. Each row: index (+ " — FEATURED"), StatusBadge, name, problem, Result strip (if `outcome`), TagList, actions: "View live" / "View demo" (primary, external) and "GitHub" (secondary, external) or a lock + "Private client code" note.
- **Experience:** `<ol>` timeline, newest first; date column left (above the role below `md`), rail with dot (filled accent when `current`), role @ company, bullets, TagList.
- **Certifications:** `<ul>` of rows: name, "issuer · year", "Verify ↗" external link only if `verifyUrl`.
- **About:** two columns (heading 4 / text 7), first paragraph larger and in `heading` colour; one column below `md`.
- **Contact:** left: heading, lead sentence, list of Email / LinkedIn / GitHub rows (mono label + link); right: ContactForm. One column below `md`.
- **Footer:** "© {current year} {name} · Built with React + Tailwind" and "View source" (only if `sourceUrl`).

## 6. Code structure

```
src/
  main.jsx  App.jsx  index.css          # index.css: Tailwind import, @theme tokens, base, keyframes, small component CSS
  data/
    profile.js  stack.js  projects.js  experience.js  certifications.js
    data.test.js
  lib/
    projects.js      # orderProjects(), liveCount()
    contact.js       # validateContact(), sendContact()
  components/
    Icon.jsx  Button.jsx  Tag.jsx (Tag + TagList)  StatusBadge.jsx  SectionHeading.jsx
    BentoTile.jsx  BrowserFrame.jsx (BrowserFrame + PhoneFrame)  ProjectRow.jsx
    TimelineItem.jsx  CertItem.jsx  ContactForm.jsx  Navbar.jsx  Reveal.jsx
  sections/
    Hero.jsx  Work.jsx  Experience.jsx  Certifications.jsx  About.jsx  Contact.jsx  Footer.jsx
public/
  cv/Amar-CV.pdf   images/   (photo, project screenshots)   favicon.svg  robots.txt
```

Removed from Phase 1: `components/Section.jsx`, `components/ExternalLink.jsx` (replaced by `Button external`), `components/buttonStyles.js`, `components/Footer.jsx` (moves to `sections/`), `sections/Stack.jsx`, `sections/Projects.jsx`, `sections/Certs.jsx`, `data/certs.js`, `lib/projects.js`'s `sortProjects`.

Rule unchanged: components and sections never hard-code content; it comes from `src/data/`.

## 7. Data shapes

```js
// profile.js
export const profile = {
  name, headline, role, openToWork: boolean, city, workMode, photo?, cvUrl,
  currentlyLearning, email, linkedin, github, sourceUrl?,
  about: [string, string, string],
}

// stack.js
export const stack = [string]          // official casing: 'JavaScript', 'MySQL'

// projects.js — array in display order; exactly one featured
{ id, featured?: boolean, status: 'live' | 'demo', name, problem, outcome?, tags: [string],
  liveUrl?, githubUrl?: string | null, privateNote?, image?, imageAlt?, phoneImage? }

// experience.js — newest first
{ role, company, period, bullets: [string], tags?: [string], current?: boolean }

// certifications.js — newest first
{ name, issuer, year, verifyUrl? }
```

`orderProjects(projects)` returns the featured project first, then the rest in file order, each with `index` "01", "02"…. `liveCount(projects)` counts `status === 'live'`.

## 8. Behaviour and edge cases

- Missing `githubUrl` → lock + `privateNote` or "Private client code"; never a dead button.
- Missing `liveUrl` → no live/demo button.
- Missing `image`, or image fails to load → hatched placeholder with project name and "Screenshot coming soon" (`role="img"`, labelled).
- Missing `phoneImage` → no phone frame.
- Missing `photo`, or photo fails to load → silhouette placeholder labelled "[Professional photo]".
- Missing `verifyUrl` → no Verify link. Missing `sourceUrl` → no View source link.
- `openToWork: false` → no Open-to-work badge.
- External links: new tab, `rel="noopener noreferrer"`, accessible name says "(opens in new tab)".
- **Contact form:** validates on submit — name required; email required and well-formed; message ≥ 10 characters (trimmed). Errors appear under each field with an alert icon, linked by `aria-describedby`, field gets `aria-invalid`, and focus moves to the first invalid field. Editing a field clears its error. Sending: button shows "Sending…" and is `aria-disabled`. Success: form replaced by a `role="status"` panel ("Message sent — thank you, {first name}.") with "Send another message" which resets the form. Failure (network error, non-2xx): `role="alert"` message under the fields with the email address as a link; typed values are kept. Request times out after 15 s and is treated as a failure.
- **No `VITE_CONTACT_ENDPOINT`:** the form is not rendered; the contact panel says "Email me directly at {email}."

## 9. Accessibility and performance

- WCAG AA contrast on every surface (lowest pair `muted` on `surface-raised` 5.3:1); control edges use `border-input` (≥ 3.5:1).
- Focus ring on every interactive element via `:focus-visible`.
- Touch targets ≥ 40px (buttons 44px, nav button 36px desktop / 40px mobile).
- Status is never colour-only: badges always include a word.
- Images lazy-load except the hero; `width`/`height` or aspect-ratio set to avoid layout shift.
- Printing / saving as PDF shows all sections (`@media print` disables the reveal opacity).

## 10. Docker

Learning goal: understand images, containers, layers, volumes, ports, multi-stage builds, and build-time vs run-time configuration. Vercel remains the deploy target; Docker is an alternative way to run the project and the base for Phase 2 (Laravel + MySQL services join the same compose file later).

**Files:** `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `docker/nginx.conf`.

**Dockerfile stages** (base `node:22-alpine`):
- `deps` — copy `package.json` + `package-lock.json`, `npm ci` (cached layer).
- `dev` — from `deps`, copy source, `npm run dev -- --host 0.0.0.0`, expose 5173.
- `build` — from `deps`, copy source, `ARG VITE_CONTACT_ENDPOINT`, `npm run build`.
- `prod` — `nginx:alpine`, copy `docker/nginx.conf` and `/app/dist`, expose 80.

**docker-compose.yml:**
- `web` (default): target `dev`, port `5173:5173`, bind-mount the project into `/app`, anonymous volume for `/app/node_modules` so the container keeps its own Linux packages.
- `web-prod` (profile `prod`): target `prod`, build arg `VITE_CONTACT_ENDPOINT` from the host environment, port `8080:80`.

**nginx.conf:** SPA fallback (`try_files $uri $uri/ /index.html`); `Cache-Control: public, max-age=31536000, immutable` for `/assets/`; `no-cache` for `index.html`; headers `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`; gzip for text assets.

**`.dockerignore`:** `node_modules`, `dist`, `.git`, `.env*` (except `.env.example`), `docs`, `.superpowers`, `.claude`, `coverage`, `*.log`.

**Docs:** a `README.md` section "Run with Docker" explaining each command and the build-time variable.

**Prerequisite:** Docker Desktop installed by Amar. Docker tasks run last so the redesign does not wait on it.

## 11. Content check (`npm run check:content`)

Fails (exit 1) and lists every problem when:
- any line in `src/data/*.js` (excluding tests) or `index.html` contains a placeholder: a `[` immediately followed by a letter, up to the next `]` (e.g. `'[City]'`, `/in/[handle]`), which does not match array syntax like `['React']`;
- `public/cv/Amar-CV.pdf` is missing;
- `profile.photo`, any project `image` or `phoneImage` points to a file missing under `public/`, compared with exact filename case (Vercel is case-sensitive, macOS is not).

Vercel's build command stays `npm run check:content && npm run build`.

## 12. Testing and verification

- Unit tests (Vitest + Testing Library) where there is logic or risk: data shape contract; `orderProjects` / `liveCount`; ProjectRow fallbacks (no GitHub, no image, failed image, no live URL, demo label, phone frame only when featured with `phoneImage`); BrowserFrame placeholder; StatusBadge text; Navbar (Contact + CV visible outside the menu, menu toggle, closes on link and Escape); ContactForm (validation messages, focus to first invalid field, error clears on edit, success panel + reset, failure alert keeps values, timeout, no endpoint fallback); Reveal (reduced motion, no IntersectionObserver, tall sections); placeholder detection; App smoke test (one h1, every section heading, skip link).
- Visual: compare against reference screenshots at 1280px and 375px; no horizontal scroll at 360/768/1280.
- Lighthouse mobile + desktop: Accessibility ≥ 95, Performance ≥ 90.
- Docker: both images build; `curl localhost:8080` returns the page; `curl localhost:8080/does-not-exist` returns `index.html` (200); `/assets/*` has the immutable cache header; prod image size reported (expected < 60 MB).
- `npm run build` with no warnings.

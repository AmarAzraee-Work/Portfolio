# Portfolio Redesign + Docker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio UI to match the Claude Design handoff (bento hero + product showcase), keep content in `src/data/`, and add Docker dev + production (Nginx) setups.

**Architecture:** New presentational components (`src/components/*`) are built and unit-tested in isolation first, against fixture props. One task then migrates the data files to the new shapes, assembles the new sections, swaps `App.jsx`, and deletes the Phase 1 UI. Pure logic stays in `src/lib/*`; content rules for the pre-deploy check live in `scripts/content-rules.js`. Docker comes last and changes no app code except an opt-in polling flag in `vite.config.js`.

**Tech Stack:** Node 22, Vite 8, React 19, Tailwind CSS 4 (`@theme`), Vitest 5 + Testing Library + jsdom, Formspree (via `VITE_CONTACT_ENDPOINT`), Docker (`node:22-alpine`, `nginx:alpine`), Vercel.

**Spec:** `docs/superpowers/specs/2026-10-05-portfolio-redesign-docker-design.md`. Visual reference: `docs/design-handoff/` (prototype code in `design-system/components/bundle.js` + `bundle.css`, layout in `reference/page-layout.js`, screenshots in `reference/`).

**Learning note:** Amar is learning while building. The executor explains what each task does and why, starting from each task's **Why** line.

## Global Constraints

- Spec wins over the handoff; handoff (`bundle.js`/`bundle.css`) is the source for markup, states and exact values. Rewrite as JSX + Tailwind utilities; small CSS for hatch/silhouette patterns, keyframes and print rules goes in `src/index.css`.
- Tokens (exact): `bg #0b0d0e`, `surface #151a1c`, `surface-raised #1b2124`, `border #1f2528`, `border-input #66727a`, `text #c9d1d6`, `heading #f1f5f7`, `muted #8a959c`, `accent #4ade80`, `on-accent #0b0d0e`, `accent-soft #10251a`, `neutral-soft #232a2e`, `danger #fca5a5`; radius `sm 6px`, `md 10px`, `lg 16px`; focus ring `0 0 0 2px #0b0d0e, 0 0 0 4px #4ade80`; content max 1200px; nav height 64px.
- Type: Inter 400/500/600/700 + JetBrains Mono 400/500. Display 56/60 (36/40 below `md`), h2 36/42 (28/34), h3 24/30, featured h3 32/38, lead 20/30, body 16/26, small 14/22, label mono 12/16 uppercase +0.04em 500, tag mono 12/20, stat mono 48/52 500.
- Mobile breakpoint is Tailwind `md:` (768px). No horizontal scroll at 360, 375, 768, 1280.
- One accent only (`accent`). No gradients (except the handoff's photo silhouette and screenshot hatch placeholders), glows, glassmorphism (except the navbar's legibility blur), emoji in headings, skill bars, sparkle/rocket icons.
- Exactly one `<h1>`; section titles `<h2>` with mono index `01`–`05`; project names, roles, success title `<h3>`.
- Nav labels: Work, Experience, Certifications, Contact. Section order: Hero, Work, Experience, Certifications, About, Contact, Footer.
- Components and sections never hard-code content; it comes from `src/data/`. UI copy fixed by the spec (button labels, form messages) is fine.
- External links: `target="_blank" rel="noopener noreferrer"` and an accessible name ending "(opens in new tab)". Missing URLs render nothing (never a disabled link).
- Motion: Reveal fade-and-rise 12px / 500ms; live/open dots pulse 2.4s; all off under `prefers-reduced-motion`; `@media print` shows everything.
- Contact config: `VITE_CONTACT_ENDPOINT` (full URL). No endpoint → no form, email shown instead.
- Lighthouse (mobile + desktop): Accessibility ≥ 95, Performance ≥ 90. `npm run build` with no warnings.

## Review Focus

1. **Long real content at 375px** (a 60-character project name, a long problem sentence, 8+ tags, a long email): text wraps, buttons stack, no horizontal scroll. Verified in Task 9 with a temporary long-content fixture.
2. **Keyboard user on mobile opens the menu and presses Escape**: menu closes and focus returns to the menu button, so they are not lost on the page. Test in Task 6.
3. **Featured tile / "See my work" anchor jumps**: the target heading lands below the sticky 64px navbar, not hidden under it. Verified in Task 9 (`scroll-margin-top`) with a getBoundingClientRect check.
4. **Contact endpoint answers 200 to a spam-blocked or misconfigured request but the network then hangs, or never answers**: the visitor is not stuck on "Sending…" forever; after 15 s they see the email fallback. Test in Task 5 (timeout).
5. **Docker dev container on macOS**: saving a file on the host updates the page in the container (bind mount + polling), otherwise the dev setup looks broken. Verified in Task 10.

---

## File Map

```
index.html                         # fonts: Inter 400–700, JetBrains Mono 400–500 (Task 1)
vite.config.js                     # + opt-in polling for Docker (Task 10)
src/index.css                      # @theme tokens, base, focus ring, keyframes, placeholders, print (Task 1; aliases removed Task 7)
src/data/profile.js stack.js projects.js experience.js certifications.js data.test.js   (Task 7)
src/lib/projects.js(+test)         # orderProjects, liveCount (Task 3)
src/lib/contact.js(+test)          # validateContact, sendContact (Task 5)
src/components/
  Icon.jsx Button.jsx Tag.jsx StatusBadge.jsx SectionHeading.jsx primitives.test.jsx      (Task 1)
  BentoTile.jsx BrowserFrame.jsx frames.test.jsx                                         (Task 2)
  ProjectRow.jsx ProjectRow.test.jsx                                                     (Task 3)
  TimelineItem.jsx CertItem.jsx timeline-certs.test.jsx                                  (Task 4)
  ContactForm.jsx ContactForm.test.jsx                                                   (Task 5)
  Navbar.jsx Navbar.test.jsx Reveal.jsx Reveal.test.jsx                                  (Task 6)
src/sections/ Hero.jsx Work.jsx Experience.jsx Certifications.jsx About.jsx Contact.jsx Footer.jsx (Task 7)
src/App.jsx App.test.jsx                                                                 (Task 7)
scripts/content-rules.js(+test) check-content.js                                         (Task 8)
public/cv/ public/images/                                                                (Task 7, .gitkeep)
Dockerfile docker-compose.yml .dockerignore docker/nginx.conf README.md                  (Task 10)
```

Deleted in Task 7: `src/components/{Section,ExternalLink,Footer,ProjectCard,ProjectCard.test,components.test}.jsx`, `src/components/buttonStyles.js`, `src/sections/{Stack,Projects,Certs}.jsx`, `src/data/certs.js`. Deleted in Task 8: `scripts/placeholder.js`, `scripts/placeholder.test.js`.

---

### Task 1: Tokens and primitive components

**Why:** Tokens put every colour, size and radius from the design in one place, so components only say *which* token. Icon, Button, Tag, StatusBadge and SectionHeading are used by almost every later component, so they come first.

**Files:**
- Modify: `src/index.css`, `index.html`
- Create: `src/components/Icon.jsx`, `src/components/Button.jsx`, `src/components/StatusBadge.jsx`, `src/components/primitives.test.jsx`
- Replace: `src/components/Tag.jsx`, `src/components/SectionHeading.jsx` (same default export names, new API)
- Modify (Phase 1 adapters so the suite stays green until Task 7 deletes them): `src/components/Section.jsx` renders `<SectionHeading id={`${id}-heading`} title={`~/${id}`} />`; `src/components/components.test.jsx` drops the `Tag` brackets test and the `SectionHeading` test (behaviour removed by design)

**Interfaces:**
- Produces:
  - CSS tokens as Tailwind utilities: `bg-bg`, `bg-surface`, `bg-surface-raised`, `border-border`, `border-border-input`, `text-text`, `text-heading`, `text-muted`, `text-accent`, `text-on-accent`, `bg-accent-soft`, `bg-neutral-soft`, `text-danger`, radii `rounded-sm|md|lg` (6/10/16px), `shadow-focus`, `max-w-content`. Phase 1 aliases `--color-fg` (= text) and `--color-line` (= border) stay until Task 7.
  - CSS classes in `index.css`: `.label` (mono label style), `.pulse-dot` (2.4s opacity pulse), `.shot-placeholder` (hatch), `.photo-placeholder` (silhouette) — values from `bundle.css` `.am-label`, `@keyframes am-pulse`, `.am-placeholder`, `.am-photo`.
  - `Icon({ name: 'download'|'arrow'|'ext'|'menu'|'close'|'lock'|'alert'|'check'|'mail'|'github', className })` → `<svg aria-hidden="true">`; path data copied from `bundle.js` `Icon` and `GitHubIcon`.
  - `Button({ variant='primary'|'secondary'|'ghost', size='md'|'sm', href, external, icon, iconRight, type='button', download, className, children, ...rest })` → `<a>` when `href`, else `<button type>`; `external` adds `target="_blank" rel="noopener noreferrer"`; `aria-disabled="true"` → 50% opacity + `pointer-events-none`. Sizes: md 44px tall / 18px x-padding, sm 36px / 14px; label 15px 600 (sm 14px); radius md.
  - `Tag({ children })`, `TagList({ tags, label = 'Tech stack' })` → `<ul aria-label={label}>` of `<li><Tag/></li>`; tag: 26px tall, `bg-neutral-soft`, `text-text`, mono 12, radius sm.
  - `StatusBadge({ status = 'live'|'demo'|'open', children })` → pill with dot + text; default text `Live` / `Demo` / `Open to work`; live/open dots get `.pulse-dot`; demo dot is hollow.
  - `SectionHeading({ id, index, title, subtitle })` → `<header>` with mono accent index, `<h2 id={id}>`, optional muted subtitle (max 60ch).

- [ ] **Step 1: Write failing tests** in `src/components/primitives.test.jsx`:
  - `Button renders a link with external attributes`: `<Button href="https://x.dev" external>View live</Button>` → `getByRole('link', {name: 'View live'})` has `target="_blank"`, `rel="noopener noreferrer"`.
  - `Button renders a button when there is no href`: `getByRole('button', {name: 'Send'})` has `type="button"`; with `type="submit"` it has `type="submit"`.
  - `Button passes download through`: `<Button href="/cv/Amar-CV.pdf" download>Download CV</Button>` link has attribute `download`.
  - `Icon is hidden from assistive tech`: `container.querySelector('svg')` has `aria-hidden="true"` for `name="download"` and `name="github"`.
  - `TagList renders a labelled list`: `getByRole('list', {name: 'Tech stack'})` contains 3 `listitem`s for `['React','Laravel','MySQL']`; no `[` or `]` in its text.
  - `StatusBadge always shows a word`: live → text `Live`, demo → `Demo`, open → `Open to work`.
  - `SectionHeading renders index, h2 and subtitle`: `<SectionHeading id="work-h" index="01" title="Work" subtitle="Products I built." />` → `getByRole('heading', {level: 2, name: 'Work'})` has `id="work-h"`; text `01` and `Products I built.` present.

- [ ] **Step 2: Run** `npx vitest run src/components/primitives.test.jsx` — Expected: FAIL (`Failed to resolve import "./Icon"` / `"./Button"` / `"./StatusBadge"`, TagList not exported).

- [ ] **Step 3: Update `src/index.css`**: replace the `@theme` block with the tokens above (keep `--color-fg` and `--color-line` aliases), `--radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;`, `--shadow-focus`, `--container-content: 1200px` (gives `max-w-content`); body uses `bg`/`text`/16px/26px; `:focus-visible { outline: none; box-shadow: var(--shadow-focus); }`; `html { scroll-behavior: smooth; }` (remove `scroll-padding-top`; sections get `scroll-mt-16` instead); add `.label`, `.pulse-dot`, `.shot-placeholder`, `.photo-placeholder`; reduced-motion block disables `.pulse-dot` and the old `.cursor` animation; `@media print { [data-visible] { opacity: 1 !important; transform: none !important; } }`. In `index.html` change the font URL to `Inter:wght@400;500;600;700` and `JetBrains+Mono:wght@400;500`.

- [ ] **Step 4: Implement** `Icon`, `Button`, `Tag` + `TagList`, `StatusBadge`, `SectionHeading` with the interfaces above; class values from `bundle.css` (`.am-btn*`, `.am-tag*`, `.am-badge*`, `.am-sh*`).

- [ ] **Step 5: Run** `npx vitest run src/components/primitives.test.jsx` — Expected: PASS (7 tests). Then `npm test` — Expected: all PASS (Phase 1 App tests still find `~/about` etc. through the Section adapter). `npm run build` — Expected: built, no errors.

- [ ] **Step 6: Commit** `feat: add design tokens and primitive components (Icon, Button, Tag, StatusBadge, SectionHeading)`

---

### Task 2: BentoTile, BrowserFrame and PhoneFrame

**Why:** These are the "containers" of the design: every hero tile is a BentoTile, every screenshot sits in a BrowserFrame. The placeholder behaviour (no screenshot yet, or a broken one) lives here once, so no project can ever show a broken-image icon.

**Files:**
- Create: `src/components/BentoTile.jsx`, `src/components/BrowserFrame.jsx`, `src/components/frames.test.jsx`

**Interfaces:**
- Consumes: `.label`, `.shot-placeholder` (Task 1).
- Produces:
  - `BentoTile({ eyebrow, href, ariaLabel, flush, className, children })` → `<a>` when `href` (hover `bg-surface-raised`), else `<div>`; `bg-surface border border-border rounded-lg p-6` (no padding when `flush`); `eyebrow` renders `<p class="label">`. `className` carries grid placement.
  - `BrowserFrame({ src, alt, title, url, className })` → frame with 34px bar (three 9px dots, mono 11px URL pill showing `url || 'example.com'`) and a 16:10 view. With `src`: `<img loading="lazy" alt={alt || \`Screenshot of ${title}\`}>` (object-cover, top); on image `error` it switches to the placeholder. Without `src`: `<div role="img" aria-label="{title} — screenshot coming soon">` with the title and label "Screenshot coming soon".
  - `PhoneFrame({ src, alt })` → absolutely positioned 9:19 frame, 26% width (min 96px), 22px radius, 6px `#232a2e` border, `phone-lift` shadow (`0 24px 48px -12px rgba(0,0,0,.6)`); returns `null` without `src`.

- [ ] **Step 1: Write failing tests** in `src/components/frames.test.jsx`:
  - `BentoTile renders eyebrow and children`: eyebrow "Based in" and child text present; no link role.
  - `BentoTile becomes one link with href`: `href="#p1" ariaLabel="View Shop App"` → `getByRole('link', {name: 'View Shop App'})` has `href="#p1"`.
  - `BrowserFrame shows the screenshot`: `src="/images/a.png" title="Shop App" url="shop.example.com"` → `getByRole('img', {name: 'Screenshot of Shop App'})` has `loading="lazy"`; text `shop.example.com` present.
  - `BrowserFrame shows a placeholder without src`: `getByRole('img', {name: 'Shop App — screenshot coming soon'})`; text `Screenshot coming soon`.
  - `BrowserFrame falls back when the image fails`: `fireEvent.error(img)` → the placeholder role/name above is present and no `<img>` remains.
  - `PhoneFrame renders nothing without src`: `container` empty.

- [ ] **Step 2: Run** `npx vitest run src/components/frames.test.jsx` — Expected: FAIL (`Failed to resolve import "./BentoTile"`).

- [ ] **Step 3: Implement** the three components with the interfaces above.

- [ ] **Step 4: Run** `npx vitest run src/components/frames.test.jsx` — Expected: PASS (6 tests).

- [ ] **Step 5: Commit** `feat: add BentoTile, BrowserFrame and PhoneFrame with screenshot fallbacks`

---

### Task 3: Project ordering and ProjectRow

**Why:** ProjectRow is the product showcase — the most important block for recruiters. Numbering and the live count are derived in `lib/projects.js` so they can never disagree with the data.

**Files:**
- Replace: `src/lib/projects.js`, `src/lib/projects.test.js` (drop `sortProjects`; Phase 1's `sections/Projects.jsx` still imports it until Task 7 — keep `sortProjects` exported as-is until Task 7 deletes its caller, then remove it there)
- Create: `src/components/ProjectRow.jsx`, `src/components/ProjectRow.test.jsx`

**Interfaces:**
- Consumes: `Button`, `Icon`, `TagList`, `StatusBadge` (Task 1); `BrowserFrame`, `PhoneFrame` (Task 2).
- Produces:
  - `orderProjects(projects) → Array<project & { index: string }>`: featured project first, then the rest in input order; `index` is `'01'`, `'02'`, … by the returned position. Does not mutate input.
  - `liveCount(projects) → number`: count of `status === 'live'`.
  - `ProjectRow({ project, featured = false })` where `project` = `{ id, index, status, name, problem, outcome?, tags, liveUrl?, githubUrl?, privateNote?, image?, imageAlt?, phoneImage? }` → `<article id={project.id} aria-labelledby="{id}-name">`. Meta line: `{index}` (+ ` — FEATURED` when `featured`) and `StatusBadge`. `<h3 id="{id}-name">`. Problem paragraph. Result strip only when `outcome`: label `Result` + text. `TagList`. Actions: when `liveUrl`, primary external Button `View live` (`View demo` when `status === 'demo'`) with `aria-label` `View {name} live (opens in new tab)` / `View demo of {name} (opens in new tab)`; when `githubUrl`, secondary external Button `GitHub` (icon github) with `aria-label` `{name} source on GitHub (opens in new tab)`; otherwise lock icon + `privateNote || 'Private client code'`. Media: `BrowserFrame` with `url` = host of `liveUrl` (fallback to the raw string if `new URL` throws); `PhoneFrame` only when `featured && phoneImage`. Featured layout `md:grid-cols-[7fr_5fr]`, 32px name, 40px gap, padding 32px; non-featured single column, padding 24px.

- [ ] **Step 1: Write failing tests.**
  `src/lib/projects.test.js`:
  - `orderProjects puts the featured project first and numbers by position`: input `[{id:'a'},{id:'b',featured:true},{id:'c'}]` → ids `['b','a','c']`, indexes `['01','02','03']`.
  - `orderProjects does not mutate input`: input order and objects unchanged (no `index` key added to originals).
  - `liveCount counts only live projects`: `[{status:'live'},{status:'demo'},{status:'live'}]` → `2`; `[]` → `0`.
  `src/components/ProjectRow.test.jsx` (fixture `full` = all fields, `liveUrl: 'https://shop.example.com/app'`):
  - `renders name, problem, result, tags and status`: `h3` "Shop App"; text "Result" and the outcome; list "Tech stack"; text "Live".
  - `shows the host in the browser bar`: text `shop.example.com`.
  - `links live and GitHub in new tabs`: links named `View Shop App live (opens in new tab)` and `Shop App source on GitHub (opens in new tab)` both have `target="_blank"`.
  - `labels demo projects`: `status:'demo'` → link name `View demo of Shop App (opens in new tab)`, text `Demo`.
  - `shows private note without GitHub`: `githubUrl: null` → no GitHub link; text `Private client code`; with `privateNote: 'Code under NDA'` → that text instead.
  - `hides the live button without liveUrl`: no link matching `/View/`.
  - `hides the result strip without outcome`: no text `Result`.
  - `marks featured and shows phone frame only when featured with phoneImage`: `featured` + `phoneImage` → text `01 — FEATURED` and two `img` roles; not featured + `phoneImage` → one `img`.

- [ ] **Step 2: Run** `npx vitest run src/lib/projects.test.js src/components/ProjectRow.test.jsx` — Expected: FAIL (`orderProjects is not a function`, `Failed to resolve import "./ProjectRow"`).

- [ ] **Step 3: Implement** `orderProjects`, `liveCount` (keep `sortProjects` until Task 7) and `ProjectRow`.

- [ ] **Step 4: Run** the same command — Expected: PASS (11 tests). Then `npm test` — Expected: all PASS.

- [ ] **Step 5: Commit** `feat: add ProjectRow showcase and derived project numbering`

---

### Task 4: TimelineItem and CertItem

**Why:** Experience and Certifications are simple lists, but their rules matter to HR: newest first, current role highlighted, and a Verify link only when a real one exists.

**Files:**
- Create: `src/components/TimelineItem.jsx`, `src/components/CertItem.jsx`, `src/components/timeline-certs.test.jsx`

**Interfaces:**
- Consumes: `TagList` (Task 1).
- Produces:
  - `TimelineItem({ role, company, period, bullets, tags, current })` → `<li>` (parent renders `<ol>`). Desktop grid `200px 28px 1fr`: mono 13px muted period, rail (1px `border-input` at 50% opacity, hidden on last item) with an 11px dot (accent filled when `current`, else hollow muted), body: `<h3>` `{role}` + muted-weight ` @ {company}`, bullet `<ul>`, `TagList` when `tags`. Below `md`: date above the role, grid `22px 1fr`. Current item has `data-current="true"`.
  - `CertItem({ name, issuer, year, verifyUrl })` → `<li>` (parent renders `<ul>`): name (heading 600), `{issuer} · {year}` muted; when `verifyUrl`, link text `Verify ↗` with `aria-label="Verify {name} (opens in new tab)"`, new tab.

- [ ] **Step 1: Write failing tests** in `src/components/timeline-certs.test.jsx` (wrap in `<ol>` / `<ul>`):
  - `TimelineItem shows role, company, period, bullets and tags`: `h3` with text `Intern @ Acme`; period `Mar 2025 – Aug 2025`; 2 bullet texts; list "Tech stack".
  - `TimelineItem marks the current role`: `current` → the `li` has `data-current="true"`; without → attribute absent.
  - `TimelineItem works without tags`: no list named "Tech stack".
  - `CertItem shows name, issuer and year`: text `AWS Cloud Practitioner`, `Amazon · 2025`.
  - `CertItem links verify in a new tab`: link named `Verify AWS Cloud Practitioner (opens in new tab)`, `target="_blank"`.
  - `CertItem hides verify without a URL`: no link role.

- [ ] **Step 2: Run** `npx vitest run src/components/timeline-certs.test.jsx` — Expected: FAIL (`Failed to resolve import "./TimelineItem"`).

- [ ] **Step 3: Implement** both components.

- [ ] **Step 4: Run** the same command — Expected: PASS (6 tests).

- [ ] **Step 5: Commit** `feat: add TimelineItem and CertItem`

---

### Task 5: Contact logic and ContactForm

**Why:** The form is the only part that talks to a server, so it is where things go wrong. The new design adds friendlier messages, moves focus to the first mistake (important for keyboard and screen-reader users), and shows a success panel. A full endpoint URL replaces the Formspree ID so Phase 2 can point it at Laravel. A timeout stops the button hanging on "Sending…".

**Files:**
- Replace: `src/lib/contact.js`, `src/lib/contact.test.js`, `src/components/ContactForm.jsx`, `src/components/ContactForm.test.jsx`
- Modify: `.env.example` (`VITE_CONTACT_ENDPOINT=` with a comment: full URL, e.g. `https://formspree.io/f/<id>`), and the Phase 1 `src/sections/Contact.jsx` call site to pass `endpoint={import.meta.env.VITE_CONTACT_ENDPOINT}` (the section itself is rewritten in Task 7)

**Interfaces:**
- Consumes: `Button`, `Icon` (Task 1).
- Produces:
  - `validateContact({ name, email, message }) → { name?, email?, message? }` with exact messages:
    - name blank → `Please enter your name.`
    - email blank → `Please enter your email so I can reply.`
    - email malformed (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/` on trimmed) → `That email looks incomplete — check for a missing @ or domain.`
    - message trimmed length < 10 → `Please write a short message (at least 10 characters).`
  - `sendContact(endpoint, values, { timeoutMs = 15000 } = {}) → Promise<void>`: `POST` JSON to `endpoint` with headers `Content-Type: application/json`, `Accept: application/json`, `signal: AbortSignal.timeout(timeoutMs)`; rejects on network error, abort, or non-2xx.
  - `ContactForm({ endpoint, fallbackEmail, idPrefix = 'contact' })`:
    - No `endpoint` → `<p>Email me directly at <a href="mailto:…">{fallbackEmail}</a>.</p>`, no form.
    - Form `aria-label="Contact form"`, `noValidate`; fields with ids `{idPrefix}-name|email|message`, labels `Name` / `Email` / `Message`, placeholders `Your name` / `you@company.com` / `Tell me about the role or project`, `autoComplete` `name` / `email`; inputs `border-border-input bg-bg`, invalid → `border-danger`, `aria-invalid="true"`, `aria-describedby="{id}-err"`, error `<p id="{id}-err">` with alert icon in `text-danger`.
    - Submit: validate; if errors, focus the first invalid field in order name → email → message and stop. Typing in a field clears that field's error.
    - Sending: submit button text `Sending…` with `aria-disabled="true"`. Foot text `All fields are required.` Button text `Send message`.
    - Success: form replaced by `role="status"` panel with check icon, `<h3>` `Message sent — thank you, {first name}.`, text `I reply within 1–2 working days. If it’s urgent, email me directly.`, secondary small Button `Send another message` that resets values and shows the empty form.
    - Failure: `role="alert"` under the fields: `Something went wrong. Please email me directly at` + mailto link to `fallbackEmail` + `.`; values kept.

- [ ] **Step 1: Write failing tests.**
  `src/lib/contact.test.js`: valid input → `{}`; each of the four exact messages above (blank name, blank email, `ali@` email, message `'too short'` = 9 chars); exactly 10 chars passes; `sendContact` posts JSON to the given URL with the headers above and an `AbortSignal` in `options.signal`; rejects on `{ ok: false, status: 422 }`; **rejects after the timeout** — fetch stub `(url, opts) => new Promise((_, reject) => opts.signal.addEventListener('abort', () => reject(opts.signal.reason)))`, call with `{ timeoutMs: 20 }`, expect rejection.
  `src/components/ContactForm.test.jsx` (endpoint `'https://formspree.io/f/abc'`, email `amar@example.com`):
  - `shows the email instead of a form without an endpoint`.
  - `shows errors and focuses the first invalid field`: submit empty → three messages visible; `document.activeElement` is the Name input; fetch not called.
  - `focuses email when only email is wrong`: name `Ali`, email `ali@`, message `Hello there, I have a role` → focus on Email input; only the email message shown.
  - `clears a field error when the user types`: after empty submit, type `A` in Name → `Please enter your name.` gone, others remain.
  - `links errors to inputs`: Name input `aria-describedby` equals the id of the element containing `Please enter your name.`.
  - `shows the success panel and resets`: fetch `{ ok: true }` → `getByRole('status')` contains `Message sent — thank you, Ali.`; click `Send another message` → empty Name field visible.
  - `keeps values and shows the email on failure`: fetch rejects → `getByRole('alert')` contains link `amar@example.com`; Message input still has the typed text.
  - `shows Sending… while waiting`: fetch returns a never-resolving promise → button text `Sending…` with `aria-disabled="true"`.

- [ ] **Step 2: Run** `npx vitest run src/lib/contact.test.js src/components/ContactForm.test.jsx` — Expected: FAIL (old messages / missing behaviour, e.g. `expected 'Please enter your email.' to be 'Please enter your email so I can reply.'`).

- [ ] **Step 3: Implement** `validateContact`, `sendContact`, `ContactForm`; update `.env.example` and the Phase 1 Contact call site.

- [ ] **Step 4: Run** the same command — Expected: PASS (17 tests). Then `npm test` — Expected: all PASS.

- [ ] **Step 5: Commit** `feat: redesign contact form with focus management, success panel and request timeout`

---

### Task 6: Navbar and Reveal

**Why:** The navbar keeps Download CV and Contact one tap away on phones — a hard requirement from the brief. Escape-to-close and returning focus to the menu button make the menu usable from a keyboard. Reveal gets the design's softer motion and a print fix.

**Files:**
- Replace: `src/components/Navbar.jsx`, `src/components/Navbar.test.jsx`
- Modify: `src/components/Reveal.jsx`, `src/components/Reveal.test.jsx`, Phase 1 `src/App.jsx` call site → `<Navbar name={profile.name} cvUrl={profile.cvUrl} />`

**Interfaces:**
- Consumes: `Button`, `Icon` (Task 1).
- Produces:
  - `NAV_LINKS = [{label:'Work',href:'#work'},{label:'Experience',href:'#experience'},{label:'Certifications',href:'#certifications'},{label:'Contact',href:'#contact'}]` (named export).
  - `Navbar({ name, cvUrl, links = NAV_LINKS })` → `<nav aria-label="Main">`, sticky, 64px, `bg-bg/92` + `backdrop-blur-sm`, bottom border. Brand link `{name}` + accent `.` → `#top`. Desktop (`md:flex`, otherwise `hidden`) link list. Mobile-only (`md:hidden`) `Contact` link → `#contact`. Small primary Button `Download CV` (icon download, `href={cvUrl}`, `download`) at all widths. Menu button (`md:hidden`, 40px, `border-border-input`) with `aria-expanded`, `aria-controls="nav-sheet"`, `aria-label` `Open menu` / `Close menu`, icon menu/close. Sheet `id="nav-sheet"` rendered only when open (`bg-surface-raised`, 48px rows); tapping a link closes it; Escape closes it and returns focus to the menu button.
  - `Reveal({ as = 'div', className, id, children })` → same visibility logic as Phase 1 (visible immediately under reduced motion or without IntersectionObserver; `threshold: 0`, `rootMargin: '0px 0px -10% 0px'`), now `translate-y-3` → `0` over 500ms, and passes `as`, `className`, `id`.

- [ ] **Step 1: Write failing tests.**
  `src/components/Navbar.test.jsx` (render `<Navbar name="Amar" cvUrl="/cv/Amar-CV.pdf" />`):
  - `shows the wordmark linking to the top`: link with text `Amar.` has `href="#top"`.
  - `keeps Contact and Download CV outside the collapsible menu`: some link named `Contact` has no ancestor with class `hidden`; link `Download CV` has `href="/cv/Amar-CV.pdf"` and `download`, no `hidden` ancestor.
  - `toggles the menu`: button `Open menu` has `aria-expanded="false"`, no `#nav-sheet`; click → button `Close menu` `aria-expanded="true"`, `#nav-sheet` contains 4 links.
  - `closes the menu after a link is tapped`.
  - `closes on Escape and returns focus to the menu button`: open, press `{Escape}` → no `#nav-sheet`; `document.activeElement` is the `Open menu` button.
  `src/components/Reveal.test.jsx`: keep the four Phase 1 tests; add `renders the requested element and id`: `<Reveal as="section" id="work">x</Reveal>` → `container.querySelector('section#work')` exists.

- [ ] **Step 2: Run** `npx vitest run src/components/Navbar.test.jsx src/components/Reveal.test.jsx` — Expected: FAIL (no `Open menu` button / no `section#work`).

- [ ] **Step 3: Implement** `Navbar` and update `Reveal`.

- [ ] **Step 4: Run** the same command — Expected: PASS (10 tests). Then `npm test` — Expected: all PASS.

- [ ] **Step 5: Commit** `feat: redesign navbar with mobile CV and Contact, Escape to close; softer Reveal`

---

### Task 7: Data migration, sections and page swap

**Why:** Everything is now in place to assemble the page. Data moves to the handoff's field names (so content written for the design fits directly), sections become thin compositions of tested components, and the Phase 1 UI is removed in the same commit so the branch never has two designs half-mixed.

**Files:**
- Replace: `src/data/profile.js`, `src/data/stack.js`, `src/data/projects.js`, `src/data/experience.js`, `src/data/data.test.js`, `src/App.jsx`, `src/App.test.jsx`, `src/sections/Hero.jsx`, `src/sections/Experience.jsx`, `src/sections/About.jsx`, `src/sections/Contact.jsx`
- Create: `src/data/certifications.js`, `src/sections/Work.jsx`, `src/sections/Certifications.jsx`, `src/sections/Footer.jsx`, `public/cv/.gitkeep`, `public/images/.gitkeep`
- Delete: files listed under "Deleted in Task 7" in the File Map; remove `sortProjects` from `src/lib/projects.js` and its test; remove `--color-fg` / `--color-line` aliases and `.cursor` from `src/index.css`

**Interfaces:**
- Consumes: everything from Tasks 1–6.
- Produces (data, spec §7): `profile`, `stack`, `projects`, `experience`, `certifications` named exports. Placeholder content copied from `docs/design-handoff/content.example.js` (keep its `[bracket]` values; `liveUrl`/`githubUrl` placeholders must still be strings starting with `https://` so the data test passes, e.g. `'https://[live-url]'`; project 2 `githubUrl: null`; project 3 `status: 'demo'`, no `image`). `profile.photo: '/images/amar.jpg'`, `cvUrl: '/cv/Amar-CV.pdf'`, `about` = the three placeholder paragraphs.
- Sections (all `scroll-mt-16`, `max-w-content mx-auto`, padding `px-4 md:px-6`, top spacing 64px mobile / 96px desktop, wrapped in `Reveal` except Hero):
  - `Hero` (`id="top"`, `aria-label="Introduction"`): bento `grid md:grid-cols-4 gap-3 md:gap-4 md:auto-rows-[minmax(150px,auto)]` with tiles and placements from BRAND-BOOK §Hero bento; mobile order via `order-*`: intro 1, stat 2, location 3, featured 4, stack 5, currently 6, photo 7. Intro: `StatusBadge status="open"` if `profile.openToWork`, `<h1>` `profile.headline`, lead `profile.role`, Buttons `See my work` (→ `#work`, iconRight arrow) and `Download CV` (secondary, download). Photo tile (`flush`, min-height 280px mobile): `<img>` of `profile.photo` with `alt="Photo of {name}"`, falling back on error / missing to `.photo-placeholder` with `role="img" aria-label="[Professional photo of {name}]"`. Location: eyebrow `Based in`, `{city}, Malaysia`, `workMode`. Stat: eyebrow `Shipped`, mono stat `liveCount(projects)`, `live projects with real users`. Stack: eyebrow `Core stack`, `TagList tags={stack}`, caption `From the MySQL schema to the React screen — I build and deploy both ends.`. Currently: eyebrow `Currently`, `Learning {currentlyLearning}`, link `Let’s talk →` → `#contact`. Featured: `BentoTile href="#{featured.id}" ariaLabel="View {name}, featured {status} project"`, eyebrow `Featured project`, name, `StatusBadge`, `BrowserFrame`, `View →`.
  - `Work` (`id="work"`): `SectionHeading id="work-h" index="01" title="Work" subtitle="Products I designed, built and keep running. Click through — they’re live."`; `orderProjects(projects)`: first rendered `featured`, the rest in a `md:grid-cols-2` grid.
  - `Experience` (`id="experience"`, index `02`): `<ol>` of `TimelineItem`.
  - `Certifications` (`id="certifications"`, index `03`): `<ul>` of `CertItem` with top border.
  - `About` (`id="about"`, index `04`): `md:grid-cols-[4fr_7fr]`; first paragraph lead-size `text-heading`.
  - `Contact` (`id="contact"`, index `05`): `md:grid-cols-[5fr_6fr]`; lead `I’m looking for a full stack developer role. The fastest way to reach me is email.`; rows Email (mailto, shows address), LinkedIn (shows URL without `https://`), GitHub (same) with `.label` names; `ContactForm endpoint={import.meta.env.VITE_CONTACT_ENDPOINT} fallbackEmail={profile.email}`.
  - `Footer`: `© {new Date().getFullYear()} {name} · Built with React + Tailwind`; `View source` link when `sourceUrl`.
  - `App`: skip link (`Skip to content` → `#main`), `Navbar name={profile.name} cvUrl={profile.cvUrl}`, `<main id="main">` with sections in spec order, `Footer`.

- [ ] **Step 1: Write failing tests.**
  `src/data/data.test.js` — contract per spec §7: profile required strings (`name, headline, role, city, workMode, cvUrl, currentlyLearning, email, linkedin, github`), `openToWork` boolean, `about` = 3 non-empty strings, `cvUrl` and optional `photo` start with `/`, `linkedin`/`github`/optional `sourceUrl` start with `https://`; `stack` non-empty strings, unique; projects: unique `id`s, exactly one `featured: true`, `status` in `['live','demo']`, non-empty `name`/`problem`, non-empty `tags`, optional URLs start with `https://` (`githubUrl` may be `null`), optional `image`/`phoneImage` start with `/`; experience: `role, company, period` strings, non-empty `bullets`, optional `tags` array, optional `current` boolean, at most one `current`; certifications: `name, issuer` strings, `year` string or number, optional `verifyUrl` https.
  `src/App.test.jsx`:
  - `renders the headline as the only h1`.
  - `renders section headings in order`: `getAllByRole('heading', {level: 2}).map(h => h.textContent)` equals `['Work','Experience','Certifications','About','Contact']`.
  - `shows the derived live project count in the hero`: hero region (`getByRole('region', {name: 'Introduction'})`) contains `String(liveCount(projects))`.
  - `renders every project, role and certificate from data`: each `project.name` as `h3`; each `experience[i].role` text; each `certifications[i].name` text.
  - `links the featured tile to the featured project row`: link whose name starts with `View ` + featured name + `, featured` has `href="#{featured.id}"`, and `document.getElementById(featured.id)` exists.
  - `has a skip link to main`.
  - `shows the open-to-work badge only when openToWork is true` (assert text `Open to work` present for current data).

- [ ] **Step 2: Run** `npx vitest run src/data src/App.test.jsx` — Expected: FAIL (new fields missing, e.g. `expected undefined to be a string` for `headline`; headings mismatch).

- [ ] **Step 3: Migrate data, build sections, swap `App.jsx`, delete Phase 1 files and aliases.**

- [ ] **Step 4: Run** `npm test` — Expected: all PASS, no test file imports a deleted module. `npm run build` — Expected: built, no warnings. `grep -rn "text-fg\|border-line\|ExternalLink\|buttonStyles\|sortProjects" src` — Expected: no output.

- [ ] **Step 5: Visual check** with `npm run dev` in the browser pane at 1280px and 375px against `docs/design-handoff/reference/screenshot-desktop.png` / `screenshot-mobile.png`: bento placement and mobile order, featured row split, two-up rows, timeline, cert rows, about split, contact split. Fix spacing/size differences before committing.

- [ ] **Step 6: Commit** `feat: assemble redesigned page from new components and migrate data; remove Phase 1 UI`

---

### Task 8: Content check for the new placeholders and file layout

**Why:** The deploy gate must understand the new `[bracket]` placeholders and the new file paths (CV, photo, phone screenshots). Exact-case file checks catch `App.png` vs `app.png`, which works on a Mac but 404s on Vercel.

**Files:**
- Create: `scripts/content-rules.js`, `scripts/content-rules.test.js`
- Modify: `scripts/check-content.js`
- Delete: `scripts/placeholder.js`, `scripts/placeholder.test.js`

**Interfaces:**
- Produces:
  - `isPlaceholder(line) → boolean`: true when the line contains `[` immediately followed by a letter, then any characters except `]`, then `]` (regex `/\[[A-Za-z][^\]]*\]/`).
  - `existsWithExactCase(path) → boolean`: true only if every path segment exists with identical case (walk segments with `readdirSync` on the parent and compare names exactly).
  - `check-content.js` scans `src/data/*.js` (not `*.test.js`) and `index.html` with `isPlaceholder`; requires `public/cv/Amar-CV.pdf`; checks `profile.photo`, every project `image` and `phoneImage` with `existsWithExactCase(join('public', path))`; prints all problems; exit 1 if any, else `Content check passed.`

- [ ] **Step 1: Write failing tests** in `scripts/content-rules.test.js`:
  - flags: `"city: '[City]',"`, `"linkedin: 'https://linkedin.com/in/[handle]',"`, `"liveUrl: 'https://[live-url]',"`, `"'[What you built]',"`.
  - does not flag: `"tags: ['React', 'Laravel'],"`, `"export const stack = ['React'];"`, `"items: []"`, `"name: 'Todo App',"`.
  - `existsWithExactCase('package.json')` → true; `existsWithExactCase('PACKAGE.json')` → false; `existsWithExactCase('src/data/profile.js')` → true; `existsWithExactCase('src/Data/profile.js')` → false; missing file → false.

- [ ] **Step 2: Run** `npx vitest run scripts` — Expected: FAIL (`Failed to resolve import "./content-rules.js"`).

- [ ] **Step 3: Implement** `content-rules.js`, update `check-content.js`, delete the old placeholder module and test.

- [ ] **Step 4: Run** `npx vitest run scripts` — Expected: PASS (11 tests). `npm run check:content` — Expected: exit 1 listing the bracket placeholders in `src/data/*.js`, the `index.html` description if it still has one, `public/cv/Amar-CV.pdf is missing`, and missing image paths. Update `index.html` meta description to bracket style: `[One sentence: Amar, Full Stack Developer (React + Laravel) in [City], Malaysia.]`.

- [ ] **Step 5: Commit** `feat: update content check for bracket placeholders and exact-case file paths`

---

### Task 9: Visual and quality verification

**Why:** The spec's targets (screenshot match, contrast, Lighthouse, no overflow) are proven by running the site, not by reading code. This task fixes whatever the checks find.

**Files:**
- Modify: only what the checks below require (record each fix in the ledger).

- [ ] **Step 1: Build and serve** `npm run build && npm run preview` (preview launch config, port 4173).

- [ ] **Step 2: Overflow** — at widths 360, 375, 768, 1280: `document.documentElement.scrollWidth - innerWidth` → Expected `0`.

- [ ] **Step 3: Long-content stress (Review Focus 1)** — temporarily edit `src/data/projects.js` (do not commit): project 2 name 60 characters, problem 300 characters, 10 tags; `profile.email` 45 characters. Rebuild, repeat Step 2 at 360 and 375 → Expected `0`; buttons wrap to full width. Revert with `git checkout src/data/projects.js src/data/profile.js`.

- [ ] **Step 4: Anchor landing (Review Focus 3)** — navigate to `/#work` and `/#contact`; `document.getElementById('work-h').getBoundingClientRect().top` → Expected ≥ 64.

- [ ] **Step 5: Screenshot comparison** — 1280px and 375px full-page against the reference PNGs; list and fix visible differences in layout, spacing, type size or colour.

- [ ] **Step 6: Lighthouse** — `npx -y lighthouse@latest http://localhost:4173 --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new"` once with default (mobile) and once with `--preset=desktop` → Expected Accessibility ≥ 95 and Performance ≥ 90 in both. Fix any failing audit.

- [ ] **Step 7: Run** `npm test` and `npm run build` — Expected: all pass, no warnings.

- [ ] **Step 8: Commit** fixes (if any) `fix: visual and accessibility polish from verification pass`

---

### Task 10: Docker — dev and production images

**Why:** Docker packages the app with its own Node or Nginx so it runs the same on any machine. Multi-stage builds keep the production image small (Nginx + static files only). The dev container mounts your code so edits show up live. This is also the base Phase 2 will extend with Laravel and MySQL.

**Prerequisite:** `docker --version` and `docker compose version` succeed (Docker Desktop installed and running by Amar). If not, stop here and ask Amar to install it; Tasks 1–9 do not depend on this task.

**Files:**
- Create: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `docker/nginx.conf`, `README.md`
- Modify: `vite.config.js`

**Interfaces:**
- `vite.config.js`: `server.watch.usePolling = process.env.VITE_USE_POLLING === 'true'` (bind mounts on macOS do not always deliver file events).
- `Dockerfile` stages exactly as spec §10: `deps` (`node:22-alpine`, `WORKDIR /app`, copy `package.json` + `package-lock.json`, `npm ci`), `dev` (copy source, `EXPOSE 5173`, `CMD ["npm","run","dev","--","--host","0.0.0.0"]`), `build` (`ARG VITE_CONTACT_ENDPOINT`, `ENV VITE_CONTACT_ENDPOINT=$VITE_CONTACT_ENDPOINT`, `RUN npm run build`), `prod` (`nginx:alpine`, copy `docker/nginx.conf` to `/etc/nginx/conf.d/default.conf`, copy `--from=build /app/dist` to `/usr/share/nginx/html`, `EXPOSE 80`).
- `docker-compose.yml`: service `web` (build target `dev`, ports `5173:5173`, volumes `.:/app` and `/app/node_modules`, environment `VITE_USE_POLLING=true`); service `web-prod` (profile `prod`, build target `prod`, build arg `VITE_CONTACT_ENDPOINT: ${VITE_CONTACT_ENDPOINT:-}`, ports `8080:80`).
- `docker/nginx.conf`: `listen 80`; `root /usr/share/nginx/html`; `location / { try_files $uri $uri/ /index.html; }`; `location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }`; `location = /index.html { add_header Cache-Control "no-cache"; }`; headers `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`, `X-Frame-Options DENY` (repeat in locations that use `add_header`, since nginx does not inherit them); `gzip on` for text/css/js/json/svg.
- `.dockerignore` per spec §10, keeping `.env.example`.
- `README.md`: project intro, `npm` commands, "Run with Docker" (dev and prod commands, what each does, why `VITE_CONTACT_ENDPOINT` is a build argument), "Before deploying" (`npm run check:content`).

- [ ] **Step 1: Write the files** above.

- [ ] **Step 2: Dev container** — `docker compose up -d --build web`, then `curl -s localhost:5173 | grep -c '<div id="root">'` → Expected `1`.

- [ ] **Step 3: Live reload (Review Focus 5)** — change the text of `profile.role` in `src/data/profile.js`, wait 3 s, check the page in the browser pane at `localhost:5173` shows the new text; revert the edit. Then `docker compose down`.

- [ ] **Step 4: Production image** — `docker compose --profile prod up -d --build web-prod`; then:
  - `curl -s -o /dev/null -w '%{http_code}' localhost:8080/` → `200`
  - `curl -s -o /dev/null -w '%{http_code}' localhost:8080/does-not-exist` → `200` and body contains `<div id="root">`
  - `curl -sI localhost:8080/assets/$(ls dist/assets | grep '\.js$' | head -1) | grep -i cache-control` → contains `immutable` (run `npm run build` first so `dist/` matches)
  - `curl -sI localhost:8080/ | grep -i x-content-type-options` → `nosniff`
  - `docker image ls --format '{{.Repository}}:{{.Tag}} {{.Size}}' | grep web-prod` → size under 60MB
  Then `docker compose --profile prod down`.

- [ ] **Step 5: Run** `npm test` and `npm run build` — Expected: unchanged, all pass.

- [ ] **Step 6: Commit** `feat: add Docker dev and production (Nginx) setups with README`

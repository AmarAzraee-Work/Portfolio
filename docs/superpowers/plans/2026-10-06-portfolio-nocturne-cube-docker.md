# Portfolio "Nocturne Cube" + Docker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the site as Amar's "Portfolio v2" Nocturne design — a five-face 3D cube page with project screen modal and animated contact form — in React + Tailwind, then add Docker dev/prod setups.

**Architecture:** Pure maths and text logic (`lib/cube.js`, `lib/scramble.js`, `lib/contact.js`) are unit-tested first. Presentational pieces (project screen mock-ups, header, indicator, cards, modal, form, mini cube) are built and tested against fixture props. Two hooks own the imperative parts the mockup did in one class: `useCubeScroll` (layout, rAF loop, drag, keyboard, tilt) and `useScramble`. One task assembles the faces into `App.jsx` and deletes the Phase 1 UI. Docker comes last.

**Tech Stack:** Node 22, Vite 8, React 19, Tailwind CSS 4, Nocturne `styles.css`, `@phosphor-icons/react`, Vitest 5 + Testing Library + jsdom, Formspree via `VITE_CONTACT_ENDPOINT`, Docker (`node:22-alpine`, `nginx:alpine`), Vercel.

**Spec:** `docs/superpowers/specs/2026-10-06-portfolio-nocturne-cube-docker-design.md`. Design source: `docs/design-handoff-v2/Portfolio v2.dc.html` (markup + inline styles + script), `ProjectScreen.dc.html` (screens), `_ds/nocturne-*/styles.css` (tokens + classes). When a step says "as mockup", copy the values from those files.

**Learning note:** Amar is learning while building. Explain each task's what and why, starting from its **Why** line.

## Global Constraints

- Match the mockup 100% except: no sound (no toggle, no Web Audio); right-edge indicator = five chevrons (inactive `‹` 14px, 1.5px stroke, `--color-neutral-700`; active `←` 22×18, `--color-accent` with the mockup's accent glow; 36×22 buttons; `right: clamp(10px,2vw,28px)`; 12px/18px icons below 860px).
- Colours, spacing, radii, shadows only from Nocturne variables (`var(--color-*)`, `--space-*`, `--radius-*`, `--shadow-*`). Accent `#9184d9` is intended. Paragraph-size accent text uses `--color-accent-300`.
- Icons from `@phosphor-icons/react` (regular), matching the mockup's `ph-*` names. No runtime icon/CDN script; Inter from Google Fonts in `index.html`.
- Breakpoint for header links and mini cube: `innerWidth >= 860`.
- Motion modes: cube (default) and flat (when `prefers-reduced-motion: reduce`). Flat = stacked sections, no transforms, tilt, scramble, mini-cube spin or fold animation.
- Exactly one `h1` (Home); one `h2` per face; modal is `role="dialog" aria-modal="true"` labelled by its title.
- Contact: `VITE_CONTACT_ENDPOINT` full URL; no endpoint → "Email me at {email}" instead of the form.
- External links open in a new tab with `rel="noopener noreferrer"`.
- `npm run build` with no warnings; Lighthouse mobile + desktop: Accessibility ≥ 95, Best Practices ≥ 95, Performance ≥ 85 (record actual).
- No horizontal scroll at 360, 390, 768, 1280 widths.

## Review Focus

1. **Keyboard paging while the project modal is open** (PageDown, Space, arrows): the page behind must not turn; arrows only change screens in the modal. Test in Task 1 (`navKeyAction` with `paused`) and Task 7 (hook ignores keys while paused).
2. **Reload or back-navigation that restores a mid-way `scrollY`** (e.g. 1.6 × viewport): the cube renders the correct in-between pose and snap settles on a face, not a skewed half-turn. Verified in Task 9.
3. **Resizing from wide to narrow while on face 3** (rotate a tablet, shrink a window): stays on About, header switches to the compact layout, cube depth recomputes — no gap or skew. Verified in Task 9.
4. **A face taller than the phone viewport** (Contact form or About tags at 390×700): the face scrolls internally and the Send button is reachable; cube turn does not fire while scrolling inside. Verified in Task 9.
5. **Form submitted twice fast, or "Send another" pressed mid-animation**: only one request is sent and the fold animation never leaves the form invisible. Test in Task 6.

---

## File Map

```
index.html                               # Inter weights, title/description (Task 1)
src/styles/nocturne.css                  # copy of _ds styles.css minus its @import line (Task 1)
src/index.css                            # @import nocturne + tailwind, @theme aliases, page CSS (Task 1)
src/test/setup.js                        # + ResizeObserver / matchMedia stubs (Task 1)
src/lib/cube.js scramble.js (+tests)     (Task 1)
src/data/profile.js projects.js about.js experience.js data.test.js   (Task 2)
scripts/content-rules.js(+test) check-content.js                       (Task 2)
src/screens/index.js sampleData.js TtWeek.jsx TtStaff.jsx SalesLanding.jsx SalesAdmin.jsx RestoLanding.jsx RestoMenu.jsx screens.test.jsx (Task 3)
src/components/Eyebrow.jsx Header.jsx SectionIndicator.jsx SectionCounter.jsx DeviceFrame.jsx chrome.test.jsx (Task 4)
src/components/ProjectCard.jsx ProjectModal.jsx projects.test.jsx      (Task 5)
src/lib/contact.js(+test) src/components/ContactForm.jsx(+test)        (Task 6)
src/components/MiniCube.jsx src/hooks/useCubeScroll.js useScramble.js hooks.test.jsx (Task 7)
src/sections/Home.jsx Work.jsx About.jsx Experience.jsx Contact.jsx src/App.jsx App.test.jsx (Task 8)
Dockerfile docker-compose.yml .dockerignore docker/nginx.conf README.md vite.config.js (Task 10)
```

Deleted in Task 8: every Phase 1 file under `src/components/`, `src/sections/`, `src/data/` (`stack.js`, `certs.js`) and `src/lib/projects.js` + tests not listed above; `scripts/placeholder.js` + test are deleted in Task 2.

---

### Task 1: Foundation — styles, icons, cube maths, scramble

**Why:** The cube's feel comes from a few formulas (easing, rotation, shading). Pulling them out of the animation loop into pure functions means we can prove they are right with tests before any 3D appears on screen. Nocturne's stylesheet is the design system itself, so we use it directly rather than re-typing it.

**Files:**
- Create: `src/styles/nocturne.css`, `src/lib/cube.js`, `src/lib/cube.test.js`, `src/lib/scramble.js`, `src/lib/scramble.test.js`
- Modify: `src/index.css`, `index.html`, `src/test/setup.js`, `package.json` (add `@phosphor-icons/react`)

**Interfaces:**
- Produces:
  - `src/index.css`: `@import "tailwindcss/theme.css" layer(theme);` and `@import "tailwindcss/utilities.css" layer(utilities);` (no Tailwind preflight — the mockup has none and Nocturne supplies the base styles), then `@import "./styles/nocturne.css";`. No `@theme` colour aliases: Tailwind's own `--color-*` names would collide with Nocturne's, so components use Nocturne classes, `style={{…}}` copied from the mockup, or arbitrary values like `text-[var(--color-neutral-500)]`. Add the mockup page CSS: `html,body { margin:0; background: var(--color-bg) } a { color: var(--color-accent) } a:hover { color: var(--color-accent-300) }`. Phase 1 `@theme` tokens and rules stay (moved below the imports) until Task 8 deletes their users.
  - `easeInOutCubic(f: number) → number` — mockup formula.
  - `cubeState(scrollY: number, vh: number, n = 5) → { pos, active, s, e, rest }` — `p = clamp(scrollY/vh, 0, n-1)`, `s = min(n-2, floor(p))`, `e = easeInOutCubic(p - s)`, `pos = s + e`, `active = round(pos)`, `rest = |pos - round(pos)| < 1e-4`.
  - `faceShade(off: number) → number` — `off < 1 ? (1 - cos(off·π/2)) × 0.75 : 0`.
  - `navKeyAction({ key, shiftKey, paused, inField }) → 'next' | 'prev' | 'first' | 'last' | null` — null when `paused` or `inField`; next: `PageDown`, `ArrowDown`, `Space` (key `' '`) without shift; prev: `PageUp`, `ArrowUp`, `Space` with shift; first: `Home`; last: `End`.
  - `GLYPHS = '!<>-_/[]{}=+*^?#01'`, `scrambleDuration(len) = 380 + len × 16`, `scrambleFrame(text, k, rand = Math.random) → string` — char `i` shown when it is a space or `k >= (i/len)·0.7 + 0.3`, else `GLYPHS[floor(rand()·GLYPHS.length)]`.
  - Test setup stubs: `ResizeObserver` (observe/unobserve/disconnect no-ops) and `matchMedia` (returns `matches:false`) when missing.

- [ ] **Step 1: Write failing tests.**
  `src/lib/cube.test.js`: `easeInOutCubic(0)=0`, `(1)=1`, `(0.5)=0.5`, `(0.25)=0.0625`; `cubeState(0,800)` → `{pos:0, active:0, rest:true}`; `cubeState(400,800)` → `pos 0.5, active 1` (`round(0.5)` = 1), `rest false`; `cubeState(800,800)` → `pos 1, active 1, rest true`; `cubeState(2960,800)` (p 3.7) → `s 3`, `active 4`; `cubeState(99999,800)` → `pos 4, active 4`; `cubeState(-50,800)` → `pos 0`; `faceShade(0)=0`, `faceShade(1)=0`, `faceShade(0.5)≈0.2197` (`toBeCloseTo(…,3)`); `navKeyAction`: PageDown→next, ArrowUp→prev, `' '`→next, `' '`+shift→prev, Home→first, End→last, `'a'`→null, PageDown with `paused:true`→null, PageDown with `inField:true`→null.
  `src/lib/scramble.test.js`: `scrambleFrame('Hi there', 1)` equals input; at `k=0` every non-space char is in `GLYPHS` and spaces stay at the same indexes; output length always equals input length; with `rand = () => 0` and `k=0`, `'ab'` → `'!!'`; `scrambleDuration(10) = 540`.

- [ ] **Step 2: Run** `npx vitest run src/lib/cube.test.js src/lib/scramble.test.js` — Expected: FAIL (`Failed to resolve import "./cube"`).

- [ ] **Step 3: Implement** `cube.js`, `scramble.js`; copy `docs/design-handoff-v2/_ds/nocturne-*/styles.css` to `src/styles/nocturne.css` without its first-line Google Fonts `@import`; update `index.css`, `index.html` (Inter 400;500;600;700, title `Muhamad Amar — Full-stack developer`, description from the Home intro), `setup.js`; `npm install @phosphor-icons/react`.

- [ ] **Step 4: Run** the same tests — Expected: PASS (23 tests). `npm test` — Expected: all PASS. `npm run build` — Expected: built, no warnings.

- [ ] **Step 5: Commit** `feat: add Nocturne styles, Phosphor icons, cube maths and scramble logic`

---

### Task 2: Content data and deploy content check

**Why:** All text comes from data files so the components stay reusable and Phase 2 can serve the same shapes from Laravel. The content check now knows this design's placeholders (`20XX`, `example.com`…) so the site cannot go live with them.

**Files:**
- Replace: `src/data/profile.js`, `src/data/projects.js`, `src/data/experience.js`, `src/data/data.test.js`, `scripts/check-content.js`
- Create: `src/data/about.js`, `scripts/content-rules.js`, `scripts/content-rules.test.js`
- Delete: `scripts/placeholder.js`, `scripts/placeholder.test.js`
- Move (so Phase 1 keeps working until Task 8 deletes it): `git mv` the current `src/data/{profile,projects,experience,stack,certs}.js` to `src/data/legacy/` and repoint Phase 1 imports (`src/App.jsx`, `src/App.test.jsx`, `src/sections/*`, `src/components/{Navbar,Footer}.jsx`) to `../data/legacy/…`; move the old `data.test.js` to `src/data/legacy/` too. `check-content.js` skips `src/data/legacy/`.

**Interfaces:**
- Produces (spec §5; text verbatim from the mockup):
  - `profile = { name: 'Muhamad Amar', shortName: 'Amar', role: 'Full-stack developer', headline: ["Hi, I'm Amar.", 'I build for the web, end to end.'], intro, email: 'amar@example.com', whatsapp: { display: '+60 12-345 6789', number: '60123456789' }, cvUrl: '/cv/Amar-CV.pdf' }`
  - `projects` — the mockup's three projects with `id` (`timetable`, `sales`, `resto`), `title, stack, role, short, desc, tags, screens: [{ id, label }]` (screen ids `tt-week, tt-staff, sales-landing, sales-admin, resto-landing, resto-menu`).
  - `about = { eyebrow: 'About me', heading, paragraphs: [2], groups: [{ icon: 'Code'|'GitBranch'|'CloudArrowUp'|'Palette', label, variant: 'accent'|'neutral', tags: [], outline?: ['Responsive design'] }] }` — four groups as mockup.
  - `experience` — four rows `{ period, title, line }` as mockup (placeholders kept).
  - `PLACEHOLDER_PATTERNS` (regex list): `/20XX/`, `/example\.com/`, `/Role title/`, `/Company name/`, `/Qualification · Institution/`, `/Education details go here/`, `/12-345 6789/`, `/60123456789/`, `/\[[A-Za-z][^\]]*\]/`; `findPlaceholders(line) → string[]` (matched pattern sources); `existsWithExactCase(path) → boolean` (walks segments with `readdirSync`, exact name match).
  - `check-content.js`: scans `src/data/*.js` (not tests) and `index.html` with `findPlaceholders`; requires `public/cv/Amar-CV.pdf`; checks each `screens[].image` with `existsWithExactCase(join('public', image))`; lists all problems, exit 1, else `Content check passed.`

- [ ] **Step 1: Write failing tests.**
  `src/data/data.test.js`: profile strings non-empty; `headline` length 2; email well-formed; `whatsapp.number` digits only; `cvUrl` starts `/`; projects: 3, unique `id`s, every field non-empty, `tags` non-empty, each `screens` length ≥ 1 with ids in the six known ids and non-empty labels, optional `image` starts `/`; about: 2 paragraphs, 4 groups, `variant` in `accent|neutral`, `icon` in the four names, non-empty `tags`; experience: 4 rows with non-empty `period`, `title`, `line`.
  `scripts/content-rules.test.js`: `findPlaceholders` flags `"period: '20XX – Present',"`, `"email: 'amar@example.com',"`, `"title: 'Role title · Company name',"`, `"number: '60123456789',"`, `"name: '[City]',"`; returns `[]` for `"tags: ['Laravel', 'MySQL'],"`, `"title: 'Staff Timetable System',"`, `"stack: 'Laravel · MySQL · Blade',"`; `existsWithExactCase('package.json')` true, `('PACKAGE.json')` false, `('src/data/profile.js')` true, `('src/Data/profile.js')` false, missing → false.

- [ ] **Step 2: Run** `npx vitest run src/data scripts` — Expected: FAIL (`about` import missing; `content-rules.js` missing).

- [ ] **Step 3: Implement** data files, `content-rules.js`, new `check-content.js`; delete the old placeholder module and test.

- [ ] **Step 4: Run** `npx vitest run src/data scripts` — Expected: PASS. `npm test` — Expected: all PASS (Phase 1 reads `src/data/legacy/`). `npm run check:content` — Expected: exit 1 listing `20XX`, `example.com`, `Role title`, `Company name`, `Qualification · Institution`, `Education details go here`, the WhatsApp number lines and `public/cv/Amar-CV.pdf is missing`.

- [ ] **Step 5: Commit** `feat: add Nocturne content data and placeholder-aware content check`

---

### Task 3: Project screen mock-ups

**Why:** The Work cards and the modal show live-rendered "screenshots" of each project. Building them as components (not images) keeps them sharp at any scale and lets the phone layout be a real layout. Real screenshots can replace any of them later through `screens[].image`.

**Files:**
- Create: `src/screens/sampleData.js`, `src/screens/TtWeek.jsx`, `TtStaff.jsx`, `SalesLanding.jsx`, `SalesAdmin.jsx`, `RestoLanding.jsx`, `RestoMenu.jsx`, `src/screens/index.js`, `src/screens/screens.test.jsx`

**Interfaces:**
- Consumes: Nocturne classes/vars (Task 1).
- Produces:
  - `sampleData.js`: `staff`, `days`, `staffTable`, `kpis`, `bars`, `orders`, `dishes`, `menu` — values copied from `ProjectScreen.dc.html` `renderVals()` (including derived fields: initials, per-day M/E/O/L flags, hours = shifts × 8).
  - Each screen component `({ device: 'desktop' | 'phone' })` renders the matching `isXxx` branch of `ProjectScreen.dc.html` for that device, with the mockup's markup and inline styles converted to JSX (`style={{…}}`). Root sized 1280×800 (desktop) or 390×844 (phone), `aria-hidden="true"` (decorative; the modal/card supplies the accessible text).
  - `SCREENS: Record<screenId, Component>` and `ProjectScreen({ screen, device = 'desktop' })` → the component, or `null` for an unknown id.

- [ ] **Step 1: Write failing tests** in `src/screens/screens.test.jsx`: for each of the six ids and both devices, `render(<ProjectScreen screen={id} device={d} />)` renders a non-empty element with `aria-hidden="true"`; distinctive text per screen (desktop): `tt-week` contains `Aisyah Rahman` and `Tue`; `tt-staff` contains `Sarah Mokhtar` and `Management`; `sales-landing` contains `Kopi Pagi`; `sales-admin` contains `RM 18,420` and `#1042`; `resto-landing` contains `Nasi Lemak Berempah`; `resto-menu` contains `Mee Rebus Tulang`; desktop root `style.width` is `1280px`, phone `390px`; unknown id renders nothing.

- [ ] **Step 2: Run** `npx vitest run src/screens` — Expected: FAIL (`Failed to resolve import "./index"`).

- [ ] **Step 3: Implement** the sample data and six screens (desktop + phone) by porting `ProjectScreen.dc.html`; `index.js` maps ids. Check each against the mockup by rendering `Project Screens.dc.html` from the dev server (`/docs/design-handoff-v2/Project%20Screens.dc.html`) next to a scratch route or Storybook-free test page (`src/screens/Preview.jsx` mounted only when `import.meta.env.DEV` and `location.hash === '#screens'`).

- [ ] **Step 4: Run** `npx vitest run src/screens` — Expected: PASS (6 × 2 render tests + text checks + unknown). `npm run build` — Expected: no warnings.

- [ ] **Step 5: Commit** `feat: port the six project screen mock-ups (desktop and phone)`

---

### Task 4: Page chrome — Eyebrow, Header, SectionIndicator, SectionCounter, DeviceFrame

**Why:** These small fixed pieces frame every face. The chevron indicator is the one deliberate change from the mockup, so it gets its own tests: five labelled buttons, the active one marked for screen readers.

**Files:**
- Create: `src/components/Eyebrow.jsx`, `Header.jsx`, `SectionIndicator.jsx`, `SectionCounter.jsx`, `DeviceFrame.jsx`, `src/components/chrome.test.jsx`

**Interfaces:**
- Consumes: `ProjectScreen` (Task 3), Phosphor icons.
- Produces:
  - `Eyebrow({ children })` — accent 24×1px rule + uppercase 13px label, `letter-spacing:.12em` (mockup).
  - `Header({ name, labels, active, wide, onNavigate, onContact })` — `<header class="nav">` as mockup: brand link (`Cube` icon + name, `href="#"`, click → `onNavigate(0)`), nav links when `wide` with `aria-current="page"` on `active`, primary button `Say hello` → `onContact()`. No sound button.
  - `SectionIndicator({ labels, active, onNavigate })` — `<nav aria-label="Sections">` fixed right as spec §1; five `<button aria-label={label}>`; active has `aria-current="true"` and the long arrow, others the small chevron.
  - `SectionCounter({ active, total, label })` — fixed bottom-left `0{active+1}` (mono accent) `/ 0{total}` `{label}`, `aria-hidden="true"` (the indicator carries the state).
  - `DeviceFrame({ device: 'desktop'|'tablet'|'phone', screen, image, width, height, url })` — mockup frames (desktop browser bar with three dots and `url`; tablet bezel; phone bezel with notch), scaled with `scale = min((width-40)/fw, (height-40)/fh)` where `[fw,fh]` = desktop `[1280,830]`, tablet `[1316,836]`, phone `[414,868]`; renders `<img src={image} alt="">` when `image`, else `ProjectScreen` (`device` phone for phone, desktop otherwise).

- [ ] **Step 1: Write failing tests** in `src/components/chrome.test.jsx`:
  - `Header shows brand, links and Say hello`: with `wide`, 5 links; link `Work` has `aria-current="page"` when `active=1`; clicking `Say hello` calls `onContact`; clicking `About` calls `onNavigate(2)`; without `wide`, no `About` link; no button named `Toggle sound`.
  - `SectionIndicator renders five labelled buttons`: names Home…Contact; only `active` has `aria-current="true"`; clicking `Experience` calls `onNavigate(3)`.
  - `SectionCounter shows the active number and label`: `active=1` → text `02`, `/ 05`, `Work`.
  - `DeviceFrame shows the URL bar on desktop`: text `amar.dev/work/tt-week`; `tablet` and `phone` have no URL text; `image` given → an `img` and no mock text.
  - `Eyebrow renders its label`.

- [ ] **Step 2: Run** `npx vitest run src/components/chrome.test.jsx` — Expected: FAIL (imports missing).

- [ ] **Step 3: Implement** the five components.

- [ ] **Step 4: Run** the same — Expected: PASS. `npm test` — Expected: all PASS.

- [ ] **Step 5: Commit** `feat: add header, chevron section indicator, counter and device frames`

---

### Task 5: ProjectCard and ProjectModal

**Why:** The Work face is where recruiters go deeper. Cards must open by mouse and keyboard; the modal must trap focus and give it back, otherwise keyboard users get lost behind the backdrop.

**Files:**
- Create: `src/components/ProjectCard.jsx`, `src/components/ProjectModal.jsx`, `src/components/projects.test.jsx`

**Interfaces:**
- Consumes: `ProjectScreen`, `DeviceFrame` (Tasks 3–4), project shape (Task 2).
- Produces:
  - `ProjectCard({ project, onOpen })` — `.card elev-sm`, `role="button"`, `tabIndex=0`, `aria-label="{title} — view screens"`; Enter/Space/click → `onOpen(project, cardElement)`; thumbnail = first screen (`image` or `ProjectScreen` desktop) scaled to card width via `ResizeObserver` (`scale = width/1280`); kicker `stack`, title, `short`, `View screens` + `ArrowUpRight`; mouse-only tilt and glare (`--mx`, `--my`, `--glare`) as mockup `cardTilt`/`cardReset`.
  - `ProjectModal({ project, onClose, returnFocusTo })` — `.dialog-backdrop` (click closes) + `.dialog` (`role="dialog" aria-modal="true" aria-labelledby`), header (kicker, title, close `aria-label="Close"`), `desc`, screen `.seg` (one `button` per screen, active `aria-pressed="true"`), device `.seg` (Desktop/Tablet/Phone with icons), prev/next (`aria-label` `Previous screen` / `Next screen`), preview `DeviceFrame` sized from the preview width (`previewH = round(clamp(w×0.6, 240, innerHeight×0.58))`), footer `My role: {role}` + tags. Keys: `Escape` → `onClose`; `ArrowRight`/`ArrowLeft` → next/prev screen (wraps). On mount: focus the close button, lock `document.documentElement.style.overflow = 'hidden'`; Tab/Shift+Tab cycle within the dialog; on unmount: restore overflow and focus `returnFocusTo`.

- [ ] **Step 1: Write failing tests** in `src/components/projects.test.jsx` (fixture = `projects[0]`):
  - `card opens on click, Enter and Space` (three calls to `onOpen` with the project).
  - `card shows stack, title and summary`.
  - `modal is a labelled dialog`: `getByRole('dialog', {name: 'Staff Timetable System'})`; focus is on `Close`.
  - `modal switches screens with buttons and arrow keys`: `Staff directory` button → `aria-pressed="true"` and `Sarah Mokhtar` shown; `{ArrowLeft}` → back to `Weekly timetable`; `{ArrowRight}` twice wraps.
  - `modal switches device`: click `Phone` → `aria-pressed="true"`; no `amar.dev/work/` text.
  - `Escape and backdrop click call onClose`; clicking inside the dialog does not.
  - `focus is trapped`: Tab from the last focusable returns to `Close`; Shift+Tab from `Close` goes to the last.
  - `closing restores focus and scroll`: render a button, open modal with `returnFocusTo={button}`, unmount → `document.activeElement === button`, `documentElement.style.overflow === ''`.

- [ ] **Step 2: Run** `npx vitest run src/components/projects.test.jsx` — Expected: FAIL (imports missing).

- [ ] **Step 3: Implement** both components.

- [ ] **Step 4: Run** the same — Expected: PASS. `npm test` — Expected: all PASS.

- [ ] **Step 5: Commit** `feat: add project cards and accessible project screen modal`

---

### Task 6: Contact logic and ContactForm with fold animation

**Why:** The envelope animation is the design's signature moment, but it must never hide a failure. The request runs while the animation plays; success waits for both, failure cancels the animation and gives the visitor their words back plus Amar's email.

**Files:**
- Replace: `src/lib/contact.js`, `src/lib/contact.test.js`, `src/components/ContactForm.jsx`, `src/components/ContactForm.test.jsx`
- Modify: `.env.example` (`VITE_CONTACT_ENDPOINT=` with comment "full URL, e.g. https://formspree.io/f/<id>"); the Phase 1 `src/sections/Contact.jsx` call site so it keeps compiling until Task 8 (`<ContactForm endpoint={import.meta.env.VITE_CONTACT_ENDPOINT} email={profile.email} />`)

**Interfaces:**
- Produces:
  - `validateContact({ name, email, message })` → errors with exact messages: name blank `Please enter your name.`; email blank `Please enter your email so I can reply.`; malformed `That email looks incomplete — check for a missing @ or domain.`; trimmed message < 10 chars `Please write a short message (at least 10 characters).`
  - `sendContact(endpoint, { name, email, message }, { timeoutMs = 15000 } = {}) → Promise<void>` — POST JSON, headers `Content-Type`/`Accept: application/json`, `signal: AbortSignal.timeout(timeoutMs)`, reject on network error/abort/non-2xx.
  - `ContactForm({ endpoint, email, reducedMotion = false })`:
    - no `endpoint` → card text `Email me at` + mailto link.
    - Form card as mockup (`Send a message`, fields `Your name` / `Email` / `Message` with mockup placeholders `Ali bin Abu`, `you@email.com`, `Tell me about your project`; button `Send message` with `PaperPlaneTilt`); `noValidate`; field errors under each `.field` (`role` none, linked via `aria-describedby`, input `aria-invalid`); focus first invalid; typing clears that error.
    - state `idle → sending → sent | failed`; while not `idle`, further submits are ignored (one request).
    - On valid submit: start `sendContact` and (unless `reducedMotion` or `Element.prototype.animate` missing) the mockup's two WAAPI animations (form fold 650ms; envelope cube 1500ms delay 380ms, keyframes/easings as mockup). `sent` when both the request resolves and the cube animation finishes (or immediately when no animation). Success card: `CheckCircle`, `Message sent`, `Thanks, {first name or 'friend'}. It's on its way, and I'll get back to you soon.`, `Send another` (cancels any running animations, resets values, `idle`); fade-in 450ms as mockup unless reduced motion.
    - On failure: cancel both animations (form visible again), keep values, show `role="alert"`: `Something went wrong. Please email me at` + mailto link + `.`; state back to `idle` so the visitor can retry.

- [ ] **Step 1: Write failing tests.**
  `src/lib/contact.test.js`: four exact messages; 10-char message passes; POST shape; 422 rejects; timeout rejects (fetch stub rejecting on `signal` abort, `timeoutMs: 20`).
  `src/components/ContactForm.test.jsx` (endpoint `https://formspree.io/f/abc`, email `amar@example.com`, `reducedMotion` true unless stated):
  - `no endpoint shows the email`.
  - `invalid submit shows errors, focuses Your name, sends nothing`.
  - `typing clears that field's error`.
  - `success shows the thank-you card with the first name`: name `Ali bin Abu` → `Thanks, Ali.`; `Send another` → empty form.
  - `failure keeps values and shows the email`: fetch rejects → `alert` with link `amar@example.com`; Message keeps text; button enabled again.
  - `double submit sends one request`: fetch never resolves; click `Send message` twice → fetch called once.
  - `with animation, success waits for the request`: `reducedMotion` false, `Element.prototype.animate` stubbed to return `{ cancel: vi.fn(), finished: Promise.resolve(), set onfinish(fn) { queueMicrotask(fn) } }`; fetch resolves after the animation → `Thanks` appears only after fetch resolves.
  - `with animation, failure cancels it`: same stub; fetch rejects → each returned animation's `cancel` called; form fields visible.

- [ ] **Step 2: Run** `npx vitest run src/lib/contact.test.js src/components/ContactForm.test.jsx` — Expected: FAIL (old messages / missing behaviour).

- [ ] **Step 3: Implement** contact logic, ContactForm (fold markup from the mockup's `foldRef` block), `.env.example`, Phase 1 call site.

- [ ] **Step 4: Run** the same — Expected: PASS. `npm test` — Expected: all PASS.

- [ ] **Step 5: Commit** `feat: add animated contact form with real sending, timeout and failure recovery`

---

### Task 7: Mini cube and the cube/scramble hooks

**Why:** This is the engine: one rAF loop turns scroll position into cube rotation, using the tested maths from Task 1. Keeping it in a hook separates "how it moves" from "what it shows", so sections stay plain components.

**Files:**
- Create: `src/components/MiniCube.jsx`, `src/hooks/useCubeScroll.js`, `src/hooks/useScramble.js`, `src/hooks/hooks.test.jsx`

**Interfaces:**
- Consumes: `cubeState`, `faceShade`, `navKeyAction`, `scrambleFrame`, `scrambleDuration` (Task 1).
- Produces:
  - `MiniCube({ onNavigate, reducedMotion })` — mockup mini cube (200px, six faces with icons `Briefcase`/`User`/`Path`/`PaperPlaneTilt`/`House` and `</>`), glow, idle spin + inertia + drag (`data-nodrag`), click without drag → `onNavigate(i)`; faces are buttons named `Work`, `About`, `Experience`, `Contact`, `Home`; caption with `HandGrabbing` icon. No spin under `reducedMotion`.
  - `useCubeScroll({ stageRef, cubeRef, spacerRef, count = 5, paused })` → `{ active, goTo(i), mode: 'cube'|'flat', wide }`. Implements the mockup `layout()`, `frame()` (via `cubeState`/`faceShade`), `snapOn()`, drag (`stageDown`/`onPMove`/`onPUp`) and tilt; `mode` is `'flat'` when `matchMedia('(prefers-reduced-motion: reduce)')` matches (listens for changes); `wide = innerWidth >= 860` (updates on resize); keydown on `window` mapped through `navKeyAction({ …, paused, inField: target is input/textarea/select/[contenteditable] })` → `goTo`; `goTo(i)` scrolls to `i × innerHeight` (cube) or the face's `offsetTop` (flat), smooth unless reduced motion. Cleans up listeners, rAF, scroll-snap and overflow styles on unmount.
  - `useScramble(containerRef, trigger, enabled)` — when `trigger` changes (and on mount after 300ms), animates every `[data-scramble]` text node inside the container with `scrambleFrame` for `scrambleDuration(len)`; always ends on the original text; the element keeps `aria-label={original}` and its glyph text is `aria-hidden` (render as `<span aria-label=…><span aria-hidden="true">text</span></span>`); disabled → no-op.

- [ ] **Step 1: Write failing tests** in `src/hooks/hooks.test.jsx` (test harness component renders a stage/cube with five `[data-face]` sections and exposes the hook result):
  - `flat mode under reduced motion`: `matchMedia` stub matches `reduce` → `mode === 'flat'`; faces have `transform` `none` and are `visible`.
  - `cube mode positions faces`: no reduce → `mode === 'cube'`; face 1 style `transform` contains `rotateX(-90deg)`.
  - `keyboard pages faces`: `window.scrollTo` spy; `fireEvent.keyDown(window, {key:'PageDown'})` → called with `top: innerHeight` (from face 0).
  - `keyboard ignored while paused or typing`: `paused: true` → no call; keydown from an `<input>` → no call.
  - `wide follows window width`: `innerWidth` 1280 → true; set 700 + `resize` event → false.
  - `cleans up`: unmount → `document.documentElement.style.scrollSnapType === ''`.
  - `MiniCube face click navigates`: click `Experience` → `onNavigate(3)`.
  - `useScramble ends on the original text and keeps an accessible label` (fake timers + rAF via `vi.useFakeTimers({ toFake: ['requestAnimationFrame','performance'] })` or a stubbed rAF loop): after duration, text equals original; `aria-label` equals original throughout.

- [ ] **Step 2: Run** `npx vitest run src/hooks` — Expected: FAIL (imports missing).

- [ ] **Step 3: Implement** the hooks and MiniCube.

- [ ] **Step 4: Run** the same — Expected: PASS. `npm test` — Expected: all PASS.

- [ ] **Step 5: Commit** `feat: add cube scroll engine, scramble hook and mini cube`

---

### Task 8: Faces, App assembly and Phase 1 removal

**Why:** With every part tested, the faces are just layout and data. Removing Phase 1 in the same commit keeps the branch from ever showing two designs at once.

**Files:**
- Create: `src/sections/Home.jsx`, `Work.jsx`, `About.jsx`, `Experience.jsx`, `Contact.jsx` (replacing Phase 1 files of the same name where they exist)
- Replace: `src/App.jsx`, `src/App.test.jsx`
- Delete: all Phase 1 UI files and tests (`src/components/{Navbar,Footer,Section,SectionHeading,Tag,ExternalLink,ProjectCard,Reveal,buttonStyles}*`, `components.test.jsx`, `src/sections/{Hero,Stack,Projects,Certs}.jsx`, `src/data/{stack,certs}.js`, `src/lib/projects.js(+test)`), `src/data/legacy/`, Phase 1 tokens/CSS in `index.css`, `src/screens/Preview.jsx` if it is not dev-only.
- Create: `public/cv/.gitkeep`

**Interfaces:**
- Consumes: everything above.
- Produces:
  - Each face is `<section data-face={i} data-screen-label="0N Label" aria-labelledby=…>` with the mockup's background gradient, inner padding/max-width/grid and a `[data-shade]` overlay; content per spec §3 using `Eyebrow`, data files and components. Headings that scramble use `data-scramble`. Home has the only `h1` (two scramble spans). Work maps `projects` to `ProjectCard`. About maps `about.groups` to icon + tag rows (`tag-accent` / `tag-neutral` / `tag-outline`). Experience renders `Download CV` (`href={profile.cvUrl}`, `download`, `DownloadSimple`) and four rows. Contact renders the email and WhatsApp rows (`https://wa.me/{number}`, new tab), `ContactForm`, and the footer row with `Back to the top` → `goTo(0)`.
  - `App` — stage (`position:fixed; inset:0; perspective`, background `radial-gradient(ellipse at 50% 45%, var(--color-accent-900), var(--color-bg) 70%)`), cube with the five faces, spacer (five `100vh` blocks, `aria-hidden`), `Header`, `SectionIndicator`, `SectionCounter`, `ProjectModal` when a project is open (`paused` passed to `useCubeScroll`), `useScramble` on the active face.

- [ ] **Step 1: Write failing tests** in `src/App.test.jsx`:
  - `one h1 with the headline` (accessible name `Hi, I'm Amar. I build for the web, end to end.`).
  - `four h2 in order` (Home uses the h1): texts equal `["Things I've built", 'I like making things work, and look good doing it.', "Where I've been", "Let's build something together."]`.
  - `header and indicator are present`: button `Say hello`; navigation `Sections` with 5 buttons.
  - `three project cards open the modal`: click card `Sales Page & Admin Panel — view screens` → dialog named `Sales Page & Admin Panel`; `Escape` closes it.
  - `Download CV links to the PDF` with `download`.
  - `WhatsApp opens in a new tab` with `href="https://wa.me/60123456789"`.
  - `flat mode under reduced motion shows every face` (matchMedia stub): every `[data-face]` has `visibility` not `hidden`.
  - `no sound control`: no button named `/sound/i`.

- [ ] **Step 2: Run** `npx vitest run src/App.test.jsx` — Expected: FAIL (Phase 1 App renders different headings).

- [ ] **Step 3: Implement** the faces and App; delete Phase 1 files.

- [ ] **Step 4: Run** `npm test` — Expected: all PASS; `grep -rn "buttonStyles\|ExternalLink\|SectionHeading\|data/stack\|data/certs" src` → no output. `npm run build` — Expected: no warnings.

- [ ] **Step 5: Side-by-side check** — dev server; open `/` and `/docs/design-handoff-v2/Portfolio%20v2.dc.html` at 1280×800: each face, mini cube, card hover tilt, modal (each device), contact success. Fix differences.

- [ ] **Step 6: Commit** `feat: assemble the Nocturne cube page and remove the Phase 1 UI`

---

### Task 9: Visual parity and quality verification

**Why:** A 3D page can look right in one size and break in another. These checks prove the spec's targets in a real browser and cover the Review Focus cases tests cannot reach.

**Files:**
- Modify: only what the checks require (each fix recorded in the ledger).

- [ ] **Step 1: Build and preview** — `npm run build`, start the `preview` launch config (port 4173).
- [ ] **Step 2: Parity** — compare against the mockup at 1280×800 and 390×844 for all five faces, the modal on each device and the contact success state; list and fix differences.
- [ ] **Step 3: Overflow** — at 360, 390, 768, 1280: `document.documentElement.scrollWidth - innerWidth` → `0` (cube and flat modes).
- [ ] **Step 4: Review Focus 2** — `scrollTo(0, 1.6 * innerHeight)` then reload → face 2/3 pose matches `cubeState`, snap settles on a face within 1 s.
- [ ] **Step 5: Review Focus 3** — on About at 1280 wide, resize to 700 → still About (`SectionCounter` shows `03`), header links hidden, no gap at face edges.
- [ ] **Step 6: Review Focus 4** — 390×700: Contact face scrolls internally to the Send button; About tags all reachable.
- [ ] **Step 7: Lighthouse** — mobile and `--preset=desktop`: Accessibility ≥ 95, Best Practices ≥ 95, Performance ≥ 85; fix failing audits; record scores in the ledger.
- [ ] **Step 8: Run** `npm test`, `npm run build` — Expected: all pass, no warnings.
- [ ] **Step 9: Commit** fixes (if any) `fix: visual parity and quality pass`

---

### Task 10: Docker — dev and production images

**Why:** Docker packages the app with its own Node or Nginx so it runs the same anywhere. Multi-stage builds keep the production image tiny; the dev container mounts your code for live reload. Phase 2 will add Laravel and MySQL to the same compose file.

**Prerequisite:** `docker --version` and `docker compose version` succeed. If not, stop and ask Amar to install Docker Desktop; Tasks 1–9 do not depend on this.

**Files:**
- Create: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `docker/nginx.conf`, `README.md`
- Modify: `vite.config.js` (`server.watch.usePolling = process.env.VITE_USE_POLLING === 'true'`)

**Interfaces:** exactly `2026-10-05-portfolio-redesign-docker-design.md` §10 (stages `deps`/`dev`/`build`/`prod`; services `web` and `web-prod` (profile `prod`); nginx SPA fallback, immutable `/assets/`, `no-cache` `index.html`, `nosniff`, `strict-origin-when-cross-origin`, `DENY`, gzip — repeat security headers in every `location` that uses `add_header`). README: npm commands, "Run with Docker" (what each command does, why `VITE_CONTACT_ENDPOINT` is a build argument), "Before deploying" (`npm run check:content`).

- [ ] **Step 1: Write the files.**
- [ ] **Step 2: Dev** — `docker compose up -d --build web`; `curl -s localhost:5173 | grep -c 'id="root"'` → `1`.
- [ ] **Step 3: Live reload (polling)** — edit `profile.role` in `src/data/profile.js`, confirm the page at `localhost:5173` shows it within 3 s, revert; `docker compose down`.
- [ ] **Step 4: Prod** — `npm run build`; `docker compose --profile prod up -d --build web-prod`; `/` → 200; `/does-not-exist` → 200 with `id="root"`; `/assets/<js file>` `Cache-Control` contains `immutable`; `/` has `X-Content-Type-Options: nosniff`; image size < 60MB; `docker compose --profile prod down`.
- [ ] **Step 5: Run** `npm test`, `npm run build` — unchanged, all pass.
- [ ] **Step 6: Commit** `feat: add Docker dev and production (Nginx) setups with README`

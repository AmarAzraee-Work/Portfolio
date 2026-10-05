# Portfolio "Nocturne Cube" + Docker — Design Spec

**Date:** 2026-10-06
**Owner:** Amar
**Status:** Draft for review
**Supersedes:** `2026-10-05-portfolio-redesign-docker-design.md` and its plan (bento design — not built). Sections 1–3 of `2026-10-01-portfolio-design.md` (purpose, audience, stack, learning goal) still apply unless changed here.

## 1. Goal

Implement Amar's own Claude Design mockup **"Portfolio v2"** (design system "Nocturne") 100% in this React project, with two requested changes, plus Docker dev/prod setups.

**Source of truth (in order):**
1. This spec.
2. `docs/design-handoff-v2/Portfolio v2.dc.html` — page markup, inline styles, interaction script.
3. `docs/design-handoff-v2/ProjectScreen.dc.html` — the six project screen mock-ups (desktop + phone).
4. `docs/design-handoff-v2/_ds/nocturne-*/styles.css` + `readme.md` — tokens and component classes (`.btn`, `.card`, `.tag`, `.field`, `.input`, `.nav`, `.dialog`, `.seg`, `.elev-*`).

`Portfolio.dc.html` (earlier version) and `Project Screens.dc.html` (a canvas of all screens) are reference only.

**Requested changes from the mockup:**
- **Sound removed entirely**: no sound toggle button, no Web Audio code.
- **Right-edge section indicator** becomes five fine chevron markers (option A): inactive = small `‹` chevron, 14px, 1.5px stroke, `--color-neutral-700`; active = longer left arrow `←` (22×18), `--color-accent`, soft accent glow as in the mockup's active line. Same position, gap and click targets (36×22) as the mockup; size and right offset scale down on small screens (`right: clamp(10px, 2vw, 28px)`, icons 12px / 18px below 860px). Each is a button labelled with its section name, `aria-current="true"` on the active one.

**Accepted conflicts (Amar confirmed):** blurple accent `#9184d9` and soft accent glows are deliberate.

## 2. Stack changes

- Keep Vite + React 19 + Tailwind CSS 4. Nocturne `styles.css` is copied to `src/styles/nocturne.css` and imported before Tailwind's utilities; its `:root` variables are the design tokens. Tailwind is used for layout utilities and reads the same variables via `@theme` aliases (`--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--color-neutral-*`, `--color-accent-*`).
- Icons: `@phosphor-icons/react` (regular weight) instead of the unpkg web font — no external icon CDN at runtime.
- Fonts: as declared by Nocturne (`--font-heading`, `--font-body` = Inter). Load Inter from Google Fonts in `index.html` with the weights `styles.css` uses.
- Contact form posts to `VITE_CONTACT_ENDPOINT` (full URL, e.g. Formspree).

## 3. Page and interaction (from the mockup, unless noted)

**Layout.** One fixed full-viewport stage with `perspective`. Inside it a cube of five faces (`section`): 01 Home, 02 Work, 03 About, 04 Experience, 05 Contact. A scroll spacer five viewports tall drives the cube. Fixed overlays: header nav, right-edge chevron indicator, bottom-left counter `0N / 05  Label`, project modal.

**Motion modes** (mockup `motion` prop): default **Vertical cube**; **Flat scroll** when `prefers-reduced-motion: reduce` (faces become normal stacked sections, no transforms, no tilt, no scramble, no mini-cube spin). Horizontal cube is not exposed (default only); scroll snap on (`y mandatory`) in cube mode.

**Cube math** (exact, from mockup `frame()`): `p = clamp(scrollY / innerHeight, 0, 4)`; `s = min(3, floor(p))`; `f = p − s`; eased `e = f < .5 ? 4f³ : 1 − (−2f + 2)³ / 2`; `pos = s + e`; active = `round(pos)`; cube rotates `pos × 90°` about X with a `translateZ(−D/2 − sin(π·e)·D·0.5)` dip; faces more than one step away are `visibility:hidden`; per-face shade opacity `(1 − cos(off·π/2)) × 0.75`; at rest the active face has `transform:none`. Mouse tilt eases toward pointer (`rotateX(−y·2.2°) rotateY(x·3°)`, factor 0.06) only in cube mode, wide screens, modal closed, not dragging.

**Drag.** Pointer drag on the stage (not on links, buttons, inputs, `[role=button]`, `[data-nodrag]`) scrolls proportionally; release snaps to next/previous face when dragged > 50px, else nearest. Touch in vertical mode uses native scroll.

**Keyboard (added).** When the modal is closed and focus is not in a form field: `PageDown`/`ArrowDown`/`Space` → next face; `PageUp`/`ArrowUp`/`Shift+Space` → previous; `Home`/`End` → first/last. Header links, chevrons, "See my work", "Get in touch", "Say hello", "Back to the top" all navigate via `goTo(i)`.

**Header** (`.nav`): brand (cube icon + "Muhamad Amar") → Home; nav links (Home, Work, About, Experience, Contact) with `aria-current="page"` on active, shown when `innerWidth ≥ 860`; primary button "Say hello" → Contact. No sound button.

**Home.** Eyebrow line + "Full-stack developer"; `h1` "Hi, I'm Amar." + muted "I build for the web, end to end." (both scramble on face enter); intro paragraph; buttons "See my work" (arrow-down) and "Get in touch". On wide screens: the **mini cube** (200px, faces Work/About/Experience/Contact/Home + `</>`), idle spin and inertia exactly as mockup, drag to spin, click a face (without drag) to jump; caption "Drag to spin · tap a face to jump". Footer hint "Scroll or drag to turn the cube".

**Work.** Eyebrow "Selected work", `h2` "Things I've built", intro sentence. Three project cards (`.card elev-sm`, `role="button"`, `tabindex="0"`, Enter/Space open): live-rendered thumbnail of the project's first screen scaled to card width (1280-wide screen × `cardWidth/1280`), kicker = stack, title, short text, "View screens ↗". Mouse tilt + glare on hover (pointer type mouse only).

**Project modal** (`.dialog`, `role="dialog"`, `aria-modal`, labelled by title): kicker, title, close button, description; screen segmented control (one per screen), device segmented control (Desktop / Tablet / Phone), previous/next buttons; preview area renders the selected screen in a browser frame (desktop, URL `amar.dev/work/{screenId}`), tablet frame, or phone frame, scaled to fit as in the mockup (`previewH = clamp(shotW·0.6, 240, innerHeight·0.58)`); footer "My role: …" + tags. `Escape` closes, `←`/`→` change screen, focus moves into the dialog on open, is trapped while open, and returns to the opening card on close (added). Page scroll is locked while open.

**About.** Eyebrow "About me", `h2` scramble, two paragraphs, four tag groups with Phosphor icons: Build (accent tags), Workflow, Hosting & servers, Design & content (neutral tags; "Responsive design" outline).

**Experience.** Eyebrow, `h2` "Where I've been", primary button "Download CV" (download-simple icon) → `profile.cvUrl` with `download`. Four rows: period (mono) + "Role · Company" + one line.

**Contact.** Eyebrow, `h2` "Let's build something together.", sentence, two contact rows (Email → `mailto:`, WhatsApp → `https://wa.me/{number}`, new tab) with arrow-up-right. Form card "Send a message": Your name, Email, Message, "Send message". Footer row "© {year} Muhamad Amar" + ghost "Back to the top".
- **Send flow:** validate first (name required; email well-formed; message ≥ 10 chars) with inline `.field` error text linked by `aria-describedby` and focus on the first invalid field (added — mockup relied on native `required` bubbles). Then the fold animation starts (form folds, envelope cube flies — keyframes and timings exactly as mockup) **while** the request is sent. Success → "Message sent / Thanks, {first name}. It's on its way, and I'll get back to you soon." + "Send another" (fade-in 450ms). Failure (network error, non-2xx, 15s timeout) → animation cancelled, form shown again with values kept and an alert "Something went wrong. Please email me at {email}." (added). Under reduced motion, no animation.
- **No `VITE_CONTACT_ENDPOINT`:** the form card shows "Email me at {email}" instead of the form.

**Scramble.** Glyphs `!<>-_/[]{}=+*^?#01`, duration `380 + len·16` ms, character `i` settles when `k ≥ (i/len)·0.7 + 0.3`; spaces never scramble; runs on face enter and 300ms after load; final text always equals the original. The original text stays in an `aria-label` / visually-hidden copy so screen readers never read glyphs.

## 4. Project screens

`src/screens/` ports the six `ProjectScreen` mock-ups as React components — `tt-week` (weekly timetable), `tt-staff` (staff directory), `sales-landing`, `sales-admin`, `resto-landing`, `resto-menu` — each with `device: 'desktop' | 'phone'` layouts (desktop rendered at 1280×800, phone at 390×844, then CSS-scaled). Their sample data (staff names, KPIs, orders, dishes) lives in `src/screens/sampleData.js`. A project may instead provide real screenshot images later (`screens[].image`); if present, the image is shown instead of the mock.

## 5. Content (`src/data/`)

```js
// profile.js
{ name: 'Muhamad Amar', shortName: 'Amar', role: 'Full-stack developer',
  intro, email, whatsapp: { display, number }, cvUrl: '/cv/Amar-CV.pdf' }
// projects.js — [{ id, title, stack, role, short, desc, tags: [], screens: [{ id, label, image? }] }]
// about.js    — { heading, paragraphs: [], groups: [{ icon, label, variant: 'accent'|'neutral', tags: [], outline?: [] }] }
// experience.js — [{ period, title, line }]
```

Text copied verbatim from the mockup. Known placeholders kept visible until Amar replaces them: `amar@example.com`, `+60 12-345 6789` / `60123456789`, every `20XX`, "Role title · Company name", "One line on what you built there and the result it had.", "Qualification · Institution", "Education details go here."

## 6. Content check (`npm run check:content`, gates Vercel)

Fails and lists each problem when `src/data/*.js` or `index.html` contains any placeholder pattern: `20XX`, `example.com`, `Role title`, `Company name`, `Qualification · Institution`, `Education details go here`, `12-345 6789`, `60123456789`, or a `[Bracketed]` placeholder; when `public/cv/Amar-CV.pdf` is missing; or when any `screens[].image` path is missing with exact filename case.

## 7. Code structure

```
src/
  main.jsx  App.jsx  index.css                # index.css: @import nocturne.css, Tailwind, @theme aliases, page-level CSS
  styles/nocturne.css
  data/       profile.js projects.js about.js experience.js data.test.js
  lib/
    cube.js          # easeInOutCubic, cubeState(scrollY, vh, n) → { pos, active, e, rest }, faceShade(off)
    scramble.js      # scrambleFrame(text, k, rand) → string
    contact.js       # validateContact, sendContact(endpoint, values, { timeoutMs })
  hooks/
    useCubeScroll.js # layout, rAF loop, drag, keyboard, tilt, goTo; returns { active, goTo, mode, wide }
    useScramble.js   # runs scramble on a container's [data-scramble] nodes when `trigger` changes
  components/
    Header.jsx SectionIndicator.jsx SectionCounter.jsx MiniCube.jsx ProjectCard.jsx
    ProjectModal.jsx DeviceFrame.jsx ContactForm.jsx Eyebrow.jsx
  sections/   Home.jsx Work.jsx About.jsx Experience.jsx Contact.jsx
  screens/    index.js (screen id → component) sampleData.js TtWeek.jsx TtStaff.jsx SalesLanding.jsx
              SalesAdmin.jsx RestoLanding.jsx RestoMenu.jsx
public/cv/  favicon.svg robots.txt
```

All Phase 1 UI files and their tests are removed. `docs/design-handoff/` (the superseded bento handoff) is deleted (kept in git history).

## 8. Accessibility and quality

- One `h1`; each face's title is an `h2`; modal title is the dialog's accessible name.
- Faces not on screen are `visibility:hidden` in cube mode, so their links are not tabbable; in flat mode all are reachable in order.
- Focus ring: Nocturne `:focus-visible` 2px accent outline, offset 2px.
- Text contrast AA: body copy never uses the raw accent (`--color-accent-300` for accent-coloured text per Nocturne readme).
- Lighthouse (mobile + desktop): Accessibility ≥ 95, Best Practices ≥ 95, Performance ≥ 85 (3D page; record actual).
- Works without horizontal scroll at 360, 390, 768, 1280 wide; header collapses links below 860px as in the mockup.

## 9. Docker

As in `2026-10-05-portfolio-redesign-docker-design.md` §10 (that section still applies): `Dockerfile` with `deps` → `dev` → `build` (`ARG VITE_CONTACT_ENDPOINT`) → `prod` (`nginx:alpine`); `docker-compose.yml` with `web` (dev, 5173, bind mount, `/app/node_modules` volume, `VITE_USE_POLLING=true`) and `web-prod` (profile `prod`, 8080:80); `docker/nginx.conf` with SPA fallback, immutable `/assets/` caching, `no-cache` `index.html`, security headers, gzip; `.dockerignore`; README "Run with Docker". Docker Desktop must be installed by Amar first; Docker work comes last.

## 10. Testing and verification

- Unit (Vitest + Testing Library): `cube.js` (easing endpoints and midpoint, `cubeState` at 0, 0.5, 1.0, 3.7 and clamping beyond 4, active rounding), `scramble.js` (k=1 returns original, spaces preserved, length preserved), `contact.js` (validation messages, POST shape, non-2xx, timeout), data contract, content rules, SectionIndicator (5 buttons, labels, active `aria-current`, click calls `goTo`), Header (links, Say hello), ProjectCard (Enter/Space open), ProjectModal (screen/device switching, Escape, arrow keys, focus in and back), ContactForm (validation focus, success, failure keeps values, no-endpoint fallback), App smoke (h1, five h2 in order, flat mode under reduced motion renders all faces visible).
- Visual: side-by-side with `Portfolio v2.dc.html` served from the dev server at 1280×800 and 390×844 for each face, the modal (each device) and the contact success state; differences fixed.
- Lighthouse as in §8. Docker checks as in the previous spec §12.

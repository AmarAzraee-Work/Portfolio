# Amar — Portfolio website (build brief for Claude Code)

Build a single-page personal portfolio for Amar, a junior Full Stack Developer (React + Laravel) job hunting in Malaysia, from the design in this folder. **The design is decided — implement it, don't redesign it.**

## Read these first (in order)

1. `BRIEF.md` — the original requirements (goal, audience, sections, rules).
2. `design-system/BRAND-BOOK.md` — colour, type, spacing, layout, copy and motion rules.
3. `design-system/tokens.json` — every exact value (colours, type scale, spacing, radius, shadows).
4. `design-system/components/*.md` — one guideline per component (props, states, do/don't).
5. `reference/screenshot-desktop.png` and `reference/screenshot-mobile.png` — what it should look like.
6. `reference/portfolio-desktop.html` / `portfolio-mobile.html` — open in a browser to see the working prototype (hover, focus, form validation, mobile menu).

`design-system/components/bundle.js` + `bundle.css` are the prototype implementation (plain `React.createElement`, hand-written CSS). Use them as the **source of truth for markup, class structure, states and exact values**, then rewrite them as clean JSX + Tailwind. `index.d.ts` lists every component's props.

## Stack

- Vite + React 18 + Tailwind CSS (v3 or v4). No UI library.
- Fonts: Inter (400/500/600/700) and JetBrains Mono (400/500) from Google Fonts.
- Deploy target: static site (Vercel / Netlify / GitHub Pages).
- Contact form: `onSubmit(values)` returns a promise — wire it to Formspree (or a small Laravel endpoint) via an env var `VITE_CONTACT_ENDPOINT`.

## Project structure to create

```
src/
  main.jsx, App.jsx, index.css
  content.js              ← ALL text, projects, experience, certs (start from content.example.js)
  components/
    Navbar.jsx  Button.jsx  Tag.jsx  StatusBadge.jsx  SectionHeading.jsx
    BentoTile.jsx  BrowserFrame.jsx  ProjectRow.jsx  TimelineItem.jsx
    CertItem.jsx  ContactForm.jsx  Reveal.jsx  Icon.jsx
  sections/
    Hero.jsx  Work.jsx  Experience.jsx  Certifications.jsx  About.jsx  Contact.jsx  Footer.jsx
public/
  cv/Amar-CV.pdf  images/ (screenshots, photo)
```

- Put the tokens into Tailwind using `tailwind.tokens.js` (already mapped from `tokens.json`).
- Render projects, experience and certs **from data in `content.js`** — adding a project = adding one object.
- Keep the `[bracketed]` placeholders until Amar supplies real content. A missing `githubUrl` shows "Private client code"; a missing `image` shows the placeholder frame; a missing `verifyUrl` hides the link.

## Non-negotiables

- Dark theme only. ONE accent: `#4ade80`. No gradients, glows, glassmorphism, emoji in headings, skill bars, rocket/sparkle icons.
- Exactly one `<h1>`. Section titles are `<h2>`. Nav labels: Work, Experience, Certifications, Contact.
- Sticky navbar; **Download CV and Contact stay visible on mobile** (other links go into the menu).
- Responsive at 375px and 1280px, no horizontal scroll. Bento collapses to one column below 768px (`md:`) in order: intro → stat → location → featured → stack → currently → photo.
- WCAG AA: input/secondary-button borders use `border-input` (#66727a); visible green focus ring on `:focus-visible` (2px bg gap + 2px accent); errors linked with `aria-describedby`, focus moves to first invalid field.
- Motion: only a subtle fade-in on scroll (`Reveal`); disabled under `prefers-reduced-motion`.

## Done when

- `npm run build` passes with no warnings.
- Lighthouse Accessibility ≥ 95 on mobile and desktop.
- Matches the reference screenshots at 1280px and 375px.
- All links in `content.js` open correctly; Download CV downloads the PDF.

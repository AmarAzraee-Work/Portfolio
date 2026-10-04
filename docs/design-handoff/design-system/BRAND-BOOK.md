A one-page portfolio for a junior Full Stack Developer (React + Laravel) job hunting in Malaysia. It has two readers. **HR recruiters** give it 30–60 seconds and need to see four things in the first five seconds: who Amar is, that he is open to work, his core stack, and that his projects are **live with real users**. **Technical interviewers** click the live demos and GitHub. Every decision below serves one of those two readers.

## Page structure

Sticky **Navbar** → **Hero bento grid** → **Work** (product showcase) → **Experience** (timeline) → **Certifications** → **About** → **Contact** → **Footer**. See the *Pages* cards for the full layout at 1280px and 375px.

- Exactly one `<h1>` (the hero headline). Every section opens with `SectionHeading` (an `<h2>`); project names, roles and form success titles are `<h3>`.
- Section anchors: `#work`, `#experience`, `#certifications`, `#about`, `#contact`, each with `scroll-margin-top: var(--nav-height)`.
- **Download CV** and **Contact** are one click from anywhere: both live in the sticky navbar at every width. On mobile the other links fold into the menu, those two never do.

## Voice and copy

- Plain English a recruiter understands. Describe the **business problem** before the tech: "Lets 40 staff swap shifts without a WhatsApp group", not "CRUD app with Laravel Sanctum".
- First person, short sentences, sentence case. Numbers over adjectives ("used daily by 40 staff", "3 live projects").
- Navigation and headings use HR words only: Work, Experience, Certifications, About, Contact. Code flavour is limited to the small mono labels (`01`, `RESULT`).
- Never: "Crafting seamless digital experiences", "passionate", "rockstar", emoji in headings, skill percentages or bars, rocket/sparkle icons.
- Placeholders in `[square brackets]` are content still to be supplied. A missing link is hidden, never shown disabled.

## Colour

Dark only. One accent.

- Page `bg`; tiles, cards and the form panel `surface`; hover and the menu sheet `surface-raised`.
- Body copy `text`; headings and names `heading`; dates, issuers, captions and mono labels `muted`. All pass AA on every surface (lowest: `muted` on `surface-raised`, 5.3:1).
- `accent` (#4ade80) is the **only** accent: links, the primary button, live dots, the focus ring, index numerals. Text on an accent fill is `on-accent`, never white.
- `accent-soft` sits behind the Live badge and Open-to-work pill; `neutral-soft` behind tags and the Demo badge.
- `border` is a decorative hairline (1.1:1). Anything that must be seen as a control edge — inputs, secondary buttons — uses `border-input` (≥3.5:1).
- `danger` is reserved for form errors and always comes with a written message. It is a state, not a second accent.
- No gradients, glows, glass, blobs or purple/blue anywhere. The only blur is the navbar's legibility backdrop.

## Type

- **Inter** for everything readable; **JetBrains Mono** only for small details: tags, labels, index numbers, dates, the stat numeral. Both load from Google Fonts (`components/bundle.css` imports them).
- Scale: `display` 56/60 (36/40 mobile) for the H1 · `h2` 36/42 (28 mobile) · `h3` 24/30 (32 for the featured project) · `lead` 20/30 · `body` 16/26 · `small` 14/22 · `label` mono 12 uppercase +0.04em · `tag` mono 12.
- Headings are weight 600 with negative tracking; body is 400. No weight above 700.

## Space, radius, layout

- Content column `content-max` 1200px, gutters `space-6` (desktop) / `space-4` (mobile). Sections are separated by `space-24` (64px on mobile).
- Bento gap `space-4` (12px mobile); tile padding `space-6` (32px for the intro tile); between project rows `space-12`.
- Radii: `radius-lg` tiles and cards, `radius-md` buttons and screenshots, `radius-sm` tags, badges and inputs, `radius-full` dots and pills.
- Breakpoint `bp-mobile` 720px: below it the bento grid, project rows, about and contact splits collapse to a single column. No horizontal scrolling at 375px. In Tailwind, map this to `md:` (768px).

### Hero bento (desktop, 4 × 4)

| | col 1–2 | col 3 | col 4 |
|---|---|---|---|
| rows 1–2 | Intro: Open to work · H1 · subline · See my work / Download CV | Photo | row 1 Location · row 2 Stat |
| rows 3–4 | row 3 Stack tags · row 4 Currently learning + Let's talk → | Featured project (screenshot, ● Live, View →) | ← spans 3–4 |

Mobile order: intro → stat → location → featured → stack → currently → photo. Recruiters see "open to work", the stack and the live count before scrolling past the first screen.

### Work

The featured project is a full-width row (screenshot 7 / text 5, optional phone frame overlapping bottom-right). The others sit two-up. Every project shows: index, name, one problem sentence, a **Result** strip, tags, a `StatusBadge`, and **View live** + **GitHub**. Private client work replaces GitHub with a lock icon and "Private client code". A missing screenshot shows the hatched placeholder with the project name.

## Interaction and states

- Focus: every interactive element shows `focus-ring` on `:focus-visible` — a 2px `bg` gap, then a solid 2px `accent` ring.
- Hover: tiles and secondary buttons move to `surface-raised`; links underline; the primary button lightens slightly.
- Forms: visible `border-input` borders at rest, `accent` border + ring on focus, `danger` border + message when invalid; on success the form is replaced by a confirmation panel with a "Send another message" button.
- Touch targets at least 40px (buttons 44px, nav 36px desktop / 40px mobile).

## Motion

Only a subtle fade-in-and-rise (12px, 500ms) as sections enter the viewport, via `Reveal`. The live dot breathes slowly. Under `prefers-reduced-motion: reduce` both are off and content is shown immediately.

## Imagery

- Screenshots are real product screens, cropped from the top at 16:10, inside `BrowserFrame`. Phone screenshots at 9:19 inside `PhoneFrame`, featured project only.
- One professional photo in the photo tile, cropped to fill. No stock photos, illustrations or 3D renders.
- Icons are simple 2px-stroke line icons drawn inline (download, arrow, external, lock, alert, check, menu) plus the GitHub mark. No icon is used as decoration.

## Building it (React + Tailwind)

Components map 1:1 to the reusable React components: `Tag`, `StatusBadge`, `Button`, `SectionHeading`, `BentoTile`, `BrowserFrame`, `ProjectRow`, `TimelineItem`, `CertItem`, `ContactForm`, `Navbar`, `Reveal`. Put the colour, radius and spacing tokens into `tailwind.config` `theme.extend` under the same names (`bg`, `surface`, `accent`, `on-accent`…), keep project, experience and certificate data in one `content.js` array each, and render the rows from data so adding a project is one object.

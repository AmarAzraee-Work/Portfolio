# BentoTile

One cell of the hero bento grid: surface card, 16px radius, optional mono eyebrow.

- Provide `eyebrow` ("Based in", "Shipped", "Currently"), `children`, and a grid-placement `className` (`am-hero-intro`, `am-hero-photo`, `am-hero-loc`, `am-hero-stat`, `am-hero-stack`, `am-hero-now`, `am-hero-feat`).
- `href` makes the whole tile one link (hover lifts to `surface-raised`); give it `ariaLabel`.
- Desktop: 4 columns × 4 rows, 16px gap. Under 720px: one column in reading order intro → stat → location → featured → stack → currently → photo.
- One idea per tile. No icons-in-circles, no three identical tiles in a row.

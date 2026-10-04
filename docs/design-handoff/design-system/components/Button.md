# Button

Link or button in three variants: `primary` (accent fill), `secondary` (outlined), `ghost` (text link with arrow).

- Provide `href` for navigation (renders `<a>`), omit for actions (renders `<button>`). `external` opens a new tab with `rel=noopener`.
- `icon`: `download`, `github`, `arrow`, `ext`, `mail`; `iconRight` for trailing arrows. `size="sm"` (36px) only in the navbar.
- One primary per view region: Download CV in the nav, View live in a project row, Send message in the form.
- Text on the green fill is `on-accent`, never white. Min height 44px for touch.

# Muhamad Amar — Portfolio

A single-page portfolio built as a 3D cube: scroll, drag or use the keyboard (PageDown / arrows / Home / End) to turn between Home, Work, About, Experience and Contact. Design: "Nocturne" from Claude Design (`docs/design-handoff-v2/`).

Built with **Vite + React 19 + Tailwind CSS 4**, tested with **Vitest + Testing Library**, deployed on **Vercel**.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # unit tests
npm run build          # production build into dist/
npm run preview        # serve dist/ on http://localhost:4173
```

Dev-only page to compare the project screen mock-ups with the design: `http://localhost:5173/#screens/tt-week/desktop` (any screen id, `desktop` or `phone`).

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/` | All content: profile, projects, about, experience, section copy. Edit these to change the text. |
| `src/sections/` | The five faces of the cube. |
| `src/components/` | Header, section indicator, project cards and modal, contact form, mini cube… |
| `src/screens/` | The six project screen mock-ups (desktop and phone). |
| `src/hooks/useCubeScroll.js` | The cube engine: turns scroll position into rotation, plus drag, keyboard and tilt. |
| `src/lib/` | Pure logic with unit tests (cube maths, scramble text, contact form). |
| `src/styles/nocturne.css` | The Nocturne design system (tokens and classes). |

With **reduced motion** turned on in the OS, the site becomes a normal scrolling page (no cube, no animations).

## Contact form

The form posts JSON to `VITE_CONTACT_ENDPOINT`, a full URL such as `https://formspree.io/f/<your-id>` (later, your own Laravel endpoint). Copy `.env.example` to `.env.local` and set it. Without it, the contact face shows your email instead of the form. On Vercel, add it under Project → Settings → Environment Variables.

## Before deploying

```bash
npm run check:content
```

Fails while placeholder content is left (`20XX`, `example.com`, the sample WhatsApp number, "Role title", …) or `public/cv/Amar-CV.pdf` is missing. Vercel runs it before every build (`vercel.json`), so placeholder text can never go live.

## Run with Docker

Docker runs the project inside containers, so it works the same on any machine without installing Node. You need [Docker Desktop](https://www.docker.com/products/docker-desktop/).

**Development** (live reload — edit files on your Mac and the page updates):

```bash
docker compose up
```

Open http://localhost:5173. Stop with `Ctrl+C`, or `docker compose down`.

**Production** (the built site served by Nginx, like a real server):

```bash
docker compose --profile prod up --build
```

Open http://localhost:8080.

How it fits together:

- `Dockerfile` is a **multi-stage build**: `deps` installs packages, `dev` runs Vite, `build` creates `dist/`, and `prod` copies only `dist/` into a small `nginx:alpine` image. The production image has no Node and no source code.
- `VITE_CONTACT_ENDPOINT` is a **build argument**, not a runtime variable: Vite writes it into the JavaScript during `npm run build`. Set it in your shell or `.env` before building the prod image.
- `docker/nginx.conf` sends unknown paths to `index.html` (single-page app), caches hashed files in `/assets/` for a year, never caches `index.html`, and adds basic security headers.
- `docker-compose.yml` mounts your code into the dev container and keeps the container's own `node_modules`. Phase 2 will add Laravel and MySQL services here.

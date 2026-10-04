# Original brief

Design a single-page personal portfolio website for a junior Full Stack Developer (React + Laravel) who is job hunting in Malaysia.

## Goal and audience
- Primary audience: HR recruiters (non-technical) who spend 30–60 seconds on the page, plus technical interviewers who will click live demos and GitHub.
- In the first 5 seconds a visitor must understand: who I am, that I'm open to work, my core stack, and that my projects are LIVE with real users.
- "Download CV" and "Contact" must be reachable in one click from anywhere, including on mobile.

## Visual direction
- Dark theme. Background near-black #0b0d0e, card surface #151a1c, borders #1f2528, body text #c9d1d6, headings #f1f5f7, muted text #8a959c.
- ONE accent colour only: green #4ade80 (links, primary buttons, "live" status dots). No other accent colours.
- Typography: Inter for headings and body; JetBrains Mono only for small details (tech tags, labels, numbers like "01").
- Layout concept: a BENTO GRID hero, followed by a PRODUCT SHOWCASE projects section.
- Plain, HR-friendly section labels: "Work", "Experience", "Certifications", "Contact" — no code jargon in navigation.
- Professional and confident, with personality coming from layout and real details, not decoration.

## Strictly avoid (generic "AI-made" look)
Purple/blue gradients, glowing blobs, glassmorphism, neon glow, emoji in headings, skill percentage bars, rocket/sparkle icons, three identical feature cards, and vague copy like "Crafting seamless digital experiences".

## Sections (in order)
1. Sticky navbar — Left: "Amar". Right: Work, Experience, Certifications, Contact, green "Download CV" button. Mobile: "Download CV" stays visible next to a menu button.
2. Hero — bento grid: intro tile (green dot + "Open to work", headline "Hi, I'm Amar. I build web apps people use every day.", subline "Full Stack Developer · React + Laravel"); photo tile; location tile "[City], Malaysia · open to hybrid/remote"; stat tile "[number] live projects"; featured project tile (screenshot, "● Live" badge, "View →"); stack tile (React, Laravel, PHP, JavaScript, MySQL, Tailwind, Git, Docker); "Currently learning Docker" + "Let's talk →".
3. Work — product showcase: large rows, screenshot in browser frame (optional overlapping phone frame), numbered 01/02…; name, one plain-English problem sentence, one outcome, tech tags, status badge (Live green / Demo grey), "View live" and "GitHub". Featured project larger. Show no-GitHub (private client work) and no-screenshot (neutral placeholder) cases.
4. Experience — vertical timeline: [Role] @ [Company] · [dates], 2–3 plain-language bullets, tech tags.
5. Certifications — compact list: [Certificate] — [Issuer] · [Year] — "Verify ↗" (hidden if none).
6. About — 2–3 short paragraphs: background, what I enjoy building, the team I want to join.
7. Contact — Left: "I'm looking for a full stack developer role. The fastest way to reach me is email." + email, LinkedIn, GitHub. Right: form (name, email, message, "Send message") with visible input borders, inline errors, success state.
8. Footer — "© 2026 Amar · Built with React + Tailwind · View source".

## Requirements
- Responsive: desktop 1280px and mobile 375px; bento collapses to one column on mobile; no horizontal scrolling.
- Accessibility: WCAG AA contrast, visible green focus outlines, input borders ≥ 3:1, one H1.
- Motion: only subtle fade-in on scroll; respect reduced-motion.
- Built in React + Tailwind; reusable components: Tag, StatusBadge, ProjectRow, BentoTile, TimelineItem, SectionHeading.

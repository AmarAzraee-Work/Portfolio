// Reference only: how the components compose into the full page (plain React.createElement, no JSX).
// Rebuild this as JSX components in the real project.

  var A = window.Amar, h = React.createElement;
  var STACK = ['React', 'Laravel', 'PHP', 'JavaScript', 'MySQL', 'Tailwind', 'Git', 'Docker'];
  var PROJECTS = [
    { id: 'p1', index: '01', featured: true, mock: true, status: 'live', name: '[Project 1 name]',
      problem: '[One plain-English sentence: the business problem it solves, e.g. "Replaces a messy shift spreadsheet so staff can see and swap shifts on their phone."]',
      outcome: '[Outcome, e.g. "Used daily by X staff"]', tags: ['Laravel', 'React', 'MySQL', 'Tailwind'],
      liveUrl: 'https://project-one.example.com', githubUrl: 'https://github.com/' },
    { id: 'p2', index: '02', mock: true, status: 'live', name: '[Project 2 name]',
      problem: '[The business problem it solves, in one sentence a recruiter understands.]',
      outcome: '[Outcome — a number or one sentence]', tags: ['Laravel', 'Blade', 'MySQL'],
      liveUrl: 'https://project-two.example.com', githubUrl: null, privateNote: 'Private client code' },
    { id: 'p3', index: '03', status: 'demo', name: '[Project 3 name]',
      problem: '[The problem it solves.] No screenshot yet — the frame shows a neutral placeholder with the project name.',
      outcome: '[Outcome]', tags: ['React', 'JavaScript', 'API'],
      liveUrl: 'https://project-three.example.com', githubUrl: 'https://github.com/' }
  ];

  function Hero() {
    return h('section', { className: 'am-section am-hero', id: 'top', 'aria-label': 'Introduction' },
      h('div', { className: 'am-bento' },
        h(A.BentoTile, { className: 'am-hero-intro' },
          h('div', null,
            h(A.StatusBadge, { status: 'open' }),
            h('h1', null, 'Hi, I’m Amar. I build web apps people use every day.'),
            h('p', { className: 'am-lead' }, 'Full Stack Developer · React + Laravel')),
          h('div', { className: 'am-hero-actions' },
            h(A.Button, { href: '#work', variant: 'primary', iconRight: 'arrow' }, 'See my work'),
            h(A.Button, { href: '#', variant: 'secondary', icon: 'download', download: true }, 'Download CV'))),
        h(A.BentoTile, { className: 'am-hero-photo', flush: true },
          h('div', { className: 'am-photo', role: 'img', 'aria-label': '[Professional photo of Amar]' }, h('span', { className: 'am-label' }, '[Professional photo]'))),
        h(A.BentoTile, { className: 'am-hero-loc', eyebrow: 'Based in' },
          h('p', { className: 'am-tile-title' }, '[City], Malaysia'),
          h('p', { className: 'am-tile-muted am-tile-foot' }, 'Open to hybrid / remote')),
        h(A.BentoTile, { className: 'am-hero-stat', eyebrow: 'Shipped' },
          h('span', { className: 'am-stat-num' }, '[3]'),
          h('p', { className: 'am-tile-text' }, 'live projects with real users')),
        h(A.BentoTile, { className: 'am-hero-stack', eyebrow: 'Core stack' },
          h(A.TagList, { tags: STACK }),
          h('p', { className: 'am-tile-muted am-tile-foot' }, 'From the MySQL schema to the React screen \u2014 I build and deploy both ends.')),
        h(A.BentoTile, { className: 'am-hero-now' },
          h('div', null, h('p', { className: 'am-label', style: { margin: '0 0 6px' } }, 'Currently'), h('p', { className: 'am-tile-title' }, 'Learning Docker')),
          h('a', { href: '#contact', style: { fontWeight: 600 } }, 'Let’s talk →')),
        h(A.BentoTile, { className: 'am-hero-feat', href: '#p1', ariaLabel: 'View [Project 1 name], featured live project' },
          h('div', { className: 'am-feat-head' },
            h('div', null, h('p', { className: 'am-label', style: { margin: '0 0 6px' } }, 'Featured project'), h('p', { className: 'am-tile-title' }, '[Project 1 name]')),
            h(A.StatusBadge, { status: 'live' })),
          h(A.BrowserFrame, { className: 'am-feat-shot', mock: true, url: 'project-one.example.com', title: '[Project 1 name]' }),
          h('span', { style: { color: 'var(--accent)', fontWeight: 600, fontSize: '15px' } }, 'View →'))));
  }

  function Work() {
    return h('section', { className: 'am-section', id: 'work', 'aria-labelledby': 'work-h' },
      h(A.SectionHeading, { id: 'work-h', index: '01', title: 'Work', subtitle: 'Products I designed, built and keep running. Click through — they’re live.' }),
      h('div', { className: 'am-projects' },
        h('div', { id: 'p1' }, h(A.ProjectRow, PROJECTS[0])),
        h('div', { className: 'am-projects-grid' }, h(A.ProjectRow, PROJECTS[1]), h(A.ProjectRow, PROJECTS[2]))));
  }

  function Experience() {
    return h('section', { className: 'am-section', id: 'experience', 'aria-labelledby': 'exp-h' },
      h(A.SectionHeading, { id: 'exp-h', index: '02', title: 'Experience' }),
      h('ol', { className: 'am-timeline' },
        h(A.TimelineItem, { current: true, role: '[Role, e.g. IT Executive]', company: '[Company]', period: '[Month Year] – Present',
          bullets: ['[What you built, in plain language — e.g. "Built an internal shift app now used by the whole newsroom."]', '[What you improved — a number if you have one.]', '[What you own or maintain.]'],
          tags: ['Laravel', 'WordPress', 'MySQL'] }),
        h(A.TimelineItem, { role: '[Software Developer Intern]', company: '[Company]', period: '[Month Year] – [Month Year]',
          bullets: ['[What you built or achieved.]', '[Second achievement.]'], tags: ['React', 'PHP'] })));
  }

  function Certs() {
    return h('section', { className: 'am-section', id: 'certifications', 'aria-labelledby': 'cert-h' },
      h(A.SectionHeading, { id: 'cert-h', index: '03', title: 'Certifications' }),
      h('ul', { className: 'am-certs' },
        h(A.CertItem, { name: '[Certificate name]', issuer: '[Issuer]', year: '[Year]', verifyUrl: 'https://example.com' }),
        h(A.CertItem, { name: '[Certificate name]', issuer: '[Issuer]', year: '[Year]', verifyUrl: 'https://example.com' }),
        h(A.CertItem, { name: '[Certificate with no public link]', issuer: '[Issuer]', year: '[Year]' })));
  }

  function About() {
    return h('section', { className: 'am-section', id: 'about', 'aria-labelledby': 'about-h' },
      h('div', { className: 'am-about' },
        h(A.SectionHeading, { id: 'about-h', index: '04', title: 'About' }),
        h('div', null,
          h('p', null, '[My background — e.g. "I’m the IT person at a Malaysian news company. I started coding to fix our own problems, and kept going."]'),
          h('p', null, '[What I enjoy building — the kind of problems and products that keep you up late.]'),
          h('p', null, '[The kind of team I want to join — what you want to learn and give back.]'))));
  }

  function Contact() {
    return h('section', { className: 'am-section', id: 'contact', 'aria-labelledby': 'contact-h' },
      h('div', { className: 'am-contact' },
        h('div', null,
          h(A.SectionHeading, { id: 'contact-h', index: '05', title: 'Contact' }),
          h('p', { className: 'am-contact-lead' }, 'I’m looking for a full stack developer role. The fastest way to reach me is email.'),
          h('ul', { className: 'am-contact-list' },
            h('li', null, h('span', { className: 'am-label' }, 'Email'), h('a', { href: 'mailto:[email]' }, '[email@domain.com]')),
            h('li', null, h('span', { className: 'am-label' }, 'LinkedIn'), h('a', { href: '#' }, 'linkedin.com/in/[handle]')),
            h('li', null, h('span', { className: 'am-label' }, 'GitHub'), h('a', { href: '#' }, 'github.com/[handle]')))),
        h(A.ContactForm, { idPrefix: 'contact' })));
  }

  function Footer() {
    return h('footer', { className: 'am-footer' },
      h('span', null, '© 2026 Amar · Built with React + Tailwind'),
      h('a', { href: 'https://github.com/' }, 'View source'));
  }

  function Page() {
    return h('div', { className: 'am-root am-page' },
      h(A.Navbar, { name: 'Amar', cvHref: '#' }),
      h('main', null, h(Hero), h(Work), h(Experience), h(Certs), h(About), h(Contact)),
      h(Footer));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(Page));

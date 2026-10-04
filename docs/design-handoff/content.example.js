// Copy to src/content.js and replace every [bracket] with real content.
// Rules: one plain-English sentence per `problem` (business problem, not tech),
// `outcome` = a number or one sentence. Omit githubUrl for private client work,
// omit image if there is no screenshot yet, omit verifyUrl if a cert has no link.

export const profile = {
  name: 'Amar',
  headline: 'Hi, I’m Amar. I build web apps people use every day.',
  role: 'Full Stack Developer · React + Laravel',
  openToWork: true,
  city: '[City]',
  workMode: 'Open to hybrid / remote',
  photo: '/images/amar.jpg',          // [professional photo]
  cvUrl: '/cv/Amar-CV.pdf',
  currentlyLearning: 'Docker',
  email: '[email@domain.com]',
  linkedin: 'https://linkedin.com/in/[handle]',
  github: 'https://github.com/[handle]',
  sourceUrl: 'https://github.com/[handle]/[portfolio-repo]',
};

export const stack = ['React', 'Laravel', 'PHP', 'JavaScript', 'MySQL', 'Tailwind', 'Git', 'Docker'];

export const projects = [
  {
    id: 'p1', index: '01', featured: true, status: 'live',
    name: '[Project 1 name]',
    problem: '[The business problem it solves, in one sentence]',
    outcome: '[e.g. Used daily by X staff]',
    tags: ['Laravel', 'React', 'MySQL', 'Tailwind'],
    liveUrl: '[https://live-url]',
    githubUrl: '[https://github.com/...]',
    image: '/images/project-1.png',       // 16:10 desktop screenshot
    phoneImage: '/images/project-1-m.png' // optional 9:19 mobile screenshot (featured only)
  },
  {
    id: 'p2', index: '02', status: 'live',
    name: '[Project 2 name]',
    problem: '[Problem]',
    outcome: '[Outcome]',
    tags: ['Laravel', 'MySQL'],
    liveUrl: '[https://live-url]',
    githubUrl: null,                       // private client work -> "Private client code"
    image: '/images/project-2.png',
  },
  {
    id: 'p3', index: '03', status: 'demo',
    name: '[Project 3 name]',
    problem: '[Problem]',
    outcome: '[Outcome]',
    tags: ['React', 'JavaScript'],
    liveUrl: '[https://demo-url]',
    githubUrl: '[https://github.com/...]',
    // no image -> neutral placeholder with project name
  },
];

export const experience = [
  {
    current: true,
    role: '[Role]', company: '[Company]', period: '[Month Year] – Present',
    bullets: ['[What you built]', '[What you improved, with a number]', '[What you own]'],
    tags: ['Laravel', 'WordPress', 'MySQL'],
  },
  {
    role: '[Software Developer Intern]', company: '[Company]', period: '[Month Year] – [Month Year]',
    bullets: ['[What you built or achieved]', '[Second achievement]'],
    tags: ['React', 'PHP'],
  },
];

export const certifications = [
  { name: '[Certificate name]', issuer: '[Issuer]', year: '[Year]', verifyUrl: '[https://verify-url]' },
  { name: '[Certificate name]', issuer: '[Issuer]', year: '[Year]' }, // no link -> hidden
];

export const about = [
  '[My background]',
  '[What I enjoy building]',
  '[The kind of team I want to join]',
];

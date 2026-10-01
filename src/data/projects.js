// TODO: replace — these example entries show every variant (featured, missing image, missing links).
// Put screenshots in public/projects/ and reference them as '/projects/<file>.png'.
export const projects = [
  {
    title: 'Example Production App',
    description: 'TODO: replace — what problem it solves and who uses it, in one or two sentences.',
    image: '/projects/example-app.png',
    tech: ['react', 'laravel', 'mysql'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/TODO-replace/example-app',
    status: 'in production',
    featured: true,
  },
  {
    title: 'Example Client Project',
    description: 'TODO: replace — a live project whose code is private, so it has no GitHub link.',
    image: '/projects/example-client.png',
    tech: ['laravel', 'blade', 'mysql'],
    liveUrl: 'https://example.org',
    status: 'in production',
    featured: false,
  },
  {
    title: 'Example Demo Project',
    description: 'TODO: replace — a project without a live link or screenshot, to show the fallbacks.',
    tech: ['react', 'tailwind'],
    githubUrl: 'https://github.com/TODO-replace/example-demo',
    status: 'demo',
    featured: false,
  },
]

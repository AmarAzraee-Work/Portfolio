export const about = {
  eyebrow: 'About me',
  heading: 'I like making things work, and look good doing it.',
  paragraphs: [
    'I started out tinkering with websites and never stopped. Today I work across the whole stack: Laravel and React for apps, WordPress when a client wants to edit content themselves, and Hostinger, Netlify or my own Synology server to ship it.',
    'I also do design and social media, so I care about how a page reads and feels, not only how it runs. Everything I build is responsive, from a small phone to a wide desktop.',
  ],
  // icon: a Phosphor icon name, mapped to the component in the About face.
  groups: [
    { icon: 'Code', label: 'Build', variant: 'accent', tags: ['Laravel', 'React', 'JavaScript', 'HTML', 'CSS', 'WordPress'] },
    { icon: 'GitBranch', label: 'Workflow', variant: 'neutral', tags: ['Git', 'GitHub', 'Claude Code', 'ChatGPT'] },
    { icon: 'CloudArrowUp', label: 'Hosting & servers', variant: 'neutral', tags: ['Hostinger', 'Netlify', 'Synology', 'Plex'] },
    {
      icon: 'Palette',
      label: 'Design & content',
      variant: 'neutral',
      tags: ['Canva', 'Adobe', 'Social media management'],
      outline: ['Responsive design'],
    },
  ],
}

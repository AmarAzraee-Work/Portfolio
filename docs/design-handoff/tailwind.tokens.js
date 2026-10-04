// Design tokens mapped for Tailwind. Use in tailwind.config.js:
//   import tokens from './tailwind.tokens.js'
//   export default { content: ['./index.html','./src/**/*.{js,jsx}'], theme: { extend: tokens }, plugins: [] }
// (Tailwind v4: copy these into an @theme block in index.css instead.)
export default {
  colors: {
    bg: '#0b0d0e',              // page background
    surface: '#151a1c',         // tiles, cards, form panel
    'surface-raised': '#1b2124',// hover, browser bar, mobile menu
    border: '#1f2528',          // decorative hairlines only
    'border-input': '#66727a',  // input + secondary button borders (3:1+)
    text: '#c9d1d6',            // body copy
    heading: '#f1f5f7',         // headings, names
    muted: '#8a959c',           // dates, labels, captions
    accent: '#4ade80',          // THE only accent
    'on-accent': '#0b0d0e',     // text on green fills
    'accent-soft': '#10251a',   // Live badge / Open-to-work bg
    'neutral-soft': '#232a2e',  // tags / Demo badge bg
    danger: '#fca5a5',          // form errors only
  },
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  },
  fontSize: {
    display: ['56px', { lineHeight: '60px', letterSpacing: '-0.025em', fontWeight: '600' }],
    'display-sm': ['36px', { lineHeight: '40px', letterSpacing: '-0.025em', fontWeight: '600' }],
    h2: ['36px', { lineHeight: '42px', letterSpacing: '-0.02em', fontWeight: '600' }],
    'h2-sm': ['28px', { lineHeight: '34px', letterSpacing: '-0.02em', fontWeight: '600' }],
    h3: ['24px', { lineHeight: '30px', letterSpacing: '-0.01em', fontWeight: '600' }],
    'h3-lg': ['32px', { lineHeight: '38px', letterSpacing: '-0.01em', fontWeight: '600' }],
    lead: ['20px', { lineHeight: '30px' }],
    body: ['16px', { lineHeight: '26px' }],
    small: ['14px', { lineHeight: '22px' }],
    button: ['15px', { lineHeight: '20px', fontWeight: '600' }],
    label: ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }], // mono, uppercase
    tag: ['12px', { lineHeight: '20px' }],                                              // mono
    stat: ['48px', { lineHeight: '52px', letterSpacing: '-0.02em', fontWeight: '500' }], // mono
  },
  spacing: { 'space-1': '4px', 'space-2': '8px', 'space-3': '12px', 'space-4': '16px', 'space-6': '24px', 'space-8': '32px', 'space-12': '48px', 'space-24': '96px', nav: '64px' },
  borderRadius: { sm: '6px', md: '10px', lg: '16px', full: '999px' },
  boxShadow: {
    focus: '0 0 0 2px #0b0d0e, 0 0 0 4px #4ade80',
    'phone-lift': '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
  },
  maxWidth: { content: '1200px' },
};

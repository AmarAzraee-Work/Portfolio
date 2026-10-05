// Each screen id has a mock-up in src/screens/. Add `image: '/images/<file>.png'` to a screen
// to show a real screenshot instead.
export const projects = [
  {
    id: 'timetable',
    title: 'Staff Timetable System',
    stack: 'Laravel · MySQL · Blade',
    role: 'Design and full-stack build',
    short: 'Plan weekly shifts, track hours and handle leave in one place.',
    desc: 'An internal tool that replaced a shared spreadsheet. Managers drag staff into shifts, see who is over or under hours, and approve leave requests. Staff get their own timetable on their phone.',
    tags: ['Laravel', 'MySQL', 'Role-based access', 'Responsive'],
    screens: [
      { id: 'tt-week', label: 'Weekly timetable' },
      { id: 'tt-staff', label: 'Staff directory' },
    ],
  },
  {
    id: 'sales',
    title: 'Sales Page & Admin Panel',
    stack: 'Laravel · React',
    role: 'Full-stack build and copy',
    short: 'A product sales page that sends orders to WhatsApp, plus an admin to track them.',
    desc: 'A single-product sales page built to convert on mobile. Orders go straight to WhatsApp, and the admin panel shows revenue, order status and best-selling products.',
    tags: ['Laravel API', 'React', 'WhatsApp ordering', 'Charts'],
    screens: [
      { id: 'sales-landing', label: 'Sales page' },
      { id: 'sales-admin', label: 'Admin dashboard' },
    ],
  },
  {
    id: 'resto',
    title: 'Restaurant Menu & Landing',
    stack: 'HTML · CSS · JavaScript',
    role: 'Design and front end',
    short: 'A demo restaurant site with reservations and a digital table menu.',
    desc: 'A demo for restaurants: a landing page with opening hours and table booking, and a QR digital menu where diners add dishes and send the order to the kitchen.',
    tags: ['HTML', 'CSS', 'Vanilla JS', 'QR menu'],
    screens: [
      { id: 'resto-landing', label: 'Landing page' },
      { id: 'resto-menu', label: 'Digital menu' },
    ],
  },
]

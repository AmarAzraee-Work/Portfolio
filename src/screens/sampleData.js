// Sample data shown inside the project screen mock-ups (from ProjectScreen.dc.html).

const initials = (name) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

// Shift pattern per day, Mon–Sun: M morning, E evening, O off, L leave.
const staff = [
  ['Aisyah Rahman', 'Supervisor', 'MMMMMOO'],
  ['Daniel Lim', 'Barista', 'EEOMMME'],
  ['Kavitha Nair', 'Cashier', 'MMOOEEM'],
  ['Faizal Hakim', 'Kitchen', 'OEEEEMO'],
  ['Nurul Izzah', 'Cashier', 'LLLLLOO'],
  ['Jason Tan', 'Kitchen', 'MOMEEOE'],
  ['Hafiz Roslan', 'Barista', 'EMMOOEE'],
]

export const rows = staff.map(([name, role, pattern]) => {
  const days = [...pattern].map((c) => ({ m: c === 'M', e: c === 'E', o: c === 'O', l: c === 'L' }))
  return {
    name,
    role,
    ini: initials(name),
    days,
    tue: days[1],
    hrs: [...pattern].filter((c) => c === 'M' || c === 'E').length * 8,
  }
})

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({
  d,
  n: 5 + i,
  on: i === 1,
  off: i !== 1,
}))

export const staffTable = [
  ['Aisyah Rahman', 'Front of house', 'Supervisor', 40],
  ['Daniel Lim', 'Front of house', 'Barista', 40],
  ['Kavitha Nair', 'Front of house', 'Cashier', 32],
  ['Faizal Hakim', 'Kitchen', 'Cook', 40],
  ['Nurul Izzah', 'Front of house', 'Cashier', 0, 1],
  ['Jason Tan', 'Kitchen', 'Cook', 40],
  ['Hafiz Roslan', 'Front of house', 'Barista', 40],
  ['Sarah Mokhtar', 'Management', 'Manager', 45, 1],
].map(([name, dept, role, hrs, leave]) => ({ name, dept, role, hrs, ini: initials(name), leave: !!leave, active: !leave }))

export const kpis = [
  { l: 'Revenue', v: 'RM 18,420', d: '+12% vs last month' },
  { l: 'Orders', v: '472', d: '+8%' },
  { l: 'Avg. order', v: 'RM 39.03', d: '+3%' },
  { l: 'New customers', v: '138', d: '+21%' },
]

export const bars = [42, 55, 48, 62, 58, 71, 66, 52, 60, 78, 74, 85, 80, 92].map((h) => ({ h }))

export const orders = [
  { id: '#1042', c: 'Siti Aminah', i: '2× Kopi Pagi 500g', t: 'RM 78.00', s: 'Paid' },
  { id: '#1041', c: 'Raj Kumar', i: '1× Kopi Pagi 1kg', t: 'RM 72.00', s: 'Shipped' },
  { id: '#1040', c: 'Lee Mei Ling', i: '1× Gift set', t: 'RM 95.00', s: 'Pending' },
]

export const dishes = [
  { n: 'Nasi Lemak Berempah', p: 'RM 16' },
  { n: 'Mee Rebus Tulang', p: 'RM 14' },
  { n: 'Ikan Bakar Cili', p: 'RM 28' },
]

export const menu = [
  { n: 'Nasi Lemak Berempah', d: 'Spiced fried chicken, sambal, egg, peanuts', p: 'RM 16.00' },
  { n: 'Nasi Kerabu', d: 'Blue rice, herbs, salted egg, fish crackers', p: 'RM 15.00' },
  { n: 'Nasi Goreng Kampung', d: 'Fried rice with anchovies and kangkung', p: 'RM 12.00' },
  { n: 'Nasi Ayam Penyet', d: 'Smashed chicken, tempe, chilli sambal', p: 'RM 17.00' },
  { n: 'Nasi Daging Salai', d: 'Smoked beef in cili api gravy', p: 'RM 22.00' },
]

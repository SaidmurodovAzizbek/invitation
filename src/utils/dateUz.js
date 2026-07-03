// Uzbek date helpers
export const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
]

// index matches Date.getDay() (0 = Sunday)
export const WEEKDAYS_UZ = [
  'yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba',
]

export const WEEK_HEAD_UZ = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sh', 'Ya']

export function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function isSameDay(a, b) {
  return (
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// "12-iyul, yakshanba"
export function formatUzDate(d) {
  if (!d) return ''
  return `${d.getDate()}-${MONTHS_UZ[d.getMonth()].toLowerCase()}, ${WEEKDAYS_UZ[d.getDay()]}`
}

// current time as "HH:MM" for comparisons
export function nowHHMM() {
  const n = new Date()
  return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`
}

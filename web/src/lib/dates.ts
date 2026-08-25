const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function parseISO(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDayMonth(dateStr: string): string {
  const d = parseISO(dateStr)
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]}`
}

export function formatWeekday(dateStr: string): string {
  return WEEKDAYS[parseISO(dateStr).getDay()]
}

export function formatRange(startStr: string, endStr: string): string {
  return `${formatDayMonth(startStr)} → ${formatDayMonth(endStr)}`
}

export function daysBetween(fromStr: string, toStr: string): number {
  const from = parseISO(fromStr)
  const to = parseISO(toStr)
  const ms = to.setHours(0, 0, 0, 0) - from.setHours(0, 0, 0, 0)
  return Math.round(ms / 86400000)
}

export function daysUntil(dateStr: string): number {
  return daysBetween(todayISO(), dateStr)
}

export function isSameOrAfterToday(dateStr: string): boolean {
  return dateStr >= todayISO()
}

export function dateRangeDays(startStr: string, endStr: string): string[] {
  const days: string[] = []
  const start = parseISO(startStr)
  const end = parseISO(endStr)
  const cursor = new Date(start)
  while (cursor <= end) {
    days.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

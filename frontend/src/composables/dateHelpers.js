import moment from 'moment-hijri'

export function toGregorian(date) {
  if (!date) return ''
  const year = Number(date.split('-')[0])
  if (year < 1700) {
    return moment(date, 'iYYYY-iMM-iDD').locale('en').format('YYYY-MM-DD')
  }
  return date
}

export function addYear(date) {
  const d = new Date(toGregorian(date))
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

export function getExpiration(issueDate, currentExpiration) {
  if (issueDate && !currentExpiration) {
    return addYear(issueDate)
  }
  return currentExpiration || ''
}

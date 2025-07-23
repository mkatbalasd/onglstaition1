export function addYear(date) {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

export function getExpiration(issueDate, currentExpiration) {
  if (issueDate && !currentExpiration) {
    return addYear(issueDate)
  }
  return currentExpiration || ''
}

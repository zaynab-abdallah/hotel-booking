export function nightsBetween(start, end) {
  const a = new Date(start)
  const b = new Date(end)
  const diff = (b - a) / (1000 * 60 * 60 * 24)
  return Math.max(0, Math.round(diff))
}

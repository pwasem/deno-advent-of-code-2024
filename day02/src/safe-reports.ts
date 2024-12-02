import parseReports from '@/parse-reports'

export function safeReport(levels: number[]) {
  let safe = true

  let [previous, current] = levels
  let previousTrend = previous > current

  let index = 1
  while (index < levels.length) {
    const current = levels[index]
    const currentTrend = previous > current

    if (currentTrend !== previousTrend) {
      safe = false
      break
    }

    const difference = Math.abs(previous - current)

    if (difference < 1 || difference > 3) {
      safe = false
      break
    }

    previous = current
    previousTrend = currentTrend

    index++
  }

  return safe
}

export default async function safeReports(path: string, seperator: string) {
  const reports = await parseReports(path, seperator)

  let safeReports = 0

  for (const levels of reports) {
    const safe = safeReport(levels)

    if (safe) {
      safeReports++
    }
  }

  return safeReports
}

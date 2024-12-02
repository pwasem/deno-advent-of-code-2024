import parseReports from '@/parse-reports'
import { safeReport } from '@/safe-reports'

export function dampen(levels: number[]) {
  const dampenedLevels = [
    levels,
  ]

  for (let index = 0; index < levels.length; index++) {
    dampenedLevels.push(levels.toSpliced(index, 1))
  }

  return dampenedLevels
}

export default async function problemDampener(path: string, seperator: string) {
  const reports = await parseReports(path, seperator)

  let safeReports = 0

  for (const levels of reports) {
    const dampenedLevels = dampen(levels)

    const safe = dampenedLevels.some((dl) => safeReport(dl))

    if (safe) {
      safeReports++
    }
  }

  return safeReports
}

export default async function parsePairs(path: string, seperator: string) {
  const text = await Deno.readTextFile(path)
  const lines = text.trim().split('\n')
  const reports = lines.map((line) =>
    line.split(seperator).map((level) => parseInt(level))
  )
  return reports
}

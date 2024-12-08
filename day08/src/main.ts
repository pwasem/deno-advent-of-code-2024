import { parseArgs } from '@std/cli'

interface Args {
  path: string
}

type Point = [number, number]

type Grid = {
  size: Point
  antennas: Map<string, Point[]>
}

async function readGrid(path: string) {
  const text = await Deno.readTextFile(path)
  const lines = text.trim().split('\n')
  const size = [lines.length, lines[0].length]
  const antennas = lines.reduce((map, line, i) => {
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '.') {
        continue
      }
      if (!map.has(char)) {
        map.set(char, [])
      }
      map.get(char)!.push([i, j])
    }
    return map
  }, new Map<string, Point[]>())

  return {
    size,
    antennas,
  } as Grid
}

if (import.meta.main) {
  const {
    path,
  } = parseArgs(Deno.args) as Args

  const grid = await readGrid(path)

  console.log({ grid })
}

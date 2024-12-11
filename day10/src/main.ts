import { parseArgs } from '@std/cli'

interface Args {
  path: string
}

type Point = [number, number]

type Map = Point[]

type Trail = (Point | Trail)[]

type Trails = Trail[]

async function readMap(path: string) {
  const text = await Deno.readTextFile(path)
  const map: Map = []
  for (const line of text.trim().split('\n')) {
    const heights = line.split('').map((l) => parseInt(l)) as Point
    map.push(heights)
  }
  return map
}

function findPoints(map: Map, height: number) {
  const points: Point[] = []
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === height) {
        points.push([i, j])
      }
    }
  }
  return points
}

function findUphillPoints(map: Map, start: Point) {
  const points: Point[] = []

  const [i, j] = start

  const height = map[i][j]

  const uphillHeight = height + 1

  const up = i - 1
  if (up >= 0 && map[up][j] === uphillHeight) {
    points.push([up, j])
  }

  const right = j + 1
  if (right < map[i].length && map[i][right] === uphillHeight) {
    points.push([i, right])
  }

  const down = i + 1
  if (down < map.length && map[down][j] === uphillHeight) {
    points.push([down, j])
  }

  const left = j - 1
  if (left >= 0 && map[i][left] === uphillHeight) {
    points.push([i, left])
  }

  return points
}

function findTrails(map: Map, trailhead: Point): Trails {
  const [i, j] = trailhead
  const height = map[i][j]

  if (height === 9) {
    return [[trailhead]]
  }

  const uphillPoints = findUphillPoints(map, trailhead)

  return uphillPoints.map((point) => {
    return [
      trailhead,
      ...findTrails(map, point),
    ]
  })
}

if (import.meta.main) {
  const {
    path,
  } = parseArgs(Deno.args, {
    default: {
      path: '../data/sample.txt',
    },
  }) as Args

  const map = await readMap(path)

  const trailheads = findPoints(map, 0)
  const trails = findTrails(map, trailheads[0])
  console.log({ trails })
}

import { parseArgs } from '@std/cli'

interface Args {
  path: string
}

type Coords = [number, number]

interface Guard {
  visited: Coords[]
}

enum Position {
  Empty,
  Blocked,
  Guard_Up,
  Guard_Right,
  Guard_Down,
  Guard_Left,
}

type Map = Position[][]

interface State {
  map: Map
  guard: Guard
}

class BoundaryError extends Error {
  constructor(coords: Coords, details?: never) {
    super(`Boundary error: ${coords}`, details)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

async function readInitialState(path: string) {
  const text = await Deno.readTextFile(path)

  const rows = text.trim().split('\n')

  const guard: Guard = {
    visited: [],
  }

  const map: Map = rows.map((row, r) => {
    return [...row.trim()].map((col, c) => {
      switch (col) {
        case '.': {
          return Position.Empty
        }
        case '#': {
          return Position.Blocked
        }
        case '^': {
          guard.visited.push([r, c])
          return Position.Guard_Up
        }
        default: {
          throw new Error(`Invalid: ${col}`)
        }
      }
    })
  })

  return {
    map,
    guard,
  } as State
}

function turnGuardRight({ map, guard }: State) {
  const [row, col] = guard.visited[guard.visited.length - 1]
  const oldPosition = map[row][col]
  const newPosition = oldPosition === Position.Guard_Left
    ? Position.Guard_Up
    : oldPosition + 1
  map[row][col] = newPosition
}

function moveGuardUp({ map, guard }: State) {
  const [row, col] = guard.visited[guard.visited.length - 1]
  if (row === 0) {
    throw new BoundaryError([row, col])
  }
  const rowUp = row - 1
  if (map[rowUp][col] === Position.Blocked) {
    return turnGuardRight({ map, guard })
  }
  map[rowUp][col] = map[row][col]
  map[row][col] = Position.Empty
  guard.visited.push([rowUp, col])
}

function moveGuardRight({ map, guard }: State) {
  const [row, col] = guard.visited[guard.visited.length - 1]
  if (col === map[row].length - 1) {
    throw new BoundaryError([row, col])
  }
  const colRight = col + 1
  if (map[row][colRight] === Position.Blocked) {
    return turnGuardRight({ map, guard })
  }
  map[row][colRight] = map[row][col]
  map[row][col] = Position.Empty
  guard.visited.push([row, colRight])
}

function moveGuardDown({ map, guard }: State) {
  const [row, col] = guard.visited[guard.visited.length - 1]
  if (row === map.length - 1) {
    throw new BoundaryError([row, col])
  }
  const rowDown = row + 1
  if (map[rowDown][col] === Position.Blocked) {
    return turnGuardRight({ map, guard })
  }
  map[rowDown][col] = map[row][col]
  map[row][col] = Position.Empty
  guard.visited.push([rowDown, col])
}

function moveGuardLeft({ map, guard }: State) {
  const [row, col] = guard.visited[guard.visited.length - 1]
  if (col === 0) {
    throw new BoundaryError([row, col])
  }
  const colLeft = col - 1
  if (map[row][colLeft] === Position.Blocked) {
    return turnGuardRight({ map, guard })
  }
  map[row][colLeft] = map[row][col]
  map[row][col] = Position.Empty
  guard.visited.push([row, colLeft])
}

function moveGuard({ map, guard }: State) {
  const [row, col] = guard.visited[guard.visited.length - 1]
  const position = map[row][col]
  switch (position) {
    case Position.Guard_Up:
      return moveGuardUp({ map, guard })
    case Position.Guard_Right:
      return moveGuardRight({ map, guard })
    case Position.Guard_Down:
      return moveGuardDown({ map, guard })
    case Position.Guard_Left:
      return moveGuardLeft({ map, guard })
    default:
      throw new Error(`Invalid position: ${position} at ${[row, col]}`)
  }
}

if (import.meta.main) {
  const {
    path,
  } = parseArgs(Deno.args) as Args

  const state = await readInitialState(path)

  let error: Error | null = null

  while (error === null) {
    try {
      moveGuard(state)
    } catch (err) {
      console.error(err)
      error = err as Error
    }
  }

  console.log(
    'Guard visited',
    new Set(
      state.guard.visited.map((coords) => coords.toString()),
    ).size,
    'positions',
  )
}

import { parseArgs } from '@std/cli'

interface Args {
  path: string
  blinks: number
}

type Stone = number

type Arrangement = Stone[]

async function readInitialArrangement(path: string) {
  const text = await Deno.readTextFile(path)
  const arrangement: Arrangement = text.trim().split(' ').map((t) =>
    parseInt(t)
  )
  return arrangement
}

function blink(arrangement: Arrangement) {
  const rearrangement: Arrangement = []

  for (const stone of arrangement) {
    if (stone === 0) {
      rearrangement.push(1)
    } else if (stone.toString().length % 2 === 0) {
      const str = stone.toString()

      const middle = Math.floor(str.length / 2)
      const left = str.substring(0, middle)
      const right = str.substring(middle)

      rearrangement.push(parseInt(left), parseInt(right))
    } else {
      rearrangement.push(stone * 2024)
    }
  }

  return rearrangement
}

if (import.meta.main) {
  const {
    path,
    blinks,
  } = parseArgs(Deno.args, {
    default: {
      path: '../data/sample.txt',
      blinks: 1,
    },
  }) as Args

  let arrangement = await readInitialArrangement(path)

  for (let times = 0; times < blinks; times++) {
    arrangement = blink(arrangement)
  }

  console.log('Stones', '#', arrangement.length)
}

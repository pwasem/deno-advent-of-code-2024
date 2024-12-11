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
  const rearranged: Arrangement = []

  for (const stone of arrangement) {
    const str = stone.toString()

    if (stone === 0) {
      rearranged.push(1)
    } else if (str.length % 2 === 0) {
      const middle = Math.floor(str.length / 2)
      const left = str.substring(0, middle)
      const right = str.substring(middle)
      rearranged.push(parseInt(left), parseInt(right))
    } else {
      rearranged.push(stone * 2024)
    }
  }

  return rearranged
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

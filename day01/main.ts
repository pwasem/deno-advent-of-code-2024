import { parseArgs } from '@std/cli'
import totalDistance from '@/total-distance'
import similarityScore from '@/similarity-score'

interface Args {
  help: boolean
  task: string
  path: string
  seperator: string
}

const {
  help,
  task,
  path,
  seperator,
} = parseArgs(Deno.args, {
  alias: {
    help: 'h',
    task: 't',
    path: 'p',
    seperator: 's',
  },
  default: {
    seperator: '   ',
  },
}) as Args

if (help) {
  console.log(`
    Usage: deno task start --task <totalDistance|similarityScore> --path <path/to/input/data>
  `)
  Deno.exit(0)
}

switch (task) {
  case 'totalDistance': {
    const result = await totalDistance(path, seperator)
    console.log('Total distance', result)
    break
  }
  case 'similarityScore': {
    const result = await similarityScore(path, seperator)
    console.log('Similarity score', result)
    break
  }
}

import { parseArgs } from '@std/cli/'
import totalDistance from '@/total-distance'
import similarityScore from '@/similarity-score'

interface Args {
  task: string
  path: string
  seperator: string
}

const {
  task,
  path,
  seperator = '   ',
} = parseArgs<Args>(Deno.args)

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

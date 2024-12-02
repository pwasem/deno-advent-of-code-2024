import { parseArgs } from '@std/cli/'
import safeReports from '@/safe-reports'
import problemDampener from '@/problem-dampener'

interface Args {
  task: string
  path: string
  seperator: string
}

const {
  task,
  path,
  seperator = ' ',
} = parseArgs<Args>(Deno.args)

switch (task) {
  case 'safeReports': {
    const result = await safeReports(path, seperator)
    console.log('Safe Reports', result)
    break
  }
  case 'problemDampener': {
    const result = await problemDampener(path, seperator)
    console.log('Safe Reports w/ problem dampener', result)
    break
  }
}

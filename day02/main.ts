import { parseArgs } from '@std/cli'
import safeReports from '@/safe-reports'
import problemDampener from '@/problem-dampener'

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
    seperator: ' ',
  },
}) as Args

if (help) {
  console.log(`
    Usage: deno task start --task <safeReports|problemDampener> --path <path/to/input/data>
  `)
  Deno.exit(0)
}

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

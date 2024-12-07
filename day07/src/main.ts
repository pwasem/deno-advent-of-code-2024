import { parseArgs } from '@std/cli'

interface Args {
  path: string
}

function compute(operands: number[]): number[] {
  if (operands.length < 2) {
    return operands
  }

  const [a, b, ...rest] = operands

  return [
    compute([a + b, ...rest]),
    compute([a * b, ...rest]),
    compute([parseInt(`${a}${b}`), ...rest]),
  ].flat()
}

async function readEquations(path: string) {
  const text = await Deno.readTextFile(path)
  const rows = text.trim().split('\n')
  return rows.map((row) => {
    const [
      result,
      operands,
    ] = row.trim().split(':')
    const equations = [
      result,
      ...operands.trim().split(' '),
    ].map((s) => parseInt(s))
    return equations
  })
}

if (import.meta.main) {
  const {
    path,
  } = parseArgs(Deno.args) as Args

  const equations = await readEquations(path)

  const totalCalibrationResult = equations
    .filter(([result, ...operands]) => {
      return compute(operands).some((solution) => solution === result)
    })
    .reduce((total, [result]) => {
      return total + result
    }, 0)

  console.log({ totalCalibrationResult })
}

import { parseArgs } from '@std/cli'

export interface Args {
  part: number
  path: string
}

export const MUL_REG_EXP = /mul\((\d*),(\d*)\)/
export const MUL_REG_EXP_GLOBAL = new RegExp(MUL_REG_EXP.source, 'g')
export const DO_REG_EXP = /do\(\)/
export const DONT_REG_EXP = /don't\(\)/

export async function part1(path: string) {
  const memory = await Deno.readTextFile(path)
  const result = memory.matchAll(MUL_REG_EXP_GLOBAL).reduce((acc, match) => {
    const [, a, b] = match
    return acc + parseInt(a) * parseInt(b)
  }, 0)
  return result
}

export async function part2(path: string) {
  const memory = await Deno.readTextFile(path)

  let word = ''
  let enabled = true
  let result = 0

  // REVISE: implement proper lexer ;)
  for (const char of memory) {
    word += char

    if (DO_REG_EXP.test(word)) {
      enabled = true
      word = ''
      continue
    }

    if (enabled && MUL_REG_EXP.test(word)) {
      const [, a, b] = [...word.match(MUL_REG_EXP)!]
      result += parseInt(a) * parseInt(b)
      word = ''
      continue
    }

    if (DONT_REG_EXP.test(word)) {
      enabled = false
      word = ''
      continue
    }
  }

  return result
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const {
    part,
    path,
  } = parseArgs(Deno.args) as Args

  switch (part) {
    case 1: {
      const result = await part1(path)
      console.log('Result', result)
      break
    }
    case 2: {
      const result = await part2(path)
      console.log('Result', result)
      break
    }
  }
}

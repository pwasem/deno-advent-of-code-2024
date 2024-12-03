import { parseArgs } from '@std/cli'

export interface Args {
  part: number
  path: string
}

export const MUL_REG_EXP_GLOBAL = /mul\((\d*),(\d*)\)/g
export const MUL_REG_EXP = /mul\((\d*),(\d*)\)/
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
  // REVISE: implement proper lexer ;)
  let word = ''
  let enabled = true
  let result = 0
  for (const char of memory) {
    word += char
    if (DO_REG_EXP.test(word)) {
      enabled = true
      word = ''
    } else if (DONT_REG_EXP.test(word)) {
      enabled = false
      word = ''
    } else if (MUL_REG_EXP.test(word)) {
      if (enabled) {
        const [, a, b] = [...word.match(MUL_REG_EXP)!]
        result += parseInt(a) * parseInt(b)
        word = ''
      }
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

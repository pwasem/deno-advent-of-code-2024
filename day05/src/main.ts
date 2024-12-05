import { parseArgs } from '@std/cli'

export type Rule = number[]
export type Update = number[]

export interface Args {
  path: string
}

// part 1

export async function readData(path: string): Promise<[string, string]> {
  const data = await Deno.readTextFile(path)

  const [
    rulesData,
    updatesData,
  ] = data.trim().split('\n\n')

  return [
    rulesData,
    updatesData,
  ]
}

export function parseRules(rulesData: string): Rule[] {
  const rules = rulesData.trim().split('\n').reduce((acc, rule) => {
    const [before, after] = rule.split('|').map((r) => parseInt(r))
    acc.push([before, after])
    return acc
  }, [] as Rule[])
  return rules
}

export function parseUpdates(updatesData: string): Update[] {
  const updates = updatesData.trim().split('\n').map((update) => {
    return update.split(',').map((u) => parseInt(u))
  })
  return updates
}

export function checkUpdate(
  rules: Rule[],
  update: Update,
): boolean {
  const correct = update.every((page, index) => {
    // REVISE: what if there are no page rules
    const pageRules = rules.filter(([before]) => page === before)
    const nextPages = update.slice(index + 1)
    return nextPages.every((nextPage) => {
      return pageRules.some(([, next]) => next === nextPage)
    })
  })

  return correct
}

export function checkUpdates(
  rules: Rule[],
  updates: Update[],
): [Update[], Update[]] {
  const correctUpdates: Update[] = []
  const incorrectUpdates: Update[] = []

  for (const update of updates) {
    const correct = update.every((page, index) => {
      // REVISE: what if there are no page rules
      const pageRules = rules.filter(([before]) => page === before)
      const nextPages = update.slice(index + 1)
      return nextPages.every((nextPage) => {
        return pageRules.some(([, next]) => next === nextPage)
      })
    })

    if (correct) {
      correctUpdates.push(update)
    } else {
      incorrectUpdates.push(update)
    }
  }

  return [
    correctUpdates,
    incorrectUpdates,
  ]
}

export function computeMiddleSum(updates: Update[]): number {
  const sum = updates.reduce((acc, update) => {
    const middleIndex = Math.floor(update.length / 2)
    return acc + update[middleIndex]
  }, 0)
  return sum
}

// part 2

// REVISE: sth. still wrong here
export function orderUpdate(rules: Rule[], update: Update) {
  for (const page of update) {
    const pageRules = rules.filter(([before]) => page === before)

    if (pageRules.length === 0) {
      continue
    }

    // remove element from old index
    const oldIndex = update.indexOf(page)
    update.splice(oldIndex, 1)

    // get new 'lowest' insert index
    const newIndex = pageRules.reduce((index, [, after]) => {
      const nextIndex = update.indexOf(after)
      return Math.min(index, nextIndex)
    }, update.length)

    // insert element at new index
    update.splice(newIndex, 0, page)
  }

  return update
}

export function orderUpdates(rules: Rule[], updates: Update[]): Update[] {
  return updates.map((update) =>
    orderUpdate(
      rules.filter(([before, after]) =>
        update.includes(before) && update.includes(after)
      ),
      update,
    )
  )
}

// main

if (import.meta.main) {
  const {
    path,
  } = parseArgs(Deno.args) as Args
  const [
    rulesData,
    updatesData,
  ] = await readData(path)

  const [
    rules,
    updates,
  ] = [
    parseRules(rulesData),
    parseUpdates(updatesData),
  ]

  const [
    correctUpdates,
    incorrectUpdates,
  ] = checkUpdates(rules, updates)

  // part 1
  const correctMiddleSum = computeMiddleSum(correctUpdates)
  console.log('Correct Updates - Middle Sum', correctMiddleSum)

  // part 2
  const correctedUpdates = orderUpdates(rules, incorrectUpdates)
  const correctedMiddleSum = computeMiddleSum(correctedUpdates)
  console.log('Corrected Updates - Middle Sum', correctedMiddleSum)
}

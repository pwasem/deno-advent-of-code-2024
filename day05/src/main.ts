import { parseArgs } from '@std/cli'

type Rules = number[][]
type Updates = number[][]

interface Args {
  path: string
}

async function readData(path: string): Promise<[string, string]> {
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

function parseRules(rulesData: string): Rules {
  const rules = rulesData.trim().split('\n').reduce((acc, rule) => {
    const [before, after] = rule.split('|').map((r) => parseInt(r))
    acc.push([before, after])
    return acc
  }, [] as Rules)
  return rules
}

function parseUpdates(updatesData: string): Updates {
  const updates = updatesData.trim().split('\n').map((update) => {
    return update.split(',').map((u) => parseInt(u))
  })
  return updates
}

function filterUpdates(
  rules: Rules,
  updates: Updates,
) {
  return updates.filter((update) => {
    return update.every((page, index) => {
      // REVISE: what if there are no page rules
      const pageRules = rules.filter(([before]) => page === before)
      const nextPages = update.slice(index + 1)
      return nextPages.every((nextPage) => {
        return pageRules.some(([, next]) => next === nextPage)
      })
    })
  })
}

function computeMiddleSume(updates: Updates) {
  const sum = updates.reduce((acc, update) => {
    const middleIndex = Math.floor(update.length / 2)
    return acc + update[middleIndex]
  }, 0)
  return sum
}

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

  const correctUpdates = filterUpdates(rules, updates)

  const middleSum = computeMiddleSume(correctUpdates)

  console.log('Middle Sum', middleSum)
}

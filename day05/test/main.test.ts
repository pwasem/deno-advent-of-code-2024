import { assertEquals } from '@std/assert'
import { orderUpdate, type Rule, type Update } from '@/main'

Deno.test('orderUpdate', () => {
  const update: Update = [
    84,
    65,
    34,
    38,
    25,
  ]

  const rules: Rule[] = [
    [25, 84],
    [25, 34],
    [25, 65],
    [25, 38],
    [34, 38],
    [65, 38],
    [65, 34],
    [84, 34],
    [84, 65],
    [84, 38],
  ]

  const expectedOrdered = [
    25,
    84,
    65,
    34,
    38,
  ]

  const actualOrdered = orderUpdate(rules, update)

  assertEquals(actualOrdered, expectedOrdered)
})

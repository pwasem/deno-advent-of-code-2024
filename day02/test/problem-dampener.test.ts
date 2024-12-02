import { assertEquals } from '@std/assert'
import { join } from '@std/path'
import problemDampener from '@/problem-dampener'

Deno.test('problem-dampener', async () => {
  const path = join(import.meta.dirname!, '../data/sample.txt')
  const seperator = ' '
  const result = await problemDampener(path, seperator)
  assertEquals(result, 4)
})

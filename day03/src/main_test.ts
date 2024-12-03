import { assertEquals } from '@std/assert'
import { join } from '@std/path'
import { part1, part2 } from '@/main'

Deno.test('part1', async () => {
  const path = join(import.meta.dirname!, '../data/sample1.txt')
  const result = await part1(path)
  assertEquals(result, 161)
})

Deno.test('part2', async () => {
  const path = join(import.meta.dirname!, '../data/sample2.txt')
  const result = await part2(path)
  assertEquals(result, 48)
})

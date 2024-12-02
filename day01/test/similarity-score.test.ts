import { assertEquals } from '@std/assert'
import { join } from '@std/path'
import similarityScore from '@/similarity-score'

Deno.test('similarity-score', async () => {
  const path = join(Deno.cwd(), 'data/sample.txt')
  const seperator = '   '
  const result = await similarityScore(path, seperator)
  assertEquals(result, 31)
})

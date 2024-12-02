import { assertEquals } from '@std/assert'
import { join } from '@std/path'
import totalDistance from '@/total-distance'

Deno.test('total-distance', async () => {
  const path = join(Deno.cwd(), 'data/sample.txt')
  const seperator = '   '
  const result = await totalDistance(path, seperator)
  assertEquals(result, 11)
})

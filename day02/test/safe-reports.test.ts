import { assertEquals } from '@std/assert'
import { join } from '@std/path'
import safeReports from '@/safe-reports'

Deno.test('safe-reports', async () => {
  const path = join(Deno.cwd(), 'data/sample.txt')
  const seperator = ' '
  const result = await safeReports(path, seperator)
  assertEquals(result, 2)
})

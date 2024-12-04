import { parseArgs } from '@std/cli'

export interface Args {
  path: string
}
export async function readData(path: string) {
  const file = await Deno.readTextFile(path)

  const lines = file.trim().split('\n')

  const data: string[][] = []

  for (const line of lines) {
    data.push([...line])
  }

  return data
}

export function matchXmas(word: string) {
  const matched = [...word.matchAll(/XMAS/g)]
  const count = matched.length
  return count
}

export function searchXmasHorizontal(data: string[][]) {
  const count = data.reduce((acc, row) => {
    return acc + matchXmas(row.join('')) + matchXmas(row.reverse().join(''))
  }, 0)
  return count
}

export function searchXmasVertical(data: string[][]) {
  const columns: string[][] = []
  for (let i = 0; i < data.length; i++) {
    const column = data.map((row) => row[i])
    columns.push(column)
  }
  const count = searchXmasHorizontal(columns)
  return count
}

export function searchXmasDiagonal(data: string[][]) {
  const n = data.length

  // Arrays to hold diagonals
  const diagonalsTopLeftToBottomRight = Array.from(
    { length: 2 * n - 1 },
    () => [],
  )
  const diagonalsTopRightToBottomLeft = Array.from(
    { length: 2 * n - 1 },
    () => [],
  )

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // ↘ Diagonal (Top-left to bottom-right)
      const topLeftIndex = i - j + (n - 1)
      diagonalsTopLeftToBottomRight[topLeftIndex].push(data[i][j])

      // ↙ Diagonal (Top-right to bottom-left)
      const topRightIndex = i + j
      diagonalsTopRightToBottomLeft[topRightIndex].push(data[i][j])
    }
  }

  const diagonals = [
    ...diagonalsTopLeftToBottomRight,
    ...diagonalsTopRightToBottomLeft,
  ]

  const count = searchXmasHorizontal(diagonals)

  return count
}

export function searchXmas(data: string[][]) {
  let count = 0
  count += searchXmasHorizontal(data)
  count += searchXmasVertical(data)
  count += searchXmasDiagonal(data)
  return count
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const {
    path,
  } = parseArgs(Deno.args) as Args
  const data = await readData(path)
  const count = searchXmas(data)
  console.log('Count', count)
}

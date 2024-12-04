import { parseArgs } from '@std/cli'

interface Args {
  path: string
}

async function readData(path: string) {
  const file = await Deno.readTextFile(path)

  const lines = file.trim().split('\n')

  const data: string[][] = []

  for (const line of lines) {
    data.push([...line])
  }

  return data
}

function matchXmas(word: string) {
  const matched = [...word.matchAll(/XMAS/g)]
  const count = matched.length
  return count
}

function searchXmasHorizontal(data: string[][]) {
  const count = data.reduce((acc, row) => {
    return acc + matchXmas(row.join('')) + matchXmas(row.reverse().join(''))
  }, 0)
  return count
}

function searchXmasVertical(data: string[][]) {
  const columns: string[][] = []
  for (let i = 0; i < data.length; i++) {
    const column = data.map((row) => row[i])
    columns.push(column)
  }
  const count = searchXmasHorizontal(columns)
  return count
}

function searchXmasDiagonal(data: string[][]) {
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

function searchXmas(data: string[][]) {
  let count = 0
  count += searchXmasHorizontal(data)
  count += searchXmasVertical(data)
  count += searchXmasDiagonal(data)
  return count
}

function getMas(data: string[][], row: number, col: number) {
  let word = ''

  for (let r = row; r < row + 3; r++) {
    for (let c = col; c < col + 3; c++) {
      word += data[r]?.[c] ?? '' // REVISE: out of bounds
    }
  }

  return word
}

function matchMas(word: string) {
  const matched = word.match(/M.S.A.M.S|S.M.A.S.M|M.M.A.S.S|S.S.A.M.M/)
  const count = matched !== null ? 1 : 0
  return count
}

function searchMas(data: string[][]) {
  let count = 0
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length + 3; j++) {
      const word = getMas(data, i, j)
      count += matchMas(word)
    }
  }
  return count
}

if (import.meta.main) {
  const {
    path,
  } = parseArgs(Deno.args) as Args

  const data = await readData(path)

  const xMasCount = searchXmas(data)
  console.log('XMAS Count', xMasCount)

  const masCount = searchMas(data)
  console.log('X-MAS Count', masCount)
}

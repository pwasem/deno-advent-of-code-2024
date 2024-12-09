import { parseArgs } from '@std/cli'

interface Args {
  path: string
}

type Block = number | null
// type Blocks = Block[]

async function readBlocks(path: string) {
  const diskMap = (await Deno.readTextFile(path)).trim()

  let id = 0
  let blocks: Block[] = []

  for (let index = 0; index < diskMap.length; index++) {
    const size = parseInt(diskMap[index])
    const block = new Array(size)
    const isFile = index % 2 === 0

    if (isFile) {
      block.fill(id)
      id++
    } else { // free space
      block.fill(null)
    }

    blocks = [
      ...blocks,
      ...block,
    ]
  }

  return blocks
}

function moveBlocks(blocks: Block[]) {
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index]

    if (block !== null) {
      continue
    }

    const lastFileIndex = blocks.findLastIndex((block) => block !== null)

    if (lastFileIndex < index) {
      break
    }

    const file = blocks[lastFileIndex] as number
    blocks[index] = file
    blocks[lastFileIndex] = block
  }
}

function computeChecksum(blocks: Block[]) {
  return blocks.reduce((acc, block, index) => {
    if (block === null) {
      return acc
    }
    return acc! + index * block
  }, 0)
}

if (import.meta.main) {
  const {
    path,
  } = parseArgs(Deno.args) as Args

  const blocks = await readBlocks(path)
  moveBlocks(blocks)

  const checksum = computeChecksum(blocks)

  console.log({ checksum })
}

import { parseArgs } from '@std/cli'

interface Args {
  path: string
}

type Block = number | null

async function readDiskMap(path: string) {
  const diskMap = (await Deno.readTextFile(path)).trim()

  let id = 0
  const blocksList: Block[][] = []

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

    blocksList.push(block)
  }

  return blocksList
}

function moveBlocksRightToLeft(blocksList: Block[][]) {
  const movedBlocks = blocksList.flat()

  for (let index = 0; index < movedBlocks.length; index++) {
    const block = movedBlocks[index]

    if (block !== null) {
      continue
    }

    const lastFileIndex = movedBlocks.findLastIndex((block) => block !== null)

    if (lastFileIndex < index) {
      break
    }

    const file = movedBlocks[lastFileIndex] as number
    movedBlocks[index] = file
    movedBlocks[lastFileIndex] = block
  }

  return movedBlocks
}

// function moveBlocksLeftToRight(blocksList: Block[][]) {
//   for (let blocksIndex = 0; blocksIndex < blocksList.length; blocksIndex++) {
//     const blocks = blocksList[blocksIndex]

//     console.log({
//       blocks,
//     })

//     if (blocks[0] !== null) {
//       continue
//     }

//     const lastFileBlocksIndex = blocksList.findLastIndex((fbs) =>
//       fbs[0] !== null && fbs.length <= blocks.length
//     )

//     if (lastFileBlocksIndex < 0) {
//       continue
//     }

//     const lastFileBlock = blocksList[lastFileBlocksIndex]

//     for (
//       let fileBlockIndex = 0;
//       fileBlockIndex < lastFileBlock.length;
//       fileBlockIndex++
//     ) {
//       blocks[fileBlockIndex] = lastFileBlock[fileBlockIndex]
//       lastFileBlock[fileBlockIndex] = null
//     }
//   }

//   return blocksList.flat()
// }

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

  const blocksList = await readDiskMap(path)
  const blocks = moveBlocksRightToLeft(blocksList)
  // const blocks = moveBlocksLeftToRight(blocksList)
  console.log({
    blocks: blocks.map((b) => b === null ? '.' : b).join(''),
    // blocks,
  })
  const checksum = computeChecksum(blocks)
  console.log({ checksum })
}

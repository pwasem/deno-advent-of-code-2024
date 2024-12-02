import parsePairs from '@/parse-pairs'

export default async function similarityScore(path: string, seperator: string) {
  const [
    leftList,
    rightList,
  ] = await parsePairs(path, seperator)

  const similarityCount = new Map<number, number>()

  for (const leftID of leftList) {
    if (!similarityCount.has(leftID)) {
      similarityCount.set(leftID, 0)
    }

    let count = 0

    for (const rightID of rightList) {
      if (leftID === rightID) {
        count++
      }
    }

    similarityCount.set(leftID, similarityCount.get(leftID)! + count)
  }

  const result = similarityCount.entries().reduce(
    (similarity, [item, count]) => {
      return similarity + item * count
    },
    0,
  )

  return result
}

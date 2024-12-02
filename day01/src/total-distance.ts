import parsePairs from '@/parse-pairs'

export default async function totalDistance(path: string, seperator: string) {
  const [
    leftList,
    rightList,
  ] = await parsePairs(path, seperator)

  const [
    leftListSorted,
    rightListSorted,
  ] = [
    leftList,
    rightList,
  ].map((list) => list.toSorted())

  const pairsListSorted = leftListSorted.map((
    leftID,
    leftIndex,
  ) => [
    leftID,
    rightListSorted[leftIndex],
  ])

  const result = pairsListSorted.reduce((total, [leftID, rightID]) => {
    const distance = Math.abs(rightID - leftID)
    return total + distance
  }, 0)

  return result
}

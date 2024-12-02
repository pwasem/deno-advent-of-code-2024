export default async function parsePairs(path: string, seperator: string) {
  const data = await Deno.readTextFile(path)
  const pairs = data.trim().split('\n') as string[]

  const leftList: number[] = []
  const rightList: number[] = []

  for (const pair of pairs) {
    const [leftID, rightId] = pair.split(seperator).map((ID) => parseInt(ID))
    leftList.push(leftID)
    rightList.push(rightId)
  }

  return [
    leftList,
    rightList,
  ]
}

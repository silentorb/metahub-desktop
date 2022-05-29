export function flatten<T>(arrays: T[][]): T[] {
  const result: T[] = []
  for (const a of arrays) {
    for (const b of a) {
      result.push(b)
    }
  }
  return result
}

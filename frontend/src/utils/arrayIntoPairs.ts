/**
 * Function, which pairs the values from the indices 0 and 1, 2 and 3, ...
 */
export const arrayToPairs = <T>(array: T[]) => {
  const pairs = []

  for (let i = 0; i < array.length; i += 2) {
    pairs.push(array.slice(i, i + 2))
  }

  return pairs
}

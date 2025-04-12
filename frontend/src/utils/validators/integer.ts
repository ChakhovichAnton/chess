export const validateInteger = (input: string | undefined) => {
  if (!input) return undefined
  const parsed = parseInt(input)

  return !isNaN(parsed) && isFinite(parsed) && Number(input) === parsed
    ? parsed
    : undefined
}

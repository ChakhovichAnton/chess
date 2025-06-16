export const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00'

  const totalSeconds = Math.max(0, Math.floor(ms / 1000))

  const hours = Math.floor(totalSeconds / 3600)
  const hoursString = hours > 0 ? hours + ':' : ''

  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const minutesString = minutes !== '00' ? minutes + ':' : ''

  const seconds = String(totalSeconds % 60).padStart(2, '0')

  const tenths = String(Math.floor((ms % 1000) / 100))
  const tenthsString = minutes === '00' ? ':' + tenths : ''

  return `${hoursString}${minutesString}${seconds}${tenthsString}`
}

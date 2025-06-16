import { ChessClock } from '../../types'

export const clockIsZero = (clock: ChessClock) => {
  return clock.whiteTimeMs === 0 || clock.blackTimeMs === 0
}

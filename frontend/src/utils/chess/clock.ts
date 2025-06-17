import { ChessClock, ClockStatus } from '../../types'

export const clockIsZero = (clock: ChessClock) => {
  return clock.whiteTimeMs === 0 || clock.blackTimeMs === 0
}

export const getWhiteOrBlackCurrentTime = (
  clock: ChessClock,
): { whiteTimeMs?: number; blackTimeMs?: number } => {
  if (clock.running === ClockStatus.PAUSED) return {}

  const targetDate = new Date(clock.lastStartedAt)
  const diffMs = new Date().getTime() - targetDate.getTime()

  if (clock.running === ClockStatus.WHITE_RUNNING) {
    return { whiteTimeMs: Math.max(clock.whiteTimeMs - diffMs, 0) }
  }
  return { blackTimeMs: Math.max(clock.blackTimeMs - diffMs, 0) }
}

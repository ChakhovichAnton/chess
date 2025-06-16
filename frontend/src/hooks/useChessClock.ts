import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import {
  ChessClock,
  ChessGameHookStatus,
  ClockStatus,
  GameWithMoves,
} from '../types'
import { clockIsZero } from '../utils/chess/clock'

type SetClockStateType = {
  blackTimeMs?: number
  whiteTimeMs?: number
}

const useChessClock = (
  setGameState: Dispatch<SetStateAction<GameWithMoves | undefined>>,
  status: ChessGameHookStatus,
  onClockIsZero: () => void,
  gameState?: GameWithMoves,
) => {
  const lastRef = useRef<number>(performance.now())
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const cancelAnimation = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }

    if (
      !gameState ||
      gameState.clock.running === ClockStatus.PAUSED ||
      status !== 'live' ||
      clockIsZero(gameState.clock)
    ) {
      return cancelAnimation()
    }

    const setClockState = (f: (game: ChessClock) => SetClockStateType) => {
      setGameState((prev) => {
        if (!prev) return
        return { ...prev, clock: { ...prev.clock, ...f(prev.clock) } }
      })
    }

    const updateClock = () => {
      const now = performance.now()
      const elapsed = now - lastRef.current

      if (elapsed >= 100) {
        setClockState((prev) => {
          if (gameState.clock.running === ClockStatus.WHITE_RUNNING) {
            const whiteTimeMs = Math.max(prev.whiteTimeMs - elapsed, 0)
            if (whiteTimeMs === 0) onClockIsZero()
            return { whiteTimeMs }
          } else if (gameState.clock.running === ClockStatus.BLACK_RUNNING) {
            const blackTimeMs = Math.max(prev.blackTimeMs - elapsed, 0)
            if (blackTimeMs === 0) onClockIsZero()
            return { blackTimeMs }
          }
          return prev
        })

        lastRef.current = now
      }
      animationRef.current = requestAnimationFrame(updateClock)
    }

    lastRef.current = performance.now()
    updateClock()

    return () => cancelAnimation()
  }, [gameState, onClockIsZero, setGameState, status])
}

export default useChessClock

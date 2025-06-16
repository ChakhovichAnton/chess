import { useState, useEffect, useRef, useCallback } from 'react'
import {
  GameWithMoves,
  GameStatus,
  Move,
  User,
  FinishedGameWithMoves,
  GameEndStatus,
  ChessGameHookStatus,
  ClockStatus,
  ChessClock,
} from '../types'
import { validateChessMove } from '../utils/validators/chess'
import { isAxiosError } from 'axios'
import api from '../utils/axios'
import useWebSocket from './useWebSocket'
import { useAuth } from '../context/auth'
import { useNotification } from '../context/notification'
import useChessClock from './useChessClock'

const useChessGame = (
  onGameEnd: (game: FinishedGameWithMoves, user?: User) => void,
  gameId?: number,
) => {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [status, setStatus] = useState<ChessGameHookStatus>('loading')
  const [gameState, setGameState] = useState<GameWithMoves | undefined>(
    undefined,
  )

  const clockCheckIntervalRef = useRef<number | undefined>(undefined)
  const addNotificationRef = useRef(addNotification)
  useEffect(() => {
    addNotificationRef.current = addNotification
  }, [addNotification])

  // Additional refs to access the values in the onMessage handler
  const userRef = useRef<User | undefined>(undefined)
  const gameStateRef = useRef<GameWithMoves | undefined>(undefined)
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])
  useEffect(() => {
    userRef.current = user
  }, [user])

  const onMessage = useCallback(
    (event: MessageEvent<unknown>) => {
      const endGame = (status: GameEndStatus) => {
        setStatus('finished')
        setGameState((prev) => (prev ? { ...prev, status } : undefined))
        if (gameStateRef.current) {
          onGameEnd({ ...gameStateRef.current, status }, userRef.current)
        }
      }

      const newDrawRequest = (maker: User | null) => {
        if (maker && maker.id !== userRef.current?.id) {
          addNotificationRef.current('New draw request', 'info')
        }
      }

      if (clockCheckIntervalRef.current) {
        clearInterval(clockCheckIntervalRef.current)
      }
      const data = JSON.parse(event.data as string)

      if (data.action === 'gameState') {
        const game = data.gameState as GameWithMoves

        // Set correct clock time
        if (game.clock.running !== ClockStatus.PAUSED) {
          const targetDate = new Date(game.clock.lastStartedAt)
          const diffMs = new Date().getTime() - targetDate.getTime()

          switch (game.clock.running) {
            case ClockStatus.WHITE_RUNNING: {
              const whiteTimeMs = Math.max(game.clock.whiteTimeMs - diffMs, 0)
              game.clock.whiteTimeMs = whiteTimeMs
              break
            }
            case ClockStatus.BLACK_RUNNING: {
              const blackTimeMs = Math.max(game.clock.blackTimeMs - diffMs, 0)
              game.clock.blackTimeMs = blackTimeMs
            }
          }
        }

        setGameState(game)
        newDrawRequest(game.drawOfferUser)
        // Set page status to finished in case the game has already finished
        if (game.status !== GameStatus.ONGOING) setStatus('finished')
      } else if (data.action === 'newMove') {
        const newMove = data.newMove as Move
        const gameStatus = data.gameStatus as GameStatus

        setGameState((prev) => {
          if (!prev) return
          const moveIsValid = validateChessMove(prev.fen, newMove.moveText)

          // If move is invalid, set state to undefined
          if (!moveIsValid) {
            setStatus('error')
            return
          }

          return {
            ...prev,
            chessMoves: [...prev.chessMoves, newMove],
            fen: data.fen as string,
            clock: data.clock as ChessClock,
          } satisfies GameWithMoves
        })

        // If the game has ended
        if (gameStatus !== GameStatus.ONGOING) endGame(gameStatus)
      } else if (data.action === 'error') {
        addNotificationRef.current(data.error as string, 'error')
      } else if (data.action === 'drawOffer') {
        newDrawRequest(data.by as User)
        setGameState((prev) =>
          prev ? { ...prev, drawOfferUser: data.by } : undefined,
        )
      } else if (data.action === 'drawAccepted') {
        endGame(GameStatus.DRAW)
      } else if (data.action === 'drawOfferDeactivated') {
        setGameState((prev) =>
          prev ? { ...prev, drawOfferUser: null } : undefined,
        )
      } else if (data.action === 'surrender' || data.action === 'noTime') {
        endGame(data.gameStatus as GameStatus.BLACK_WIN | GameStatus.WHITE_WIN)
      }
    },
    [onGameEnd],
  )

  const onClose = useCallback(() => {
    setStatus('loading')
    setGameState(undefined)
  }, [])

  const onError = useCallback(() => {
    setStatus('error')
    setGameState(undefined)
  }, [])

  const { sendMessage } = useWebSocket(
    `game/${gameId}`,
    onMessage,
    status === 'live', // Connect automatically if game is live
    onClose,
    onError,
  )

  // Check if game is live or finished
  useEffect(() => {
    if (status !== 'loading') return

    const initChessGame = async () => {
      try {
        const result = await api.get(`/api/chess/game/${gameId}/`)
        const game = result.data as GameWithMoves

        if (game.status === GameStatus.ONGOING) {
          setStatus('live')
        } else {
          setStatus('finished')
          setGameState(game)
        }
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          setStatus('notFound')
        } else {
          setStatus('error')
        }
      }
    }

    initChessGame()
  }, [gameId, status])

  const clockCheck = () => sendMessage({ action: 'clockCheck' })

  // A hook which manages the chess clocks
  const onClockIsZero = () => {
    // Use set interval in-case the clock is slightly in advance
    clockCheckIntervalRef.current = setInterval(clockCheck, 100)
  }
  useChessClock(setGameState, status, onClockIsZero, gameState)

  const makeMove = (move: string) => {
    sendMessage({ action: 'move', move })
  }

  const drawAction = () => {
    setGameState((prev) => {
      if (!prev) return
      const drawOfferUser = prev.drawOfferUser ? null : userRef.current
      return { ...prev, drawOfferUser: drawOfferUser ?? null }
    })
    sendMessage({ action: 'draw' })
  }

  const surrender = () => {
    sendMessage({ action: 'surrender' })
  }

  return { gameState, makeMove, status, drawAction, surrender }
}

export default useChessGame

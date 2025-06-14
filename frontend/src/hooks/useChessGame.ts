import { useState, useEffect, useRef, useCallback } from 'react'
import {
  GameWithMoves,
  GameStatus,
  Move,
  User,
  FinishedGameWithMoves,
  GameEndStatus,
} from '../types'
import { validateChessMove } from '../utils/validators/chess'
import { isAxiosError } from 'axios'
import api from '../utils/axios'
import useWebSocket from './useWebSocket'
import { useAuth } from '../context/auth'
import { useNotification } from '../context/notification'

type Status = 'loading' | 'live' | 'finished' | 'error' | 'notFound'

const useChessGame = (
  onGameEnd: (game: FinishedGameWithMoves, user?: User) => void,
  gameId?: number,
) => {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const [status, setStatus] = useState<Status>('loading')
  const [gameState, setGameState] = useState<GameWithMoves | undefined>(
    undefined,
  )

  // Undefined means that there is no draw request
  const [drawRequest, setDrawRequest] = useState<User | undefined>(undefined)

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
        if (maker) {
          setDrawRequest(maker)
          if (maker.id !== userRef.current?.id) {
            addNotification('New draw request', 'info')
          }
        }
      }

      const data = JSON.parse(event.data as string)

      if (data.action === 'gameState') {
        const game = data.gameState as GameWithMoves
        setGameState(game)
        newDrawRequest(game.drawOfferUser)
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
          } satisfies GameWithMoves
        })

        // If the game has ended
        if (gameStatus !== GameStatus.ONGOING) endGame(gameStatus)
      } else if (data.action === 'error') {
        addNotification(data.error as string, 'error')
      } else if (data.action === 'drawOffer') {
        newDrawRequest(data.by as User)
      } else if (data.action === 'drawAccepted') {
        endGame(GameStatus.DRAW)
      } else if (data.action === 'drawOfferDeactivated') {
        setDrawRequest(undefined)
      } else if (data.action === 'surrender') {
        endGame(data.gameStatus as GameStatus.BLACK_WIN | GameStatus.WHITE_WIN)
      }
    },
    [addNotification, onGameEnd],
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

  const makeMove = (move: string) => {
    sendMessage({ action: 'move', move })
  }

  const drawAction = () => {
    setDrawRequest((prev) => (prev ? undefined : userRef.current))
    sendMessage({ action: 'draw' })
  }

  const surrender = () => {
    sendMessage({ action: 'surrender' })
  }

  return { gameState, makeMove, status, drawAction, drawRequest, surrender }
}

export default useChessGame

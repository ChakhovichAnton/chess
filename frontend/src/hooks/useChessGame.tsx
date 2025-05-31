import { useState, useEffect, useRef } from 'react'
import { GameWithMoves, GameStatus, Move, User } from '../types'
import { validateChessMove } from '../utils/validators/chess'
import { isAxiosError } from 'axios'
import api from '../utils/axios'
import { UseWebSocket } from './useWebSocket'
import { useNotification } from '../contexts/NotificationContext'
import { useDialog } from '../contexts/DialogContext'
import { GameEndDialog } from '../components/chess/GameEndDialog'
import { useAuth } from '../contexts/AuthContext'

type Status = 'loading' | 'live' | 'finished' | 'error' | 'notFound'

export const UseChessGame = (gameId: number) => {
  const { user } = useAuth()
  const { addNotification } = useNotification()
  const { openDialog } = useDialog()
  const [status, setStatus] = useState<Status>('loading')
  const [gameState, setGameState] = useState<GameWithMoves | undefined>(
    undefined,
  )

  // Additional refs to access the values in the onMessage handler
  const userRef = useRef<User | undefined>(undefined)
  const gameStateRef = useRef<GameWithMoves | undefined>(undefined)
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])
  useEffect(() => {
    userRef.current = user
  }, [userRef])

  const onMessage = (event: MessageEvent<any>) => {
    const data = JSON.parse(event.data)

    if (data.action === 'gameState') {
      const game = data.gameState as GameWithMoves
      setGameState(game)
    } else if (data.action === 'newMove') {
      const newMove = data.newMove as Move
      const gameStatus = data.gameStatus as GameStatus

      setGameState((prev) => {
        if (!prev) return
        const moveIsValid = validateChessMove(prev.fen, newMove.moveText)

        // If move is invalid, reload the page
        if (!moveIsValid) window.location.reload()

        return {
          ...prev,
          chessMoves: [...prev.chessMoves, newMove],
          fen: data.fen as string,
        } satisfies GameWithMoves
      })

      // If the game has ended
      if (gameStatus !== 'O') {
        const user = userRef.current
        const gameState = gameStateRef.current
        const isWhite = gameState && gameState.userWhite.id === user?.id
        const isBlack = gameState && gameState.userBlack.id === user?.id

        setStatus('finished')
        openDialog(
          <GameEndDialog
            userType={isWhite ? 'white' : isBlack ? 'black' : 'spectator'}
            white={gameState?.userWhite}
            black={gameState?.userBlack}
            result={gameStatus}
          />,
        )
      }
    } else if (data.action === 'error') {
      const errorMessage = data.error as string
      addNotification(errorMessage, 'error')
    }
  }

  const onClose = () => {
    setStatus('loading')
    setGameState(undefined)
  }

  const onError = () => {
    setStatus('error')
    setGameState(undefined)
  }

  const { sendMessage } = UseWebSocket(
    `game/${gameId}`,
    onMessage,
    status === 'live', // Connect automatically
    onClose,
    onError,
  )

  // Check if game is live or finished
  useEffect(() => {
    // Do not initialize another connection if game is already live
    if (status === 'live') return

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
  }, [gameId])

  const makeMove = (move: string) => {
    sendMessage({ action: 'move', move })
  }

  return { gameState, makeMove, status }
}

import { useState, useEffect, useRef } from 'react'
import { GameWithMoves, GameStatus, Move, User } from '../types'
import { validateChessMove } from '../utils/validators/chess'
import { isAxiosError } from 'axios'
import api from '../utils/axios'
import useWebSocket from './useWebSocket'
import { useAuth } from '../context/auth'
import { useNotification } from '../context/notification'

type Status = 'loading' | 'live' | 'finished' | 'error' | 'notFound'

const useChessGame = (
  gameId?: number,
  openGameEndDialog?: (
    userType: 'black' | 'white' | 'spectator',
    result: Exclude<GameStatus, GameStatus.ONGOING>,
    gameState?: GameWithMoves,
  ) => void,
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

  const onMessage = (event: MessageEvent<unknown>) => {
    const data = JSON.parse(event.data as string)

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
        if (openGameEndDialog) {
          openGameEndDialog(
            isWhite ? 'white' : isBlack ? 'black' : 'spectator',
            gameStatus,
            gameState,
          )
        }
      }
    } else if (data.action === 'error') {
      const errorMessage = data.error as string
      addNotification(errorMessage, 'error')
    } else if (data.action === 'drawOffer') {
      const maker = data.by as User
      setDrawRequest(maker)
      if (maker.id !== userRef.current?.id) {
        addNotification('New draw request', 'info')
      }
    } else if (data.action === 'drawAccepted') {
      const user = userRef.current // TODO: refactor code
      const gameState = gameStateRef.current
      const isWhite = gameState && gameState.userWhite.id === user?.id
      const isBlack = gameState && gameState.userBlack.id === user?.id

      setStatus('finished')
      setGameState((prev) => {
        if (!prev) return
        return {
          ...prev,
          status: GameStatus.DRAW,
        } satisfies GameWithMoves
      })
      if (openGameEndDialog) {
        openGameEndDialog(
          isWhite ? 'white' : isBlack ? 'black' : 'spectator',
          GameStatus.DRAW,
          gameState,
        )
      }
    } else if (data.action === 'drawOfferDeactivated') {
      setDrawRequest(undefined)
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

  return { gameState, makeMove, status, drawAction, drawRequest }
}

export default useChessGame

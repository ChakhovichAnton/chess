import { useState, useEffect } from 'react'
import { GameWithMoves, GameStatus, Move } from '../types'
import { validateChessMove } from '../utils/validators/chess'
import { isAxiosError } from 'axios'
import api from '../utils/axios'
import { UseWebSocket } from './useWebSocket'

type Status = 'loading' | 'live' | 'finished' | 'error' | 'notFound'

export const UseChessGame = (gameId: number) => {
  const [status, setStatus] = useState<Status>('loading')
  const [gameState, setGameState] = useState<GameWithMoves | undefined>(
    undefined,
  )

  const onMessage = (event: MessageEvent<any>) => {
    const data = JSON.parse(event.data)

    if (data.action === 'gameState') {
      const game = data.gameState as GameWithMoves
      setGameState(game)
    } else if (data.action === 'newMove') {
      const newMove = data.newMove as Move

      setGameState((prev) => {
        if (!prev) return
        const moveIsValid = validateChessMove(prev.fen, newMove.moveText)

        // If move is invalid, reopen the connection
        if (!moveIsValid) {
          disconnect()
          connect()
          return
        }

        return {
          ...prev,
          chessMoves: [...prev.chessMoves, newMove],
          fen: data.fen as string,
        } satisfies GameWithMoves
      })
    } else if (data.action === 'error') {
      //const errorMessage = data.error as string
      // TODO: show error
    } else if (data.action === 'gameOver') {
      // TODO: end game
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

  const { connect, disconnect, sendMessage } = UseWebSocket(
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

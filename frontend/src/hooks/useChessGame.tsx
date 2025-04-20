import { useState, useEffect, useRef } from 'react'
import { GameWithMoves, GameStatus, Move } from '../types'
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'
import { refreshAccessToken } from '../utils/accessToken'
import { validateChessMove } from '../utils/validators/chess'
import { isAxiosError } from 'axios'
import api from '../utils/axios'

type Status = 'loading' | 'live' | 'finished' | 'error' | 'notFound'

export const useChessGame = (gameId: number) => {
  const [status, setStatus] = useState<Status>('loading')
  const [gameState, setGameState] = useState<GameWithMoves | undefined>(undefined)
  const socketRef = useRef<WebSocket | undefined>(undefined)
  const retryRef = useRef(false) // If connection retry has been attempted; for example, due to invalid credentials

  const initializeSocket = () => {
    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/game/${gameId}/?token=${localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)}`,
    )
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      retryRef.current = false // Allow a retry after a new message

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
            socketRef.current?.close()
            initializeSocket()
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

    socketRef.current.onerror = () => {
      setStatus('error')
      setGameState(undefined)
    }
    socketRef.current.onclose = async (closeEvent) => {
      // If event code is 1006, refresh access token and reconnect
      if (closeEvent.code === 1006 && !retryRef.current) {
        setStatus('loading')
        setGameState(undefined)
        await refreshAccessToken()
        initializeSocket()
        retryRef.current = true
      }
    }
  }

  // Initialize WebSocket connection only if game is live to make sure that the WebSocket
  // connection is initialized only once
  useEffect(() => {
    if (status !== 'live' || socketRef.current) return

    initializeSocket()
    return () => socketRef.current?.close()
  }, [gameId, status])

  // Check if game is live or finished
  useEffect(() => {
    // Return if socket already exists
    if (socketRef.current) return

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
    if (socketRef.current?.readyState === WebSocket.OPEN && status === 'live') {
      socketRef.current.send(JSON.stringify({ action: 'move', move }))
    } else {
      // TODO: notify user that move could not be made
    }
  }

  return { gameState, makeMove, status }
}

import { createContext, useState, useContext, useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import { Game, Move } from '../types'
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'
import { refreshAccessToken } from '../utils/refreshAccessToken'

type Status = 'connecting' | 'connected' | 'error' | 'closed'

interface ChessContextProps {
  gameState?: Game
  makeMove: (move: string) => void
  chess: Chess
  status: Status
}

const ChessContext = createContext<ChessContextProps | undefined>(undefined)

interface ChessProviderProps {
  gameId: string
  children: React.ReactNode
}

export const ChessProvider: React.FC<ChessProviderProps> = (props) => {
  const [gameState, setGameState] = useState<Game | undefined>(undefined)
  const socketRef = useRef<WebSocket | undefined>(undefined)
  const retryRef = useRef(false) // If connection retry has been attempted
  const [chess, setChess] = useState(new Chess())
  const [status, setStatus] = useState<Status>('connecting')

  const initializeSocket = () => {
    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/game/${props.gameId}/?token=${localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)}`,
    )
    socketRef.current.onopen = () => setStatus('connected')
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.action === 'gameState') {
        const game = data.gameState as Game

        const newChess = new Chess(game.fen)
        setChess(newChess)
        setGameState(game)
      } else if (data.action === 'newMove') {
        const newMove = data.newMove as Move

        setChess((prev) => {
          const newChess = new Chess(prev.fen())
          newChess.move(newMove.moveText)
          return newChess
        })

        setGameState((prevState) =>
          prevState
            ? ({
                ...prevState,
                chessMoves: [...prevState.chessMoves, newMove],
                fen: chess.fen(),
              } satisfies Game)
            : undefined,
        )
      } else if (data.action === 'error') {
        //const errorMessage = data.error as string
        // TODO: show error
      } else if (data.action === 'gameOver') {
        // TODO: end game
      }
    }
    socketRef.current.onerror = () => setStatus('error')
    socketRef.current.onclose = async (closeEvent) => {
      if (closeEvent.code === 1006 && !retryRef.current) {
        await refreshAccessToken()
        initializeSocket()
        retryRef.current = true
      }
    }
  }

  useEffect(() => {
    if (socketRef.current) return
    initializeSocket()

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        setStatus('closed')
        socketRef.current.close()
      }
    }
  }, [])

  const makeMove = (move: string) => {
    // TODO: check if move is valid
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'move', move }))
    } else {
      // TODO: notify user that move could not be made
    }
  }

  return (
    <ChessContext.Provider value={{ gameState, makeMove, chess, status }}>
      {props.children}
    </ChessContext.Provider>
  )
}

export const useChess = () => {
  const context = useContext(ChessContext)
  if (!context) {
    throw new Error('useChess must be used within a ChessProvider')
  }
  return context
}

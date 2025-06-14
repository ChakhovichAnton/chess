import { createContext, useContext } from 'react'
import { ChessGameContextType } from './chessGameTypes'

export const ChessGameContext = createContext<ChessGameContextType | undefined>(
  undefined,
)

export const useChessGame = () => {
  const context = useContext(ChessGameContext)
  if (!context) {
    throw new Error('useChessGame must be used within a ChessGameContext')
  }
  return context
}

import { Chess } from 'chess.js'

export const validateChessMove = (fen: string, moveString: string) => {
  try {
    const chess = new Chess(fen)
    chess.move(moveString) // Throws an exception if move is invalid

    return true
  } catch {
    return false
  }
}

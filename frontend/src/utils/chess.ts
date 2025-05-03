import { PieceSymbol } from 'chess.js'

export const moveTextToPiece = (moveText: string): PieceSymbol => {
  switch (moveText[0]) {
    case 'B':
      return 'b'
    case 'N':
      return 'n'
    case 'R':
      return 'r'
    case 'Q':
      return 'q'
    case 'K':
      return 'k'
    default: // Default to pawn
      return 'p'
  }
}

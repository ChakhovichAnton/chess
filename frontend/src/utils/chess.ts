import { Chess, PieceSymbol } from 'chess.js'
import { CHESS_PIECES } from '../constants'

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

const START_PIECE_COUNTS = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1,
}

export const getCapturedPieces = (game: Chess) => {
  const counts = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
  }

  const squares = game.board().flat()
  squares.forEach((square) => {
    if (square) {
      counts[square.color][square.type]++
    }
  })

  const capturedByWhite: PieceSymbol[] = []
  const capturedByBlack: PieceSymbol[] = []

  for (const type of CHESS_PIECES) {
    const whiteMissing = START_PIECE_COUNTS[type] - counts.w[type]
    const blackMissing = START_PIECE_COUNTS[type] - counts.b[type]

    for (let i = 0; i < whiteMissing; i++) {
      capturedByBlack.push(type)
    }
    for (let i = 0; i < blackMissing; i++) {
      capturedByWhite.push(type)
    }
  }

  return { capturedByWhite, capturedByBlack }
}

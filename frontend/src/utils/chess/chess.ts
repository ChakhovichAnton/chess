import { Chess, PieceSymbol, Square } from 'chess.js'
import { CHESS_PIECES } from '../../constants'
import { GameWithMoves, User } from '../../types'
import {
  CustomSquareStyles,
  Piece,
} from 'react-chessboard/dist/chessboard/types'
import { MOVABLE_SQUARE_STYLE } from './boardStyles'

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

export const userIsAPlayer = (game: GameWithMoves, user: User) => {
  return game.userBlack.id === user.id || game.userWhite.id === user.id
}

export const pieceBelogsToPlayer = (
  piece: Piece,
  game: GameWithMoves,
  player: User,
) => {
  const isBlack = player.id === game.userBlack.id && piece.startsWith('b')
  const isWhite = player.id === game.userWhite.id && piece.startsWith('w')

  return isBlack || isWhite
}

export const getDestinationsOfLegalMove = (chess: Chess, square: Square) => {
  const moves = chess.moves({ square, verbose: true })

  const customSquares: CustomSquareStyles = {}
  moves.forEach((move) => {
    const isCapture = chess.get(move.to).type

    customSquares[move.to] = {
      background:
        MOVABLE_SQUARE_STYLE.background[isCapture ? 'isCapture' : 'notCapture'],
      borderRadius: MOVABLE_SQUARE_STYLE.borderRadius,
    }
  })
  return customSquares
}

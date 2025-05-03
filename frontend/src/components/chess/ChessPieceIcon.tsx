import { PieceSymbol } from 'chess.js'
import { FC } from 'react'
import {
  FaChessPawn,
  FaChessKnight,
  FaChessBishop,
  FaChessRook,
  FaChessQueen,
  FaChessKing,
} from 'react-icons/fa'

const WHITE_CSS = 'text-white text-lg shrink-0'
const BLACK_CSS = 'text-black text-lg shrink-0'

interface ChessPieceIconProps {
  piece: PieceSymbol | string
  isWhite: boolean
}

export const ChessPieceIcon: FC<ChessPieceIconProps> = ({ piece, isWhite }) => {
  switch (piece) {
    case 'p':
      return <FaChessPawn className={isWhite ? WHITE_CSS : BLACK_CSS} />
    case 'n':
      return <FaChessKnight className={isWhite ? WHITE_CSS : BLACK_CSS} />
    case 'b':
      return <FaChessBishop className={isWhite ? WHITE_CSS : BLACK_CSS} />
    case 'r':
      return <FaChessRook className={isWhite ? WHITE_CSS : BLACK_CSS} />
    case 'q':
      return <FaChessQueen className={isWhite ? WHITE_CSS : BLACK_CSS} />
    case 'k':
      return <FaChessKing className={isWhite ? WHITE_CSS : BLACK_CSS} />
  }
  return <></>
}

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

const WHITE_CSS = 'text-white shrink-0'
const BLACK_CSS = 'text-black shrink-0'

interface ChessPieceIconProps {
  piece: PieceSymbol | string
  isWhite: boolean
  size?: number
}

export const ChessPieceIcon: FC<ChessPieceIconProps> = ({
  piece,
  isWhite,
  size = 20,
}) => {
  const className = isWhite ? WHITE_CSS : BLACK_CSS

  switch (piece) {
    case 'p':
      return <FaChessPawn size={size} className={className} />
    case 'n':
      return <FaChessKnight size={size} className={className} />
    case 'b':
      return <FaChessBishop size={size} className={className} />
    case 'r':
      return <FaChessRook size={size} className={className} />
    case 'q':
      return <FaChessQueen size={size} className={className} />
    case 'k':
      return <FaChessKing size={size} className={className} />
  }
  return <></>
}

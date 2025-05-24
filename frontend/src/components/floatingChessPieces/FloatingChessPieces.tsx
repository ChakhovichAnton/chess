import './animate.css'
import { ChessPieceIcon } from '../chess/ChessPieceIcon'

const FloatingChessPieces = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <span className="floating-piece-left-to-right float-1">
        <ChessPieceIcon piece="q" isWhite={true} size={50} />
      </span>
      <span className="float-piece float-2">
        <ChessPieceIcon piece="n" isWhite={true} size={50} />
      </span>
      <span className="float-piece float-3">
        <ChessPieceIcon piece="p" isWhite={true} size={50} />
      </span>
      <span className="float-piece float-4">
        <ChessPieceIcon piece="r" isWhite={true} size={50} />
      </span>
      <span className="floating-piece-right-to-left float-5">
        <ChessPieceIcon piece="k" isWhite={true} size={50} />
      </span>
      <span className="float-piece float-6">
        <ChessPieceIcon piece="b" isWhite={true} size={50} />
      </span>
    </div>
  )
}

export default FloatingChessPieces

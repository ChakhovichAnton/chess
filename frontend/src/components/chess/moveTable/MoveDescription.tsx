import { FC } from 'react'
import { Move } from '../../../types'
import { ChessPieceIcon } from '../ChessPieceIcon'
import { moveTextToPiece } from '../../../utils/chess/chess'

interface MoveDescriptionProps {
  move: Move
  isWhite: boolean
}

const MoveDescription: FC<MoveDescriptionProps> = ({ move, isWhite }) => {
  const piece = moveTextToPiece(move.moveText)

  return (
    <div className="flex items-center gap-0.5 p-0.5 w-fit h-fit hover:cursor-pointer">
      {piece === 'p' ? (
        <span>{move.moveText}</span>
      ) : (
        <>
          <ChessPieceIcon piece={piece} isWhite={isWhite} />
          <span>{move.moveText.slice(1)}</span>
        </>
      )}
    </div>
  )
}

export default MoveDescription

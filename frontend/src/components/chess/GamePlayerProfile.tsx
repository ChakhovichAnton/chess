import { PieceSymbol } from 'chess.js'
import { FC } from 'react'
import { CgProfile } from 'react-icons/cg'
import { ChessPieceIcon } from './ChessPieceIcon'

interface GamePlayerProfileProps {
  player: { username: string }
  capturedPieces: PieceSymbol[]
  isWhite: boolean
}

const GamePlayerProfile: FC<GamePlayerProfileProps> = (props) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-background-gray rounded">
      <CgProfile size={40} className="bg-white rounded" />
      <div className="flex flex-col">
        <p className="font-medium text-white">{props.player.username}</p>
        <span className="flex gap-0.5 h-4">
          {props.capturedPieces.map((piece, index) => (
            <ChessPieceIcon
              key={index}
              piece={piece}
              isWhite={!props.isWhite}
              size={15}
            />
          ))}
        </span>
      </div>
    </div>
  )
}

export default GamePlayerProfile

import { Chessboard as ReactChessboard } from 'react-chessboard'
import { BoardOrientation, Game } from '../../types'
import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Square } from 'react-chessboard/dist/chessboard/types'
import { useAuth } from '../../contexts/AuthContext'

interface ChessboardProps {
  game?: Game
  isLiveGame: boolean
  makeMove: (move: string) => void
}

const Chessboard = (props: ChessboardProps) => {
  const { user } = useAuth()

  const [chess, setChess] = useState(new Chess(props.game?.fen))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  // Default to white while setting the actual orientation in the useEffect
  const [boardOrientation, setBoardOrientation] =
    useState<BoardOrientation>('white')

  useEffect(() => {
    const newChess = new Chess(props.game?.fen)
    const isBlack = user?.id === props.game?.userBlack.id
    const isWhite = user?.id === props.game?.userWhite.id

    const isPlayerTurn =
      (newChess.turn() === 'b' && isBlack) ||
      (newChess.turn() === 'w' && isWhite)

    setChess(newChess)
    setBoardOrientation(isBlack ? 'black' : 'white')
    setIsPlayerTurn(!props.game ? false : isPlayerTurn)
  }, [props.game])

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    if (!props.game || !isPlayerTurn) return false

    try {
      const gameCopy = new Chess(props.game.fen)

      // Throws exception if move is invalid
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })
      props.makeMove(move.san)
      setIsPlayerTurn(false)

      return true
    } catch (error) {
      return false
    }
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-6xl w-full flex gap-20">
        <div>
          <ReactChessboard
            position={props.game ? chess.fen() : undefined} // To rerender the game whenever the game is loaded
            boardOrientation={boardOrientation}
            boardWidth={400}
            onPieceDrop={onDrop}
            isDraggablePiece={() => isPlayerTurn}
            animationDuration={0}
          />
          <button
            onClick={() => {
              setBoardOrientation((prev) =>
                prev === 'black' ? 'white' : 'black',
              )
            }}
            className="hover:cursor-pointer"
          >
            Toggle Board Orientation
          </button>
        </div>
        <div className="grid grid-cols-2 max-h-[500px] overflow-y-scroll">
          <h3 className="font-semibold pr-2 border-b-2">White</h3>
          <h3 className="font-semibold border-b-2">Black</h3>
          {props.game?.chessMoves.map((move) => (
            <p key={move.id} className="border-b-2">
              {move.moveText}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Chessboard

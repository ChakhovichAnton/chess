import { Chessboard as ReactChessboard } from 'react-chessboard'
import { BoardOrientation, GameWithMoves } from '../../types'
import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { Piece, Square } from 'react-chessboard/dist/chessboard/types'
import { useAuth } from '../../contexts/AuthContext'
import MoveTable from './MoveTable'
import ToggleBoardDirectionButton from './ToggleBoardDirectionButton'

interface ChessboardProps {
  game?: GameWithMoves
  isLiveGame: boolean
  makeMove: (move: string) => void
}

const Chessboard = (props: ChessboardProps) => {
  const { user, loading } = useAuth()

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

  const isDraggablePiece = ({ piece }: { piece: Piece }) => {
    if (loading || !user) return false

    // Checking if the piece belongs to the player
    const isBlack =
      user.id === props.game?.userBlack.id && piece.startsWith('b')
    const isWhite =
      user.id === props.game?.userWhite.id && piece.startsWith('w')

    return isPlayerTurn && (isBlack || isWhite)
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-6xl w-full flex gap-20">
        <div className="flex">
          <ReactChessboard
            position={props.game ? chess.fen() : undefined} // To rerender the game whenever the game is loaded
            boardOrientation={boardOrientation}
            boardWidth={400}
            onPieceDrop={onDrop}
            isDraggablePiece={isDraggablePiece}
            animationDuration={0}
          />
          <ToggleBoardDirectionButton
            setBoardOrientation={setBoardOrientation}
          />
        </div>
        <MoveTable game={props.game} />
      </div>
    </div>
  )
}

export default Chessboard

import { Chessboard as ReactChessboard } from 'react-chessboard'
import { BoardOrientation, GameWithMoves } from '../../types'
import { FC, useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import {
  CustomSquareStyles,
  Piece,
  Square,
} from 'react-chessboard/dist/chessboard/types'
import { useAuth } from '../../context/auth'
import GamePlayerProfile from './GamePlayerProfile'
import { getCapturedPieces } from '../../utils/chess'
import ChessGameButton from './ChessGameButton'
import { HiArrowsUpDown } from 'react-icons/hi2'
import { FiTarget } from 'react-icons/fi'

const SELECTED_SQUARE_COLOR = 'rgba(187, 190, 133, 1)'
const MOVABLE_SQUARE_STYLE = {
  background: {
    isCapture: 'radial-gradient(circle, rgba(0,0,0,0.3) 30%, transparent 90%)',
    notCapture: 'radial-gradient(circle, rgba(0,0,0,0.3) 15%, transparent 20%)',
  },
  borderRadius: '50%',
}

interface ChessboardProps {
  game: GameWithMoves
  isLiveGame: boolean
  makeMove: (move: string) => void
}

const Chessboard: FC<ChessboardProps> = (props) => {
  const { user, loading } = useAuth()

  const [chess, setChess] = useState(new Chess(props.game.fen))
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  // Default to white while setting the actual orientation in the useEffect
  const [boardOrientation, setBoardOrientation] =
    useState<BoardOrientation>('white')
  const [boardSize, setBoardSize] = useState(400)
  const [squareStyles, setSquareStyles] = useState<
    CustomSquareStyles | undefined
  >(undefined)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [showValidMoves, setShowValidMoves] = useState(true)

  useEffect(() => {
    const newChess = new Chess(props.game.fen)
    const isBlack = user?.id === props.game.userBlack.id
    const isWhite = user?.id === props.game.userWhite.id

    const isPlayerTurn =
      (newChess.turn() === 'b' && isBlack) ||
      (newChess.turn() === 'w' && isWhite)

    setChess(newChess)
    setBoardOrientation(isBlack ? 'black' : 'white')
    setIsPlayerTurn(isPlayerTurn)
  }, [props.game, user])

  useEffect(() => {
    const updateSize = () => {
      const maxHeight = Math.max(window.innerHeight - 225, 300)
      const maxWidth = Math.max(window.innerWidth - 100, 300)

      const newSize = Math.min(maxHeight, maxWidth)
      setBoardSize(newSize)
    }
    updateSize()

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const resetSquareSelections = () => {
    setSquareStyles(undefined)
    setSelectedSquare(null)
  }

  const move = (sourceSquare: Square, targetSquare: Square) => {
    resetSquareSelections()
    if (!isPlayerTurn) return false

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
    } catch {
      return false
    }
  }

  const isDraggablePiece = ({ piece }: { piece: Piece }) => {
    if (loading || !user) return false

    // Checking if the piece belongs to the player
    const isBlack = user.id === props.game.userBlack.id && piece.startsWith('b')
    const isWhite = user.id === props.game.userWhite.id && piece.startsWith('w')

    return isPlayerTurn && (isBlack || isWhite)
  }

  const onSquareClick = (square: Square) => {
    // Player cannot click on squares if it is not their turn
    if (!isPlayerTurn) {
      resetSquareSelections()
      return
    }

    // Move the piece into the square if a movable piece has been selected
    if (selectedSquare && move(selectedSquare, square)) return

    // If the square has no piece, deselect the square
    if (chess.get(square).type === undefined) {
      resetSquareSelections()
      return
    }

    // If a square is clicked twice in a row, deselect the square
    if (selectedSquare === square) {
      resetSquareSelections()
      return
    }

    const possibleMoves = chess.moves({ square, verbose: true })

    const customSquares: CustomSquareStyles = {}
    possibleMoves.forEach((move) => {
      const isCapture = chess.get(move.to).type

      customSquares[move.to] = {
        background:
          MOVABLE_SQUARE_STYLE.background[
            isCapture ? 'isCapture' : 'notCapture'
          ],
        borderRadius: MOVABLE_SQUARE_STYLE.borderRadius,
      }
    })

    setSquareStyles(customSquares)
    setSelectedSquare(square)
  }

  const { capturedByWhite, capturedByBlack } = getCapturedPieces(chess)

  return (
    <div className="flex gap-2 justify-center lg:justify-start p-2 rounded-md bg-background-gray-light w-fit h-fit">
      <div className="space-y-1">
        <GamePlayerProfile
          player={
            props.game[boardOrientation === 'black' ? 'userWhite' : 'userBlack']
          }
          capturedPieces={
            boardOrientation === 'black' ? capturedByWhite : capturedByBlack
          }
          isWhite={boardOrientation === 'black'}
        />
        <ReactChessboard
          position={chess.fen()}
          boardOrientation={boardOrientation}
          boardWidth={boardSize}
          onPieceDrop={move}
          isDraggablePiece={isDraggablePiece}
          animationDuration={300}
          onSquareClick={onSquareClick}
          customSquareStyles={{
            ...(showValidMoves ? squareStyles : {}),
            [selectedSquare as string]: {
              backgroundColor: SELECTED_SQUARE_COLOR,
            },
          }}
        />
        <GamePlayerProfile
          player={
            props.game[boardOrientation === 'white' ? 'userWhite' : 'userBlack']
          }
          capturedPieces={
            boardOrientation === 'white' ? capturedByWhite : capturedByBlack
          }
          isWhite={boardOrientation === 'white'}
        />
      </div>
      <div className="flex flex-col gap-2">
        <ChessGameButton
          tooltipText="Toggle Board Direction"
          onClick={() =>
            setBoardOrientation((prev) =>
              prev === 'black' ? 'white' : 'black',
            )
          }
          icon={HiArrowsUpDown}
        />
        <ChessGameButton
          tooltipText={showValidMoves ? 'Hide Valid Moves' : 'Show Valid Moves'}
          onClick={() => setShowValidMoves((prev) => !prev)}
          icon={FiTarget}
        />
      </div>
    </div>
  )
}

export default Chessboard

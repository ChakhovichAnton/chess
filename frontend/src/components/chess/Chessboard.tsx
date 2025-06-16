import { Chessboard as ReactChessboard } from 'react-chessboard'
import { GameWithMoves } from '../../types'
import { FC, useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import {
  CustomSquareStyles,
  Piece,
  Square,
} from 'react-chessboard/dist/chessboard/types'
import { useAuth } from '../../context/auth'
import GamePlayerProfile from './GamePlayerProfile'
import {
  getCapturedPieces,
  getDestinationsOfLegalMove as getStyledDestinationsOfLegalMove,
  pieceBelogsToPlayer,
} from '../../utils/chess/chess'
import ChessGameButton from './ChessGameButton'
import { HiArrowsUpDown } from 'react-icons/hi2'
import { FiTarget } from 'react-icons/fi'
import useChessBoardSettings from '../../hooks/useChessBoardSettings'
import { SELECTED_SQUARE_COLOR } from '../../utils/chess/boardStyles'

interface ChessboardProps {
  game: GameWithMoves
  isLiveGame: boolean
  makeMove: (move: string) => void
}

const Chessboard: FC<ChessboardProps> = (props) => {
  const { user, loading } = useAuth()

  const [chess, setChess] = useState(new Chess(props.game.fen))
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [squareStyles, setSquareStyles] = useState<
    CustomSquareStyles | undefined
  >(undefined)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const {
    boardOrientation,
    boardSize,
    showValidMoves,
    toggleShowValidMoves,
    toggleBoardOrientation,
  } = useChessBoardSettings(props.game)

  useEffect(() => {
    const newChess = new Chess(props.game.fen)
    const isBlack = user?.id === props.game.userBlack.id
    const isWhite = user?.id === props.game.userWhite.id

    const isPlayerTurn =
      (newChess.turn() === 'b' && isBlack) ||
      (newChess.turn() === 'w' && isWhite)

    setChess(newChess)
    setIsPlayerTurn(isPlayerTurn)
  }, [props.game, user])

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
    return isPlayerTurn && pieceBelogsToPlayer(piece, props.game, user)
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

    const customSquares = getStyledDestinationsOfLegalMove(chess, square)
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
          chessClockMs={
            boardOrientation === 'black'
              ? props.game.clock.whiteTimeMs
              : props.game.clock.blackTimeMs
          }
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
          chessClockMs={
            boardOrientation === 'white'
              ? props.game.clock.whiteTimeMs
              : props.game.clock.blackTimeMs
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <ChessGameButton
          tooltipText="Toggle Board Direction"
          onClick={toggleBoardOrientation}
          icon={HiArrowsUpDown}
        />
        <ChessGameButton
          tooltipText={showValidMoves ? 'Hide Valid Moves' : 'Show Valid Moves'}
          onClick={toggleShowValidMoves}
          icon={FiTarget}
        />
      </div>
    </div>
  )
}

export default Chessboard

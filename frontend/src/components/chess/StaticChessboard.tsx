import { FC, useEffect, useState } from 'react'
import { Chessboard as ReactChessboard } from 'react-chessboard'

interface StaticChessboardProps {
  showBoardScreenWidthPx?: number
}

const StaticChessboard: FC<StaticChessboardProps> = ({
  showBoardScreenWidthPx,
}) => {
  const [showBoard, setShowBoard] = useState(false)

  // useEffect fixes a bug of the board not being rerendered when the screen size changes
  useEffect(() => {
    if (showBoardScreenWidthPx === undefined) return

    const showBoard = () => {
      setShowBoard(window.innerWidth >= showBoardScreenWidthPx)
    }

    showBoard()
    window.addEventListener('resize', showBoard)
    return () => window.removeEventListener('resize', showBoard)
  }, [showBoardScreenWidthPx])

  if (showBoard) {
    return (
      <ReactChessboard
        // Static chessboard
        onSquareClick={() => {}}
        areArrowsAllowed={false}
        arePiecesDraggable={false}
        showBoardNotation={false}
      />
    )
  }

  return null
}

export default StaticChessboard

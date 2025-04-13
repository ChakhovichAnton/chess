import MatchWithOpponent from './MatchWithOpponent'
import GameTable from './GameTable'
import { Chessboard as ReactChessboard } from 'react-chessboard'

const LandingPage = () => {
  return (
    <div className="flex justify-center px-2">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-semibold my-6">Chess App</h1>
        <div className="grid grid-cols-2 gap-16 mb-15">
          <ReactChessboard
            // Static chessboard
            onSquareClick={() => {}}
            isDraggablePiece={() => false}
          />
          <MatchWithOpponent />
        </div>
        <GameTable />
      </div>
    </div>
  )
}

export default LandingPage

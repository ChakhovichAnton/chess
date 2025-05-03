import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import ErrorPage from './specialPages/ErrorPage'
import Loading from './specialPages/Loading'
import Chessboard from '../components/chess/Chessboard'
import { UseChessGame } from '../hooks/useChessGame'
import { validateInteger } from '../utils/validators/integer'
import MoveTable from '../components/chess/moveTable/MoveTable'

const ChessGamePage = () => {
  // Validate gameId
  const { id: gameIdString } = useParams()
  const gameId = validateInteger(gameIdString)
  if (gameId === undefined) return NotFound()

  const { gameState, makeMove, status } = UseChessGame(gameId)

  if (status === 'notFound') return NotFound()
  if (status === 'error') return ErrorPage()
  if (status === 'loading' || !gameState) return Loading()

  return (
    <div className="mx-auto flex flex-col lg:flex-row max-w-6xl px-1 xl:px-0 w-full gap-x-20 gap-y-5 items-stretch">
      <div className="flex-1 flex justify-center">
        <Chessboard
          game={gameState}
          isLiveGame={status === 'live'}
          makeMove={makeMove}
        />
      </div>
      <div className="bg-background-gray-light py-2 rounded">
        <h2 className="text-white font-medium text-center pb-1">Moves</h2>
        <MoveTable game={gameState} />
      </div>
    </div>
  )
}

export default ChessGamePage

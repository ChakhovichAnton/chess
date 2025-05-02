import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import ErrorPage from './specialPages/ErrorPage'
import Loading from './specialPages/Loading'
import Chessboard from '../components/chess/Chessboard'
import { UseChessGame } from '../hooks/useChessGame'
import { validateInteger } from '../utils/validators/integer'
import MoveTable from '../components/chess/MoveTable'

const ChessGamePage = () => {
  // Validate gameId
  const { id: gameIdString } = useParams()
  const gameId = validateInteger(gameIdString)
  if (gameId === undefined) return NotFound()

  const { gameState, makeMove, status } = UseChessGame(gameId)

  if (status === 'notFound') return NotFound()
  if (status === 'error') return ErrorPage()
  if (status === 'loading') return Loading()

  return (
    <div className="flex justify-center">
      <div className="flex flex-col lg:flex-row max-w-6xl px-1 xl:px-0 w-full gap-20 items-stretch">
        <Chessboard
          game={gameState}
          isLiveGame={status === 'live'}
          makeMove={makeMove}
        />
        <div className="bg-background-gray-light py-2 px-4 rounded">
          <MoveTable game={gameState} />
        </div>
      </div>
    </div>
  )
}

export default ChessGamePage

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
      <div className="max-w-6xl w-full flex gap-20">
        <Chessboard
          game={gameState}
          isLiveGame={status === 'live'}
          makeMove={makeMove}
        />
        <MoveTable game={gameState} />
      </div>
    </div>
  )
}

export default ChessGamePage

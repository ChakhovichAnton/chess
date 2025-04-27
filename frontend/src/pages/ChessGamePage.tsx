import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import ErrorPage from './specialPages/ErrorPage'
import Loading from './specialPages/Loading'
import Chessboard from '../components/chess/Chessboard'
import { useChessGame } from '../hooks/useChessGame'
import { validateInteger } from '../utils/validators/integer'

const ChessGamePage = () => {
  // Validate gameId
  const { id: gameIdString } = useParams()
  const gameId = validateInteger(gameIdString)
  if (gameId === undefined) return NotFound()

  const { gameState, makeMove, status } = useChessGame(gameId)

  if (status === 'notFound') return NotFound()
  if (status === 'error') return ErrorPage()
  if (status === 'loading') return Loading()

  return (
    <Chessboard
      game={gameState}
      isLiveGame={status === 'live'}
      makeMove={makeMove}
    />
  )
}

export default ChessGamePage

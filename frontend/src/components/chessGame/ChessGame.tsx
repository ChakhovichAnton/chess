import { useParams } from 'react-router-dom'
import NotFound from '../specialPages/NotFound'
import ErrorPage from '../specialPages/ErrorPage'
import Loading from '../specialPages/Loading'
import Chessboard from './Chessboard'
import { useChessGame } from '../../hooks/useChessGame'
import { validateInteger } from '../../utils/validators/integer'

const ChessGame = () => {
  // Validate gameId
  const { id: gameIdString } = useParams()
  const gameId = validateInteger(gameIdString)
  if (gameId === undefined) return NotFound()

  const { gameState, makeMove, status } = useChessGame(gameId)

  if (status === 'loading') return Loading()
  if (status === 'notFound') return NotFound()
  if (status === 'error') return ErrorPage()

  return (
    <Chessboard
      game={gameState}
      isLiveGame={status === 'live'}
      makeMove={makeMove}
    />
  )
}

export default ChessGame

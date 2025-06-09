import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import ErrorPage from './specialPages/ErrorPage'
import Loading from './specialPages/Loading'
import Chessboard from '../components/chess/Chessboard'
import useChessGame from '../hooks/useChessGame'
import { validateInteger } from '../utils/validators/integer'
import MoveTable from '../components/chess/moveTable/MoveTable'
import { GameStatus, GameWithMoves } from '../types'
import { useDialog } from '../context/dialog'
import { GameEndDialog } from '../components/chess/GameEndDialog'
import { FaHandshake } from 'react-icons/fa'
import Tooltip from '../components/Tooltip'
import { FaFlag } from 'react-icons/fa'
import { useAuth } from '../context/auth'

const ChessGamePage = () => {
  // Validate gameId
  const { user } = useAuth()
  const { id: gameIdString } = useParams()
  const gameId = validateInteger(gameIdString)
  const { openDialog } = useDialog()

  const openGameEndDialog = (
    userType: 'black' | 'white' | 'spectator',
    result: Exclude<GameStatus, GameStatus.ONGOING>,
    gameState?: GameWithMoves,
  ) => {
    openDialog(
      <GameEndDialog
        userType={userType}
        white={gameState?.userWhite}
        black={gameState?.userBlack}
        result={result}
      />,
    )
  }

  const { gameState, makeMove, status, drawAction, drawRequest, surrender } =
    useChessGame(gameId, openGameEndDialog)

  if (status === 'notFound' || gameId === undefined) return NotFound()
  if (status === 'error') return ErrorPage()
  if (status === 'loading' || !gameState) return Loading()

  const userIsAPlayer =
    user &&
    (gameState.userBlack.id === user.id || gameState.userWhite.id === user.id)

  return (
    <div className="mx-auto flex flex-col lg:flex-row max-w-6xl px-1 xl:px-0 w-full gap-x-20 gap-y-5 items-stretch">
      <div className="flex-1 flex justify-center">
        <Chessboard
          game={gameState}
          isLiveGame={status === 'live'}
          makeMove={makeMove}
        />
      </div>
      <div className="flex flex-col justify-between bg-background-gray-light py-2 rounded">
        <div>
          <h2 className="text-white font-medium text-center pb-1">Moves</h2>
          <MoveTable game={gameState} />
        </div>
        {gameState.status !== GameStatus.ONGOING ? (
          <div className="bg-background-gray px-1 py-2 text-center text-2xl text-white">
            <p>
              {gameState.status === GameStatus.DRAW
                ? 'Draw!'
                : gameState.status === GameStatus.WHITE_WIN
                  ? 'White won!'
                  : 'Black won!'}
            </p>
          </div>
        ) : (
          <>
            {drawRequest && (
              <div className="bg-background-gray px-1 py-2 text-center space-y-1">
                <p className="text-white">
                  {drawRequest.username} has requested for a draw
                </p>
                {userIsAPlayer && (
                  <>
                    {drawRequest.id === user.id ? (
                      <button
                        onClick={drawAction}
                        className="hover:cursor-pointer bg-red-500 px-2 py-1 rounded-md w-fit h-fit"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={drawAction}
                        className="hover:cursor-pointer bg-green-500 px-2 py-1 rounded-md w-fit h-fit"
                      >
                        Accept
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {userIsAPlayer && (
              <div className="flex justify-between mx-2 mt-2">
                <Tooltip text="Surrender">
                  <button
                    onClick={surrender}
                    className="hover:cursor-pointer bg-background-gray text-white p-0.5 rounded-md w-fit h-fit"
                  >
                    <FaFlag size={20} />
                  </button>
                </Tooltip>
                {!drawRequest && (
                  <Tooltip text="Request Draw">
                    <button
                      onClick={drawAction}
                      className="hover:cursor-pointer bg-background-gray text-white p-0.5 rounded-md w-fit h-fit"
                    >
                      <FaHandshake size={20} />
                    </button>
                  </Tooltip>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ChessGamePage

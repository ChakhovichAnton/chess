import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import ErrorPage from './specialPages/ErrorPage'
import Loading from './specialPages/Loading'
import Chessboard from '../components/chess/Chessboard'
import useChessGame from '../hooks/useChessGame'
import { validateInteger } from '../utils/validators/integer'
import MoveTable from '../components/chess/moveTable/MoveTable'
import { FinishedGameWithMoves, GameStatus, User } from '../types'
import { useDialog } from '../context/dialog'
import { GameEndDialog } from '../components/dialog/GameEndDialog'
import { FaHandshake } from 'react-icons/fa'
import { FaFlag } from 'react-icons/fa'
import { useAuth } from '../context/auth'
import ConfirmationDialog from '../components/dialog/ConfirmationDialog'
import { useCallback, useState } from 'react'
import { userIsAPlayer } from '../utils/chess/chess'
import DrawOfferSection from '../components/chess/DrawOfferSection'
import ChessGameButton from '../components/chess/ChessGameButton'

const ChessGamePage = () => {
  // Validate gameId
  const { user } = useAuth()
  const { id: gameIdString } = useParams()
  const gameId = validateInteger(gameIdString)
  const { openDialog } = useDialog()
  const [surrenderDialogIsOpen, setSurrenderDialogIsOpen] = useState(false)

  const openGameEndDialog = useCallback(
    (game: FinishedGameWithMoves, user?: User) => {
      const isWhite = game.userWhite.id === user?.id
      const isBlack = game.userBlack.id === user?.id
      openDialog(
        <GameEndDialog
          userType={isWhite ? 'white' : isBlack ? 'black' : 'spectator'}
          white={game.userWhite}
          black={game.userBlack}
          result={game.status}
        />,
      )
    },
    [openDialog],
  )

  const { gameState, makeMove, status, drawAction, surrender } = useChessGame(
    openGameEndDialog,
    gameId,
  )

  if (status === 'notFound' || gameId === undefined) return NotFound()
  if (status === 'error') return ErrorPage()
  if (status === 'loading' || !gameState) return Loading()

  const isPlayer = user && userIsAPlayer(gameState, user)

  return (
    <div className="mx-auto flex flex-col lg:flex-row max-w-6xl px-1 xl:px-0 w-full gap-x-20 gap-y-5 items-stretch">
      <ConfirmationDialog
        isOpen={surrenderDialogIsOpen}
        onClose={() => setSurrenderDialogIsOpen(false)}
        onConfirm={surrender}
        title="Are you sure you want to surrender?"
        message="This action cannot be undone."
      />
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
            <DrawOfferSection gameState={gameState} drawAction={drawAction} />
            {isPlayer && (
              <div className="flex justify-between mx-2 mt-2">
                <ChessGameButton
                  tooltipText="Surrender"
                  onClick={(event) => {
                    event.stopPropagation()
                    setSurrenderDialogIsOpen(true)
                  }}
                  icon={FaFlag}
                />
                {!gameState.drawOfferUser && (
                  <ChessGameButton
                    tooltipText="Request Draw"
                    onClick={drawAction}
                    icon={FaHandshake}
                  />
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

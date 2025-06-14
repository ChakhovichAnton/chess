import { FC } from 'react'
import { GameWithMoves } from '../../types'
import { useAuth } from '../../context/auth'
import { userIsAPlayer } from '../../utils/chess/chess'

interface DrawOfferSectionProps {
  gameState: GameWithMoves
  drawAction: () => void
}

const DrawOfferSection: FC<DrawOfferSectionProps> = ({
  gameState,
  drawAction,
}) => {
  const { user } = useAuth()
  if (!gameState.drawOfferUser) return null

  const isPlayer = user && userIsAPlayer(gameState, user)

  return (
    <div className="bg-background-gray px-1 py-2 text-center space-y-1">
      <p className="text-white">
        {gameState.drawOfferUser.username} has requested for a draw
      </p>
      {isPlayer && (
        <>
          {gameState.drawOfferUser.id === user.id ? (
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
  )
}

export default DrawOfferSection

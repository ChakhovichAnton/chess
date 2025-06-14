import { FC } from 'react'
import { FaChessKnight } from 'react-icons/fa'
import { GameStatus, User } from '../../types'
import { useDialog } from '../../context/dialog'

type DialogType = 'win' | 'lose' | 'draw' | 'spectator'

interface UserDescriptionProps {
  isWhite: boolean
  user?: User
}

const UserDescription: FC<UserDescriptionProps> = ({ user, isWhite }) => {
  return (
    <>
      {isWhite ? 'White' : 'Black'} {user ? <>({user.username})</> : null}
    </>
  )
}

interface GameEndDialogProps {
  userType: 'black' | 'white' | 'spectator'
  result: Exclude<GameStatus, GameStatus.ONGOING>
  white?: User
  black?: User
}

export const GameEndDialog: FC<GameEndDialogProps> = ({
  userType,
  result,
  white,
  black,
}) => {
  const { closeDialog } = useDialog()

  const dialogType: DialogType =
    result === GameStatus.DRAW
      ? 'draw'
      : userType === 'white' && result === GameStatus.WHITE_WIN
        ? 'win'
        : userType === 'white'
          ? 'lose'
          : userType === 'black' && result === GameStatus.BLACK_WIN
            ? 'win'
            : userType === 'black'
              ? 'lose'
              : 'spectator'

  return (
    <div className="min-h-[50vh] min-w-[50vh] flex flex-col justify-center items-center space-y-6 text-lg">
      <FaChessKnight size={70} />

      <h2 className="text-2xl font-semibold">
        {dialogType === 'win'
          ? 'You Won!'
          : dialogType === 'lose'
            ? 'You lost!'
            : dialogType === 'draw'
              ? 'Draw!'
              : 'Game Ended'}
      </h2>

      <div className="text-xs space-y-1 truncate">
        {result !== GameStatus.DRAW && dialogType !== 'draw' ? (
          <>
            <p>
              <span className="font-semibold">Winner: </span>
              <UserDescription
                isWhite={result === GameStatus.WHITE_WIN}
                user={result === GameStatus.WHITE_WIN ? white : black}
              />
            </p>
            <p>
              <span className="font-semibold">Loser: </span>
              <UserDescription
                isWhite={result !== GameStatus.WHITE_WIN}
                user={result !== GameStatus.WHITE_WIN ? white : black}
              />
            </p>
          </>
        ) : (
          <>
            <p>
              <span className="font-semibold">White: </span>
              {white?.username}
            </p>
            <p>
              <span className="font-semibold">Black: </span>
              {black?.username}
            </p>
          </>
        )}
      </div>

      <button
        onClick={closeDialog}
        className="hover:cursor-pointer text-white text-2xl bg-light-blue hover:brightness-110 rounded-xs py-2 px-6"
      >
        Close
      </button>
    </div>
  )
}

import { FaTimesCircle, FaTrophy, FaHandshake } from 'react-icons/fa'
import { GameStatus } from '../../types'
import { CgMediaLive } from 'react-icons/cg'
import Tooltip from '../Tooltip'

const Won = () => <FaTrophy className="text-green-500 text-xl" />

const Lost = () => <FaTimesCircle className="text-red-500 text-xl" />

const WIN_TEXT = 'Victory'
const DEFEAT_TEXT = 'Defeat'
const ONGOING_TEXT = 'Ongoing'
const DRAW_TEXT = 'Draw'

export const GameStatusDescription = (
  gameStatus: GameStatus,
  isWhite: boolean,
) => {
  switch (gameStatus) {
    case GameStatus.ONGOING:
      return (
        <Tooltip text={ONGOING_TEXT}>
          <CgMediaLive className="text-red-500 text-xl animate-spin" />
        </Tooltip>
      )
    case GameStatus.WHITE_WIN:
      return (
        <Tooltip text={isWhite ? WIN_TEXT : DEFEAT_TEXT}>
          {isWhite ? Won() : Lost()}
        </Tooltip>
      )
    case GameStatus.BLACK_WIN:
      return (
        <Tooltip text={isWhite ? DEFEAT_TEXT : WIN_TEXT}>
          {isWhite ? Lost() : Won()}
        </Tooltip>
      )
    case GameStatus.DRAW:
      return (
        <Tooltip text={DRAW_TEXT}>
          <FaHandshake className="text-gray-500 text-xl" />
        </Tooltip>
      )
  }
}

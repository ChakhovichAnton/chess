import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { GameStatus } from '../types'
import { FaEquals } from 'react-icons/fa6'
import { CgMediaLive } from 'react-icons/cg'

const Won = () => <FaCheckCircle className="text-green-500 text-xl" />

const Lost = () => <FaTimesCircle className="text-red-500 text-xl" />

export const GameStatusDescription = (
  gameStatus: GameStatus,
  isWhite: boolean,
) => {
  switch (gameStatus) {
    case GameStatus.ONGOING:
      return <CgMediaLive className="text-red-500 text-xl animate-spin" />
    case GameStatus.WHITE_WIN:
      return isWhite ? Won() : Lost()
    case GameStatus.BLACK_WIN:
      return isWhite ? Lost() : Won()
    case GameStatus.DRAW:
      return <FaEquals className="text-gray-500 text-xl" />
  }
}

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Game } from '../../types'
import { GameStatusDescription } from './GameStatus'

const TABLE_COLUMNS = ['Status', 'Players', 'Date', 'Moves']

interface GameTableProps {
  games: Game[]
  userId: number
}

const ChessGameTable: FC<GameTableProps> = ({ games, userId }) => {
  const navigate = useNavigate()

  const onClick = (gameId: number) => {
    navigate(`/game/${gameId}`, { replace: true })
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-background-gray-medium">
          <tr>
            {TABLE_COLUMNS.map((column) => (
              <th
                key={column}
                className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              onClick={() => onClick(game.id)}
              key={game.id}
              className="bg-background-gray-medium text-white border-black border-t-[1px] hover:bg-background-gray-light hover:cursor-pointer"
            >
              <td className="pl-6">
                {GameStatusDescription(
                  game.status,
                  userId === game.userWhite.id,
                )}
              </td>
              <td className="pl-6 py-2 flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-[2px]"></div>
                  <a
                    href={`/profile/${game.userWhite.id}`}
                    className="hover:underline"
                  >
                    {game.userWhite.username}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-black rounded-[2px]"></div>
                  <a
                    href={`/profile/${game.userBlack.id}`}
                    className="hover:underline"
                  >
                    {game.userBlack.username}
                  </a>
                </div>
              </td>
              <td className="pl-6">
                {new Date(game.createdAt).toLocaleDateString('fi')}
              </td>
              <td className="pl-6">{game.moveCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ChessGameTable

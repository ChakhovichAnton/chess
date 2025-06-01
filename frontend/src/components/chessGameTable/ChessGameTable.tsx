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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-200">
          <tr>
            {TABLE_COLUMNS.map((column) => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              onClick={() => navigate(`/game/${game.id}`, { replace: true })}
              key={game.id}
              className="bg-white hover:bg-gray-100 hover:cursor-pointer border-t-[1px]"
            >
              <td className="pl-6">
                {GameStatusDescription(
                  game.status,
                  userId === game.userWhite.id,
                )}
              </td>
              <td className="pl-6 py-2 flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white border rounded-[2px]"></div>
                  {game.userWhite.username}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-black border rounded-[2px]"></div>
                  {game.userBlack.username}
                </div>
              </td>
              <td className="pl-6">
                {new Date(game.createdAt).toLocaleDateString()}
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

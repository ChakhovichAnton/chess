import { useEffect, useState } from 'react'
import api from '../utils/axios'
import { useAuth } from '../contexts/AuthContext'
import { Game } from '../types'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { GameStatusDescription } from './GameStatus'

const TABLE_COLUMNS = ['Status', 'Players', 'Date', 'Moves']

const GameTable = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getGames = async () => {
      if (authLoading) return

      try {
        if (user) {
          const res = await api.get(`/api/chess/games/user/${user.id}/`)
          setGames(res.data)
        }
      } catch (e) {}
      setLoading(false)
    }

    getGames()
  }, [authLoading])

  if (loading || !user) return null

  return (
    <div className="mt-16 bg-white rounded-md">
      <h2 className="text-3xl font-semibold px-5 py-2">Previous Games</h2>

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
                    user.id === game.userWhite.id,
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
                  {new Date(game.createdAt).toDateString()}
                </td>
                <td className="pl-6">{game.moveCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <a
          className="border-t-[1px] w-full px-5 py-2 flex justify-between hover:bg-gray-100 rounded-b-md"
          href="/profile"
        >
          <p>See all games</p>
          <MdKeyboardArrowRight className="shrink-0" size={30} />
        </a>
      </div>
    </div>
  )
}

export default GameTable

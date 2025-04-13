import { useEffect, useState } from 'react'
import api from '../utils/axios'
import { useAuth } from '../contexts/AuthContext'
import { Game } from '../types'

const GameTable = () => {
  const { user, loading: authLoading } = useAuth()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    getGames()
  }, [authLoading])

  return (
    <div>
      <h2 className="text-3xl font-semibold">Games</h2>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          {games.map((game) => (
            <a
              href={`/game/${game.id}`}
              key={game.id}
              className="bg-slate-200 hover:bg-slate-300 items-center p-2 w-full grid grid-cols-3 rounded"
            >
              <p>{game.status}</p>
              <div className="flex flex-col">
                <p>White: {game.userWhite.username}</p>
                <p>Black: {game.userBlack.username}</p>
              </div>
              <p>{new Date(game.createdAt).toDateString()}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default GameTable

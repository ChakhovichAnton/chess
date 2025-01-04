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
      <h2>Games</h2>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <>
          {games.map((game) => (
            <a href={`/game/${game.id}`} key={game.id}>
              White: {game.userWhite.username}; Black: {game.userBlack.username}
              ; Status: {game.status}
            </a>
          ))}
        </>
      )}
    </div>
  )
}

export default GameTable

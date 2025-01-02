import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/axios'
import NotFound from './NotFound'
import Chessboard from './Chessboard'

const Game = () => {
  const { id: gameId } = useParams()
  if (!gameId) return NotFound()

  const [status, setStatus] = useState<'loading' | 'ready'>('loading')

  const getGameStatus = async () => {
    const result = await api.get(`/api/chess/game/${gameId}/`)

    console.log(result)
  }

  useEffect(() => {
    getGameStatus()
  }, [])

  return (
    <div>
      <Chessboard />
    </div>
  )
}

export default Game

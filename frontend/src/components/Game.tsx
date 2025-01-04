import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/axios'
import NotFound from './NotFound'
import Chessboard from './Chessboard'
import { ChessProvider } from '../contexts/ChessContext'
import { isAxiosError } from 'axios'
import ErrorPage from './ErrorPage'
import Loading from './Loading'
import { GameStatus, Game as GameType } from '../types'

type Status = 'loading' | 'live' | 'finished' | 'error' | 'notFound'

const Game = () => {
  const { id: gameId } = useParams()
  const [status, setStatus] = useState<Status>(gameId ? 'loading' : 'notFound')
  const [finishedGame, setFinishedGame] = useState<GameType | undefined>(
    undefined,
  )

  const getGameStatus = async () => {
    try {
      const result = await api.get(`/api/chess/game/${gameId}/`)
      const game = result.data as GameType

      if (game.status === GameStatus.ONGOING) {
        setStatus('live')
      } else {
        setFinishedGame(game)
        setStatus('finished')
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        setStatus('notFound')
        return
      }
      setStatus('error')
    }
  }

  useEffect(() => {
    getGameStatus()
  }, [])

  if (status === 'loading') return Loading()
  if (status === 'notFound' || !gameId) return NotFound()
  if (status === 'error') return ErrorPage()

  if (status === 'finished') {
    return <div>Game finished</div>
  }

  return (
    <ChessProvider gameId={gameId}>
      <Chessboard />
    </ChessProvider>
  )
}

export default Game

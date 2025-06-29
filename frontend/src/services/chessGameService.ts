import { GameWithMoves, PaginatedGames, TimeControl } from '../types'
import api from '../utils/axios'

export const getChessGame = async (gameId: number) => {
  const result = await api.get(`/api/chess/game/${gameId}/`)
  return result.data as GameWithMoves
}

export const getPaginatedGames = async (userId: number, page: number) => {
  const res = await api.get(`/api/chess/games/user/${userId}/?page=${page}`)
  return res.data as PaginatedGames
}

export const getTimeControls = async () => {
  const res = await api.get('/api/chess/time-control')
  return res.data as TimeControl[]
}

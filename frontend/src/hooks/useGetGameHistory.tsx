import { useState, useEffect } from 'react'
import api from '../utils/axios'
import { Game, PaginatedGames } from '../types'
import { isAxiosError } from 'axios'

interface GamePageData {
  games: Game[]
  page: number
  pageCount: number
  gameCount: number
}

type Status = 'loading' | 'success' | 'notFound' | 'error'

export const useGetGameHistory = (userId: number) => {
  const [status, setStatus] = useState<Status>('loading')
  const [gamePageData, setGamePageData] = useState<GamePageData | undefined>(
    undefined,
  )

  const getGames = async (page: number = 1) => {
    setStatus('loading')
    try {
      const res = await api.get(`/api/chess/games/user/${userId}/?page=${page}`)
      const data = res.data as PaginatedGames
      if (data.results.length > 0 && data.currentPage) {
        setGamePageData({
          games: data.results,
          page: data.currentPage,
          pageCount: data.pageCount,
          gameCount: data.count,
        })
        setStatus('success')
      } else {
        setStatus('notFound')
      }
    } catch (e) {
      if (isAxiosError(e) && e.status === 404) {
        setStatus('notFound')
      } else {
        setStatus('error')
      }
    }
  }

  useEffect(() => {
    getGames()
  }, [userId])

  return { status, getGames, gamePageData }
}

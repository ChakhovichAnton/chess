import { useEffect, useState, PropsWithChildren, useCallback } from 'react'
import { PageStatus } from '../../types'
import { ChessGameContext } from './chessGameContext'
import { GamePageData } from './chessGameTypes'
import { isAxiosError } from 'axios'
import { getPaginatedGames } from '../../services/chessGameService'

interface ChessGameProviderProps extends PropsWithChildren {
  userId?: number
}

export const ChessGameProvider = (props: ChessGameProviderProps) => {
  const [status, setStatus] = useState<PageStatus>('loading')
  const [gamePageData, setGamePageData] = useState<GamePageData | undefined>(
    undefined,
  )

  const getGames = useCallback(
    async (page: number = 1) => {
      if (props.userId === undefined) {
        setStatus('notFound')
        return
      }

      setStatus('loading')
      try {
        const data = await getPaginatedGames(props.userId, page)
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
    },
    [props.userId],
  )

  useEffect(() => {
    getGames()
  }, [getGames])

  return (
    <ChessGameContext.Provider value={{ status, gamePageData, getGames }}>
      {props.children}
    </ChessGameContext.Provider>
  )
}

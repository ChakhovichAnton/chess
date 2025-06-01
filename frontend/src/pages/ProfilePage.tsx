import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import ErrorPage from './specialPages/ErrorPage'
import Loading from './specialPages/Loading'
import { validateInteger } from '../utils/validators/integer'
import { useEffect, useState } from 'react'
import api from '../utils/axios'
import { Game, PaginatedGames } from '../types'
import { CgProfile } from 'react-icons/cg'
import Pagination from '../components/Pagination'
import ChessGameTable from '../components/chessGameTable/ChessGameTable'

type Status = 'notFound' | 'error' | 'loading' | 'success'

const ProfilePage = () => {
  // Validate gameId
  const { id: userIdString } = useParams()
  const userId = validateInteger(userIdString)
  if (userId === undefined) return NotFound()

  const [status, setStatus] = useState<Status>('loading')
  const [games, setGames] = useState<Game[] | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [gameCount, setGameCount] = useState(0)

  const getGames = async (page: number = 1) => {
    try {
      const res = await api.get(`/api/chess/games/user/${userId}/?page=${page}`)
      const data = res.data as PaginatedGames
      if (data.results.length === 0) {
        setStatus('notFound')
      } else {
        setGameCount(data.count)
        setPageCount(data.pageCount)
        setPage(data.currentPage)
        setGames(data.results)
        setStatus('success')
      }
    } catch (e) {
      setStatus('error')
    }
  }

  useEffect(() => {
    getGames()
  }, [])

  if (status === 'notFound') return NotFound()
  if (status === 'error') return ErrorPage()
  if (status === 'loading') return Loading()

  return (
    <div className="flex justify-center px-2 min-h-full w-full">
      <div className="max-w-6xl w-full space-y-6">
        <div className="bg-background-gray p-4 flex gap-5">
          <CgProfile size={150} className="bg-white rounded" />
          <div className="flex flex-col justify-between text-white">
            <h1 className="text-3xl font-semibold">Anton</h1>
            <p>Total Games: {gameCount}</p>
          </div>
        </div>
        {games && (
          <div className="bg-background-gray p-4 flex flex-col gap-2">
            <h2 className="text-3xl font-semibold text-white">Game History</h2>
            <ChessGameTable games={games} userId={userId} />
            <Pagination
              curPage={page}
              pageCount={pageCount}
              onPageChange={async (newPage: number) => {
                setGames(undefined)
                await getGames(newPage)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage

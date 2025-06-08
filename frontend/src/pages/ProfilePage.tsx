import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import ErrorPage from './specialPages/ErrorPage'
import Loading from './specialPages/Loading'
import { validateInteger } from '../utils/validators/integer'
import { useEffect, useState } from 'react'
import api from '../utils/axios'
import { User } from '../types'
import { CgProfile } from 'react-icons/cg'
import Pagination from '../components/Pagination'
import ChessGameTable from '../components/chessGameTable/ChessGameTable'
import { useGetGameHistory } from '../hooks/useGetGameHistory'
import { isAxiosError } from 'axios'

type Status = 'notFound' | 'error' | 'loading' | 'success'

const ProfilePage = () => {
  // Validate gameId
  const { id: userIdString } = useParams()
  const userId = validateInteger(userIdString)

  const [status, setStatus] = useState<Status>('loading')
  const [username, setUsername] = useState<string | undefined>(undefined)
  const {
    gamePageData,
    status: gameHistoryStatus,
    getGames,
  } = useGetGameHistory(userId)

  useEffect(() => {
    if (userId === undefined) return

    const getUserData = async () => {
      setStatus('loading')
      try {
        const res = await api.get(`/api/account/user/${userId}/`)
        const user = res.data as User
        setUsername(user.username)
        setStatus('success')
      } catch (e) {
        if (isAxiosError(e) && e.status === 404) {
          setStatus('notFound')
        } else {
          setStatus('error')
        }
      }
    }

    getUserData()
  }, [userId])

  if (status === 'notFound' || userId === undefined) return NotFound()
  if (status === 'error') return ErrorPage()
  if (status === 'loading') return Loading()

  return (
    <div className="flex justify-center px-2 min-h-full w-full">
      <div className="max-w-6xl w-full space-y-6">
        <div className="relative truncate bg-background-gray p-4 flex gap-2 sm:gap-5 rounded">
          <CgProfile className="text-[50px] xs:text-[80px] sm:text-[150px] bg-white rounded shrink-0" />
          <div className="flex flex-col justify-between text-white">
            <h1 className="text-xl sm:text-3xl font-semibold">{username}</h1>
            {gamePageData && (
              <p className="text-sm xs:text-lg">
                Games played: {gamePageData.gameCount}
              </p>
            )}
          </div>
        </div>
        {gamePageData && (
          <div className="bg-background-gray p-4 flex flex-col gap-2 rounded">
            <h2 className="text-3xl font-semibold text-white">Game History</h2>
            {gameHistoryStatus === 'notFound' ? (
              <p className="text-center text-white">No games played yet</p>
            ) : gameHistoryStatus === 'error' ? (
              <p className="text-center text-white">
                Error: something went wrong
              </p>
            ) : (
              <>
                <ChessGameTable
                  games={gamePageData.games}
                  userId={userId}
                  disabled={gameHistoryStatus === 'loading'}
                />
                {gamePageData.pageCount > 1 && (
                  <Pagination
                    disabled={gameHistoryStatus === 'loading'}
                    curPage={gamePageData.page}
                    pageCount={gamePageData.pageCount}
                    onPageChange={async (newPage: number) => {
                      await getGames(newPage)
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage

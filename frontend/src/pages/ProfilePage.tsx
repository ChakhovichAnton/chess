import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import { validateInteger } from '../utils/validators/integer'
import { CgProfile } from 'react-icons/cg'
import ChessGameHistory from '../components/chessGameTable/ChessGameHistory'
import { useEffect, useState } from 'react'
import { PageStatus, User } from '../types'
import api from '../utils/axios'
import Loading from './specialPages/Loading'
import ErrorPage from './specialPages/ErrorPage'
import { isAxiosError } from 'axios'
import { useChessGame } from '../context/chessGame'

const ProfilePage = () => {
  const { id: userIdString } = useParams()
  const userId = validateInteger(userIdString)

  const [status, setStatus] = useState<PageStatus>('loading')
  const [username, setUsername] = useState<string | undefined>(undefined)
  const { gamePageData } = useChessGame()

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
        <ChessGameHistory userId={userId} />
      </div>
    </div>
  )
}

export default ProfilePage

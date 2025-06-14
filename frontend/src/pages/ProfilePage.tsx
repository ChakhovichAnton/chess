import { useParams } from 'react-router-dom'
import NotFound from './specialPages/NotFound'
import { validateInteger } from '../utils/validators/integer'
import { CgProfile } from 'react-icons/cg'
import ChessGameHistory from '../components/chessGameTable/ChessGameHistory'
import Loading from './specialPages/Loading'
import ErrorPage from './specialPages/ErrorPage'
import { useChessGame } from '../context/chessGame'
import useUserData from '../hooks/useUserData'

const ProfilePage = () => {
  const { id: userIdString } = useParams()
  const userId = validateInteger(userIdString)

  const { status, user } = useUserData(userId)
  const { gamePageData } = useChessGame()

  if (status === 'notFound' || userId === undefined) return NotFound()
  if (status === 'error') return ErrorPage()
  if (status === 'loading' || !user) return Loading()

  return (
    <div className="flex justify-center px-2 min-h-full w-full">
      <div className="max-w-6xl w-full space-y-6">
        <div className="relative truncate bg-background-gray p-4 flex gap-2 sm:gap-5 rounded">
          <CgProfile className="text-[50px] xs:text-[80px] sm:text-[150px] bg-white rounded shrink-0" />
          <div className="flex flex-col justify-between text-white">
            <h1 className="text-xl sm:text-3xl font-semibold">
              {user.username}
            </h1>
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

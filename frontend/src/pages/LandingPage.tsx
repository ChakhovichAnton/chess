import MatchWithOpponent from '../components/MatchWithOpponent'
import { useAuth } from '../contexts/AuthContext'
import FloatingChessPieces from '../components/floatingChessPieces/FloatingChessPieces'
import { NotificationProvider } from '../contexts/NotificationContext'
import { useEffect, useState } from 'react'
import ChessGameTable from '../components/chessGameTable/ChessGameTable'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { Game, PaginatedGames } from '../types'
import api from '../utils/axios'
import StaticChessboard from '../components/chess/StaticChessboard'

const LandingPage = () => {
  const { user, loading: authLoading } = useAuth()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getGames = async () => {
      if (authLoading) return

      try {
        if (user) {
          const res = await api.get(`/api/chess/games/user/${user.id}/?page=1`)
          const data = res.data as PaginatedGames
          setGames(data.results)
        }
      } catch (e) {}
      setLoading(false)
    }

    getGames()
  }, [authLoading])

  return (
    <div className="flex justify-center px-2 min-h-full w-full">
      <FloatingChessPieces />
      <div className="max-w-6xl w-full pt-16 z-1">
        <div className="flex justify-between gap-2">
          <div className="flex flex-col justify-center text-white space-y-10">
            <h1 className="flex flex-col text-8xl font-bold space-y-6 font-sans tracking-wide">
              <span>Chess</span>
              <span>Online</span>
            </h1>
            <p className="text-2xl max-w-[500px]">
              Play chess online anywhere and at anytime. Login to start playing.
            </p>
            {!authLoading && user ? (
              <NotificationProvider>
                <MatchWithOpponent />
              </NotificationProvider>
            ) : (
              <a
                href="/login"
                className="text-white text-2xl bg-light-blue hover:brightness-110 rounded-xs py-2 px-6 w-fit"
              >
                Login
              </a>
            )}
          </div>
          <div className="hidden md:flex max-w-sm lg:max-w-md xl:max-w-lg p-1 w-full h-fit bg-brown rounded-md">
            <StaticChessboard showBoardScreenWidthPx={768} />
          </div>
        </div>
        {user && !loading && (
          <div className="mt-16 bg-white rounded-md">
            <h2 className="text-3xl font-semibold px-5 py-2">Previous Games</h2>
            <ChessGameTable games={games} userId={user.id} />
            <a
              className="border-t-[1px] w-full px-5 py-2 flex justify-between hover:bg-gray-100 rounded-b-md"
              href={`/profile/${user.id}`}
            >
              <p>See all games</p>
              <MdKeyboardArrowRight className="shrink-0" size={30} />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage

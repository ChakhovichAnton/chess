import { useAuth } from '../context/auth'
import FloatingChessPieces from '../components/floatingChessPieces/FloatingChessPieces'
import ChessGameTable from '../components/chessGameTable/ChessGameTable'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { useChessGame } from '../context/chessGame'
import HeroSection from '../components/HeroSection'

const LandingPage = () => {
  const { user } = useAuth()

  const { status, gamePageData } = useChessGame()
  const showGameTable =
    user &&
    gamePageData &&
    status === 'success' &&
    gamePageData.games.length > 0

  return (
    <div className="flex justify-center px-2 min-h-full w-full">
      <FloatingChessPieces />
      <div className="max-w-6xl w-full pt-16 z-1">
        <HeroSection />
        {showGameTable && (
          <div className="mt-16 bg-white rounded-md">
            <h2 className="text-3xl font-semibold px-5 py-2">Previous Games</h2>
            <ChessGameTable games={gamePageData.games} userId={user.id} />
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

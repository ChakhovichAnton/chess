import MatchWithOpponent from '../components/MatchWithOpponent'
import GameTable from '../components/GameTable'
import { Chessboard as ReactChessboard } from 'react-chessboard'
import { FaChessKing } from 'react-icons/fa6'
import { useAuth } from '../contexts/AuthContext'

const LandingPage = () => {
  const { loading, user } = useAuth()

  return (
    <div className="flex justify-center px-2 min-h-full">
      <div className="max-w-6xl w-full pt-16">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 sm:gap-16">
          <div className="bg-background-gray-light rounded-md text-center flex flex-col items-center justify-center">
            <h1 className="flex items-center gap-5 text-5xl font-semibold mb-6 text-white">
              Play Chess Online <FaChessKing size={45} className="shrink-0" />
            </h1>

            {!loading && user ? (
              <div>
                <MatchWithOpponent />
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-white text-2xl">Log in to start playing</p>
                <a
                  href="/login"
                  className="text-white text-3xl bg-light-blue hover:brightness-110 rounded-md py-1 px-4 hover:cursor-pointer"
                >
                  Log In
                </a>
              </div>
            )}
          </div>
          <div className="max-w-sm p-1 bg-amber-950 rounded-md">
            <ReactChessboard
              // Static chessboard
              onSquareClick={() => {}}
              areArrowsAllowed={false}
              arePiecesDraggable={false}
              showBoardNotation={false}
            />
          </div>
        </div>
        <GameTable />
      </div>
    </div>
  )
}

export default LandingPage

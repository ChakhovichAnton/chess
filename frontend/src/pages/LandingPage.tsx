import MatchWithOpponent from '../components/MatchWithOpponent'
import GameTable from '../components/GameTable'
import { Chessboard as ReactChessboard } from 'react-chessboard'
import { useAuth } from '../contexts/AuthContext'
import FloatingChessPieces from '../components/floatingChessPieces/FloatingChessPieces'
import { NotificationProvider } from '../contexts/NotificationContext'

const LandingPage = () => {
  const { loading, user } = useAuth()

  return (
    <div className="flex justify-center px-2 min-h-full">
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
            {!loading && user ? (
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

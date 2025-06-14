import { FC } from 'react'
import Pagination from '../Pagination'
import ChessGameTable from './ChessGameTable'
import { useChessGame } from '../../context/chessGame'

interface ChessGameHistoryProps {
  userId: number
}

const ChessGameHistory: FC<ChessGameHistoryProps> = ({ userId }) => {
  const { status, gamePageData, getGames } = useChessGame()

  if (!gamePageData || status === 'error') return null

  return (
    <div className="bg-background-gray p-4 flex flex-col gap-2 rounded">
      <h2 className="text-3xl font-semibold text-white">Game History</h2>
      {status === 'notFound' ? (
        <p className="text-center text-white">No games played yet</p>
      ) : (
        <>
          <ChessGameTable
            games={gamePageData.games}
            userId={userId}
            disabled={status === 'loading'}
          />
          {gamePageData.pageCount > 1 && (
            <Pagination
              disabled={status === 'loading'}
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
  )
}

export default ChessGameHistory

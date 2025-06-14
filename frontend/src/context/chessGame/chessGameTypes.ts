import { Game, PageStatus } from '../../types'

export interface GamePageData {
  games: Game[]
  page: number
  pageCount: number
  gameCount: number
}

export interface ChessGameContextType {
  status: PageStatus
  gamePageData?: GamePageData
  getGames: (page?: number) => Promise<void>
}

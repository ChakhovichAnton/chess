export interface User {
  id: number
  username: string
}

export interface TokenUser extends User {
  exp: number
}

export enum GameStatus {
  ONGOING = 'O',
  WHITE_WIN = 'W',
  BLACK_WIN = 'B',
  DRAW = 'D',
}

export type GameEndStatus = Exclude<GameStatus, GameStatus.ONGOING>

export enum ClockStatus {
  WHITE_RUNNING = 'W',
  BLACK_RUNNING = 'B',
  PAUSED = 'P',
}

export type TimeControlCategory = 'bullet' | 'rapid' | 'blitz'

export interface Move {
  createdAt: string
  game: number
  id: number
  moveText: string
  user: number
  userTimeLeftMs: number
}

export interface TimeControl {
  category: TimeControlCategory
  id: number
  incrementSeconds: number
  minutes: number
  name: string
}

export interface ChessClock {
  id: number
  game: number
  lastStartedAt: string
  running: ClockStatus
  whiteTimeMs: number // The current number of milliseconds on the clock of the black white
  blackTimeMs: number // The current number of milliseconds on the clock of the black player
  timeControl: TimeControl
}

export interface Game {
  id: number
  moveCount: number
  userWhite: User
  userBlack: User
  createdAt: string
  fen: string
  status: GameStatus
  clock: ChessClock
}

export interface PaginatedGames {
  count: number
  pageCount: number
  currentPage?: number
  results: Game[]
}

export interface GameWithMoves extends Omit<Game, 'moveCount'> {
  chessMoves: Move[]
  drawOfferUser: null | User // null means that there is no active draw offer
}

export interface FinishedGameWithMoves extends GameWithMoves {
  status: GameEndStatus
}

export type BoardOrientation = 'white' | 'black'

export type PageStatus = 'notFound' | 'error' | 'loading' | 'success'

export type ChessGameHookStatus =
  | 'loading'
  | 'live'
  | 'finished'
  | 'error'
  | 'notFound'

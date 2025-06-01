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

export interface Move {
  createdAt: string
  game: number
  id: number
  moveText: string
  user: number
}

export interface Game {
  id: number
  moveCount: number
  userWhite: User
  userBlack: User
  createdAt: string
  fen: string
  status: GameStatus
}

export interface PaginatedGames {
  count: number
  pageCount: number
  currentPage?: number
  results: Game[]
}

export interface GameWithMoves extends Omit<Game, 'moveCount'> {
  chessMoves: Move[]
}

export type BoardOrientation = 'white' | 'black'

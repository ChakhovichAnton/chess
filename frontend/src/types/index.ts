export interface User {
  id: string
  username: string
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
  chessMoves: Move[]
  userWhite: User
  userBlack: User
  createdAt: string
  fen: string
  status: GameStatus
}

export type BoardOrientation = 'white' | 'black'

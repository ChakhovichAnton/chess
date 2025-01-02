import { Chess } from 'chess.js'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import MatchWithOpponent from './MatchWithOpponent'

const chess = new Chess()

const Chessboard = () => {
  const { logout, user } = useAuth()
  const [moveInput, setMoveInput] = useState('')
  const [boardAscii, setBoardAscii] = useState(chess.ascii())

  return (
    <div>
      <p>Username: {user?.username}</p>
      <button onClick={logout}>Logout</button>
      <MatchWithOpponent />
      <pre>{boardAscii}</pre>
      <p>Moves: {chess.moves().reduce((m1, m2) => m1 + ' ' + m2)}</p>
      <input
        value={moveInput}
        onChange={(e) => setMoveInput(e.target.value)}
        placeholder="Input chess move"
      />
      <button
        onClick={() => {
          chess.move(moveInput)
          setBoardAscii(chess.ascii())
        }}
      >
        Move
      </button>
    </div>
  )
}

export default Chessboard

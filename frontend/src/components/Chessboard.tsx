import { Chess } from 'chess.js'
import { useState } from 'react'

const chess = new Chess()

const Chessboard = () => {
  const [moveInput, setMoveInput] = useState('')
  const [boardAscii, setBoardAscii] = useState(chess.ascii())

  return (
    <div>
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

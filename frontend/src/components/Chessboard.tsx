import { useEffect, useState } from 'react'
import { useChess } from '../contexts/ChessContext'

const Chessboard = () => {
  const { makeMove, chess } = useChess()
  const [moveInput, setMoveInput] = useState('')
  const [boardAscii, setBoardAscii] = useState(chess.ascii())

  useEffect(() => {
    setBoardAscii(chess.ascii())
  }, [chess])

  return (
    <div>
      <pre>{boardAscii}</pre>
      <p>Moves: {chess.moves().reduce((m1, m2) => m1 + ' ' + m2)}</p>
      <input
        value={moveInput}
        onChange={(e) => setMoveInput(e.target.value)}
        placeholder="Input chess move"
      />
      <button onClick={() => makeMove(moveInput)}>Move</button>
    </div>
  )
}

export default Chessboard

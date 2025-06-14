import { useState, useEffect } from 'react'
import { BoardOrientation, GameWithMoves } from '../types'
import { useAuth } from '../context/auth'

const useChessBoardSettings = (game: GameWithMoves) => {
  const { loading, user } = useAuth()
  // Default to white while setting the actual orientation in the useEffect
  const [boardOrientation, setBoardOrientation] =
    useState<BoardOrientation>('white')
  const [boardSize, setBoardSize] = useState(400)

  const [showValidMoves, setShowValidMoves] = useState(true)

  const toggleShowValidMoves = () => setShowValidMoves((prev) => !prev)
  const toggleBoardOrientation = () => {
    setBoardOrientation((prev) => (prev === 'black' ? 'white' : 'black'))
  }

  useEffect(() => {
    if (loading) return
    const isBlack = user?.id === game.userBlack.id

    setBoardOrientation(isBlack ? 'black' : 'white')
  }, [game.userBlack, user, loading])

  useEffect(() => {
    const updateSize = () => {
      const maxHeight = Math.max(window.innerHeight - 225, 300)
      const maxWidth = Math.max(window.innerWidth - 100, 300)
      setBoardSize(Math.min(maxHeight, maxWidth))
    }
    updateSize()

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return {
    boardOrientation,
    boardSize,
    showValidMoves,
    toggleShowValidMoves,
    toggleBoardOrientation,
  }
}

export default useChessBoardSettings

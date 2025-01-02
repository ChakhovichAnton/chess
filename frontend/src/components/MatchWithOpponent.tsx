import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'

type Status = 'connecting' | 'searching' | 'startSearch'

const MatchWithOpponent = () => {
  const socketRef = useRef<WebSocket | undefined>(undefined)
  const [status, setStatus] = useState<Status>('startSearch')

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = undefined
      }
    }
  }, [])

  const navigate = useNavigate()

  const handleClick = () => {
    if (socketRef.current === undefined) {
      const ws = new WebSocket(
        `ws://localhost:8000/ws/match/?token=${localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)}`,
      )
      setStatus('connecting')

      ws.onopen = () => setStatus('searching')
      ws.onclose = () => setStatus('startSearch')
      ws.onerror = () => {} // TODO: Toast
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        navigate(`/game/${data.gameId}`)
      }

      socketRef.current = ws
      return
    }

    socketRef.current.close()
    socketRef.current = undefined
  }

  return (
    <div>
      <h2>Find Opponent</h2>
      <p>{status}</p>
      <button disabled={status === 'connecting'} onClick={handleClick}>
        {status === 'startSearch' ? 'Find opponent' : 'Cancel finding'}
      </button>
    </div>
  )
}

export default MatchWithOpponent

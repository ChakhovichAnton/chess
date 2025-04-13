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
    <div className="h-full rounded-xl bg-slate-200 p-5 flex flex-col items-center justify-center gap-5">
      <h2 className="text-3xl font-semibold">Find Opponent</h2>
      <button
        disabled={status === 'connecting'}
        onClick={handleClick}
        className="hover:cursor-pointer p-3 rounded-md border bg-green-500 hover:bg-green-400"
      >
        {status === 'startSearch' ? 'Find opponent' : 'Cancel finding'}
      </button>
    </div>
  )
}

export default MatchWithOpponent

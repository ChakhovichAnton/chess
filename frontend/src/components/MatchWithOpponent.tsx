import { useNavigate } from 'react-router-dom'
import { UseWebSocket } from '../hooks/useWebSocket'

const MatchWithOpponent = () => {
  const navigate = useNavigate()
  const { connect, disconnect, status } = UseWebSocket(
    'match',
    (event) => navigate(`/game/${JSON.parse(event.data).gameId}`), // onMessage
  )

  const handleClick = () => {
    // In case the user clicks the button twice in a row on accident
    if (status === 'loading') return

    if (status === 'connected') {
      disconnect()
      return
    }
    connect()
  }

  return (
    <div>
      {status === 'connected' && (
        <p className="text-white pb-2">Looking for an opponent...</p>
      )}
      <button
        disabled={status === 'loading'}
        onClick={handleClick}
        className="hover:cursor-pointer p-3 rounded-md border bg-green-500 hover:bg-green-400"
      >
        {status === 'loading'
          ? 'Loading...'
          : status === 'connected'
            ? 'Cancel finding'
            : 'Find opponent'}
      </button>
    </div>
  )
}

export default MatchWithOpponent

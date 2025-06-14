import { useNavigate } from 'react-router-dom'
import useWebSocket from '../hooks/useWebSocket'
import Dialog from './dialog/Dialog'

const MatchWithOpponent = () => {
  const navigate = useNavigate()
  const { connect, disconnect, status } = useWebSocket(
    'match',
    (event) => navigate(`/game/${JSON.parse(event.data).gameId}`), // onMessage
  )

  const handleConnectClick = () => {
    if (status == 'error' || status === 'disconnected') {
      connect()
    }
  }

  const handleDisconnectClick = () => {
    if (status === 'connected') {
      disconnect()
    }
  }

  return (
    <div>
      <button
        disabled={status === 'loading'}
        onClick={handleConnectClick}
        className="hover:cursor-pointer text-white text-2xl bg-light-blue hover:brightness-110 rounded-xs py-2 px-6 w-fit"
      >
        {status === 'loading'
          ? 'Loading...'
          : status === 'connected'
            ? 'Searching for an opponent...'
            : 'Find Opponent'}
      </button>
      <Dialog isOpen={status === 'connected'} onClose={disconnect}>
        <div className="min-h-[50vh] min-w-[50vh] flex flex-col justify-center items-center space-y-6 text-lg font-medium">
          <img src="loading.svg" alt="Loading spinner" />
          <p className="text-gray-700 mb-10">
            Searching for an opponent
            <span className="dot-animation"></span>
          </p>
          <button
            onClick={handleDisconnectClick}
            className="hover:cursor-pointer bg-red-500 hover:brightness-120 px-3 py-1 rounded-xs"
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </div>
  )
}

export default MatchWithOpponent

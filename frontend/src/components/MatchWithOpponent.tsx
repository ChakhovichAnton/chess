import { useNavigate } from 'react-router-dom'
import useWebSocket from '../hooks/useWebSocket'
import Dialog from './dialog/Dialog'
import { useCallback, useEffect, useState } from 'react'
import { getTimeControls } from '../services/ChessGameService'
import { TimeControl } from '../types'
import { FaChevronRight } from 'react-icons/fa'

type DialogStatus = 'closed' | 'selectTime' | 'searching' | 'cancelling'

const MatchWithOpponent = () => {
  const navigate = useNavigate()
  const [dialogStatus, setDialogStatus] = useState<DialogStatus>('closed')
  const [timeControls, setTimeControls] = useState<TimeControl[] | undefined>(
    undefined,
  )

  useEffect(() => {
    const fetchTimeControls = async () => {
      setTimeControls(await getTimeControls())
    }
    fetchTimeControls()
  }, [])

  const onMessage = useCallback(
    (event: MessageEvent) => {
      navigate(`/game/${JSON.parse(event.data).gameId}`)
    },
    [navigate],
  )

  const closeDialogCallback = useCallback(
    () => setDialogStatus('closed'),
    [setDialogStatus],
  )

  const { status, sendMessage } = useWebSocket(
    'match',
    onMessage,
    true,
    closeDialogCallback,
    closeDialogCallback,
  )

  const handleTimeControlClick = (timeControlId: number) => {
    setDialogStatus('searching')
    sendMessage({ timeControlId })
  }

  const cancelSearchClick = () => {
    setDialogStatus('closed')
  }

  return (
    <div className="text-black">
      <button
        disabled={status === 'loading' || dialogStatus !== 'closed'}
        onClick={(event) => {
          event.stopPropagation()
          setDialogStatus('selectTime')
        }}
        className="hover:cursor-pointer text-white text-2xl bg-light-blue hover:brightness-110 rounded-xs py-2 px-6 w-fit"
      >
        {status === 'loading' ? 'Loading...' : 'Find Opponent'}
      </button>
      <Dialog
        isOpen={dialogStatus !== 'closed'}
        onClose={() => setDialogStatus('closed')}
        closeDialogButton
      >
        <div className="relative min-h-[50vh] flex flex-col justify-center items-center space-y-6 text-lg font-medium">
          {dialogStatus === 'selectTime' ? (
            <>
              <h3 className="text-2xl mb-5">Select Time Control</h3>
              {timeControls ? (
                <div className="flex flex-col gap-2">
                  {timeControls.map((timeControl) => (
                    <button
                      key={timeControl.id}
                      onClick={(event) => {
                        event.stopPropagation()
                        handleTimeControlClick(timeControl.id)
                      }}
                      className="hover:cursor-pointer bg-gray-100 hover:bg-gray-300 rounded flex items-center justify-between px-2 py-0.5"
                    >
                      {timeControl.name}
                      <FaChevronRight />
                    </button>
                  ))}
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Note: </span>X + Y is X
                    minutes with an increment of Y seconds
                  </p>
                </div>
              ) : (
                <p className="text-gray-700">
                  Loading<span className="dot-animation"></span>
                </p>
              )}
            </>
          ) : (
            <>
              <img src="loading.svg" alt="Loading spinner" />
              <p className="text-gray-700 mb-10">
                Searching for an opponent
                <span className="dot-animation"></span>
              </p>
              <button
                onClick={cancelSearchClick}
                className="hover:cursor-pointer bg-red-500 hover:brightness-120 px-3 py-1 rounded-xs text-white"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </Dialog>
    </div>
  )
}

export default MatchWithOpponent

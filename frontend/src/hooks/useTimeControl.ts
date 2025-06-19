import { useEffect, useState } from 'react'
import { TimeControl } from '../types'
import { getTimeControls } from '../services/chessGameService'

const useTimeControl = () => {
  const [timeControls, setTimeControls] = useState<TimeControl[] | undefined>(
    undefined,
  )

  useEffect(() => {
    const fetchTimeControls = async () => {
      setTimeControls(await getTimeControls())
    }
    fetchTimeControls()
  }, [])

  return { timeControls }
}

export default useTimeControl

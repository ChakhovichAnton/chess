import { useEffect, useState } from 'react'
import { TimeControl } from '../types'
import { getTimeControls } from '../services/chessGameServices'

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

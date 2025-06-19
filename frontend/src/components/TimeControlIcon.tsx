import Tooltip from './Tooltip'
import { TimeControl } from '../types'
import { FaBolt } from 'react-icons/fa'
import { MdTimer } from 'react-icons/md'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { FC } from 'react'

interface TimeControlIconProps {
  timeControl: TimeControl
}

export const TimeControlIcon: FC<TimeControlIconProps> = ({ timeControl }) => {
  switch (timeControl.category) {
    case 'bullet':
      return (
        <Tooltip text={timeControl.name}>
          <FaBolt className="text-xl text-red-500" />
        </Tooltip>
      )
    case 'blitz':
      return (
        <Tooltip text={timeControl.name}>
          <MdTimer className="text-xl text-yellow-500" />
        </Tooltip>
      )
    case 'rapid':
      return (
        <Tooltip text={timeControl.name}>
          <AiOutlineClockCircle className="text-xl text-green-500" />
        </Tooltip>
      )
  }
}

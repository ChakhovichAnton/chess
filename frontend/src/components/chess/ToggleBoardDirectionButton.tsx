import { Dispatch, FC, SetStateAction } from 'react'
import { BoardOrientation } from '../../types'
import { HiArrowsUpDown } from 'react-icons/hi2'
import Tooltip from '../Tooltip'

interface ToggleBoardDirectionButtonProps {
  setBoardOrientation: Dispatch<SetStateAction<BoardOrientation>>
}

const ToggleBoardDirectionButton: FC<ToggleBoardDirectionButtonProps> = (
  props,
) => {
  const onClick = () => {
    props.setBoardOrientation((prev) => (prev === 'black' ? 'white' : 'black'))
  }

  return (
    <Tooltip text="Toggle Board Direction">
      <button
        onClick={onClick}
        className="hover:cursor-pointer bg-background-gray text-white p-0.5 rounded-md w-fit h-fit"
      >
        <HiArrowsUpDown />
      </button>
    </Tooltip>
  )
}

export default ToggleBoardDirectionButton

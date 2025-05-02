import { Dispatch, FC, SetStateAction } from 'react'
import { FiTarget } from "react-icons/fi";
import Tooltip from '../Tooltip'

interface ToggleValidMovesButtonProps {
  showValidMoves: boolean
  setShowValidMoves: Dispatch<SetStateAction<boolean>>
}

const ToggleValidMovesButton: FC<ToggleValidMovesButtonProps> = (props) => {
  const onClick = () => {
    props.setShowValidMoves((prev) => !prev)
  }

  return (
    <Tooltip
      text={props.showValidMoves ? 'Hide Valid Moves' : 'Show Valid Moves'}
    >
      <button
        onClick={onClick}
        className="hover:cursor-pointer bg-background-gray text-white p-0.5 rounded-md w-fit h-fit"
      >
        <FiTarget size={20} />
      </button>
    </Tooltip>
  )
}

export default ToggleValidMovesButton

import { FC } from 'react'
import Tooltip from '../Tooltip'
import { IconType } from 'react-icons'

interface ChessGameButtonProps {
  tooltipText: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  icon: IconType
}

const ChessGameButton: FC<ChessGameButtonProps> = ({
  tooltipText,
  onClick,
  icon,
}) => {
  return (
    <Tooltip text={tooltipText}>
      <button
        onClick={onClick}
        className="hover:cursor-pointer bg-background-gray text-white p-0.5 rounded-md w-fit h-fit"
      >
        {icon({ size: 20 })}
      </button>
    </Tooltip>
  )
}

export default ChessGameButton

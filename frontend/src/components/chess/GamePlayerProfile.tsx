import { FC } from 'react'
import { CgProfile } from 'react-icons/cg'

interface GamePlayerProfileProps {
  player: { username: string }
}

const GamePlayerProfile: FC<GamePlayerProfileProps> = (props) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-background-gray rounded">
      <CgProfile size={40} className="bg-white rounded" />
      <p className="font-medium text-white">{props.player.username}</p>
    </div>
  )
}

export default GamePlayerProfile

import { FC, useEffect, useRef } from 'react'
import { GameWithMoves } from '../../../types'
import { arrayToPairs } from '../../../utils/arrayIntoPairs'
import './movetables.css'
import MoveDescription from './MoveDescription'

interface MoveTableProps {
  game: GameWithMoves
}

const MoveTable: FC<MoveTableProps> = (props) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      // Scrolls to the bottom of the table to show the last move
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [props.game])

  return (
    <div
      ref={scrollRef}
      className="max-h-[45vh] md:max-h-[65vh] lg:h-[65vh] min-w-[250px] overflow-y-auto custom-scroll border-y-1 border-black"
    >
      <table className="w-full text-gray-200 font-medium">
        <tbody>
          {arrayToPairs(props.game.chessMoves).map((move, index) => (
            <tr
              key={move[0].id}
              className="odd:bg-background-gray-medium even:bg-background-gray-light text-center"
            >
              <td className="w-[40px]">{index + 1}.</td>
              <td>
                <MoveDescription move={move[0]} isWhite={true} />
              </td>
              <td>
                {move[1] ? (
                  <MoveDescription move={move[1]} isWhite={false} />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MoveTable

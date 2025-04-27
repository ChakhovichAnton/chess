import { FC, useEffect, useRef } from 'react'
import { GameWithMoves } from '../../types'
import { arrayToPairs } from '../../utils/arrayIntoPairs'

interface MoveTableProps {
  game?: GameWithMoves
}

const TABLE_COLUMNS = ['', 'White', 'Black'] // Empty column for move index

const MoveTable: FC<MoveTableProps> = (props) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      // Scrolls to the bottom of the table to show the last move
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [props.game])

  if (!props.game) return <></>

  return (
    <div ref={scrollRef} className="max-h-[500px] overflow-y-scroll">
      <table>
        <thead className="bg-gray-200 sticky top-0 z-1">
          <tr>
            {TABLE_COLUMNS.map((column) => (
              <th
                key={column}
                className="px-6 py-3 text-xs font-medium text-gray-700"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arrayToPairs(props.game.chessMoves).map((move, index) => (
            <tr
              key={move[0].id}
              className="bg-white hover:bg-gray-100 hover:cursor-pointer border-t-[1px]"
            >
              <td>{index + 1}.</td>
              <td className="text-center">{move[0].moveText}</td>
              {move[1] ? (
                <td className="text-center">{move[0].moveText}</td>
              ) : (
                <td></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MoveTable

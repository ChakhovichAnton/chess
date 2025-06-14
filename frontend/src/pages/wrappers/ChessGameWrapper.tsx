import { FC, PropsWithChildren } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from '../specialPages/NotFound'
import { validateInteger } from '../../utils/validators/integer'
import { ChessGameProvider } from '../../context/chessGame'

const ChessGameWrapper: FC<PropsWithChildren> = ({ children }) => {
  // Validate userId
  const { id: userIdString } = useParams()
  const userId = validateInteger(userIdString)
  if (userId === undefined) return NotFound()

  return <ChessGameProvider userId={userId}>{children}</ChessGameProvider>
}

export default ChessGameWrapper

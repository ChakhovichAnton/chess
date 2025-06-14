import { FC, PropsWithChildren } from 'react'
import { useParams } from 'react-router-dom'
import { validateInteger } from '../../utils/validators/integer'
import { ChessGameProvider } from '../../context/chessGame'
import { useAuth } from '../../context/auth'

interface ChessGameWrapperProps extends PropsWithChildren {
  userFrom: 'params' | 'auth'
}

const ChessGameWrapper: FC<ChessGameWrapperProps> = ({
  userFrom,
  children,
}) => {
  const { id: userIdString } = useParams()
  const { user } = useAuth()

  return (
    <ChessGameProvider
      userId={userFrom === 'params' ? validateInteger(userIdString) : user?.id}
    >
      {children}
    </ChessGameProvider>
  )
}

export default ChessGameWrapper

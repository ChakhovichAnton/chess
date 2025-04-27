import { FC, PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loading from '../pages/specialPages/Loading'

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return Loading()
  } else if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

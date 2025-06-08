import { createContext, useContext } from 'react'
import { User } from '../../types'

interface AuthContextType {
  user?: User
  loading: boolean
  login: (username: string, password: string) => Promise<string | true>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

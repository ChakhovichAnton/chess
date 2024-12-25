import {
  createContext,
  useEffect,
  ReactNode,
  useState,
  useContext,
} from 'react'
import { jwtDecode } from 'jwt-decode'
import { User } from '../types/models'
import api from '../utils/axios'
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from '../constants'

interface AuthContextType {
  user?: User
  login: (username: string, password: string) => Promise<string | true>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  login: async () => '',
  logout: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = (props: AuthProviderProps) => {
  const [user, setUser] = useState<undefined | User>(undefined)

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
    if (token) {
      const decoded = jwtDecode<User>(token)
      setUser(decoded)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/api/account/login/', {
        username,
        password,
      })

      const decoded = jwtDecode<User>(response.data.access)
      setUser(decoded)

      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, response.data.access)
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, response.data.refresh)

      return true
    } catch (error: any) {
      if (error.response.status === 401) return 'Invalid username or password'

      return 'An unexpected error occurred. Please try again.'
    }
  }

  const logout = () => {
    setUser(undefined)
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN)
    window.location.reload()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

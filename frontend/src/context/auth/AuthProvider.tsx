import { useEffect, useState, PropsWithChildren } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../../utils/axios'
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from '../../constants'
import { User } from '../../types'
import { refreshAccessToken } from '../../utils/accessToken'
import { validateToken } from '../../utils/accessToken'
import {
  passwordIsValid,
  usernameIsValid,
} from '../../utils/validators/userData'
import axios from 'axios'
import { AuthContext } from './authContext'

export const AuthProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<undefined | User>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const refreshToken = async () => {
      await refreshAccessToken()
      const validated = validateToken()

      if (validated?.decoded) setUser(validated.decoded)
      setLoading(false)
    }

    const validated = validateToken()
    // If token exists but it is expired, refresh the token and validate the new token
    if (validated && !validated.isValid) {
      refreshToken()
      return
    }

    if (validated?.decoded) setUser(validated.decoded)
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    if (!usernameIsValid(username)) {
      return 'Username must be at least 3 characters long'
    }
    if (!passwordIsValid(password)) {
      return 'Password must be at least 3 characters long'
    }

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
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return 'Invalid username or password'
      }
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

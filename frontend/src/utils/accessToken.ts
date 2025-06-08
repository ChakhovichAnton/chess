import { jwtDecode } from 'jwt-decode'
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from '../constants'
import axios from './axios'
import { TokenUser } from '../types'

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN)

  try {
    if (!refreshToken) throw {}

    const { data } = await axios.post('/api/account/token/refresh/', {
      refresh: refreshToken,
    })

    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, data.access)
    return data.access as string
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN)
  }
}

export const validateToken = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
  if (token) {
    const decoded = jwtDecode<TokenUser>(token)
    const now = Date.now() / 1000 // In seconds
    const isValid = decoded.exp - now > 30 // It is valid if over 30 seconds is left

    return { isValid, decoded }
  }
}

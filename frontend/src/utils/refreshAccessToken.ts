import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from '../constants'
import axios from './axios'

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN)

  try {
    if (!refreshToken) throw {}

    const { data } = await axios.post('/api/account/token/refresh/', {
      refresh: refreshToken,
    })

    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, data.access)
    return data.access as string
  } catch (err) {
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN)
  }
}

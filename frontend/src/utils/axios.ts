import axios from 'axios'
import {
  LOCAL_STORAGE_ACCESS_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from '../constants'

const BACKEND_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Add token to request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Use refresh token if request is denied
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN)

      if (!refreshToken) return

      try {
        const { data } = await axios.post('/api/account/token/refresh/', {
          refresh: refreshToken,
        })

        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, data.access)
        api.defaults.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
        localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN)
      }
    }

    return Promise.reject(error)
  },
)

export default api

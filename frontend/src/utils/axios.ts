import axios from 'axios'
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../constants'
import { refreshAccessToken } from './refreshAccessToken'

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

      const accessToken = await refreshAccessToken()
      if (accessToken) {
        api.defaults.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  },
)

export default api

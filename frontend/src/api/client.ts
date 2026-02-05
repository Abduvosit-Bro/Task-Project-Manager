import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { refresh } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000, // 10 seconds timeout
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
      return Promise.reject(error)
    }
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loop: if the failed request is the refresh endpoint, don't try to refresh again
      if (originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newTokens = await refresh()
        if (newTokens) {
          processQueue(null, newTokens.access)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.access}`
          }
          return api(originalRequest)
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null)
        
        // Only log out if it's an authentication error (401/403)
        // If it's a network error or server error (500), just fail the request but keep the session
        const status = (refreshError as AxiosError).response?.status
        if (status === 401 || status === 403) {
          // Clear tokens and redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getRefreshToken = () => localStorage.getItem('refresh_token')

export default api

import api, { setTokens, clearTokens, getRefreshToken } from './client'

export type AuthResponse = { access: string; refresh: string }

export const login = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  setTokens(data.access, data.refresh)
  return data
}

export const register = async (payload: {
  email: string
  password: string
  first_name?: string
  last_name?: string
  student_id?: string
  display_name?: string
  preferred_language?: string
  timezone?: string
}) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export const refresh = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null
  const { data } = await api.post<AuthResponse>('/auth/refresh', { refresh: refreshToken })
  setTokens(data.access, data.refresh)
  return data
}

export const logout = async () => {
  const refreshToken = getRefreshToken()
  if (refreshToken) {
    await api.post('/auth/logout', { refresh: refreshToken })
  }
  clearTokens()
}

export const me = async () => {
  const { data } = await api.get('/auth/me')
  return data
}

export const updateProfile = async (payload: {
  display_name?: string
  first_name?: string
  last_name?: string
  student_id?: string
  preferred_language?: string
  timezone?: string
}) => {
  const { data } = await api.patch('/auth/me', payload)
  return data
}

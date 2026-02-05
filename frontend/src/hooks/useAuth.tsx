import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'
import i18n from '../i18n'

export type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  student_id: string
  display_name: string
  preferred_language: 'ja' | 'uz'
  timezone: string
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: { email: string; password: string; display_name?: string }) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    try {
      const data = await authApi.me()
      setUser(data)
      if (data?.preferred_language) {
        void i18n.changeLanguage(data.preferred_language)
        localStorage.setItem('ui_language', data.preferred_language)
      }
    } catch (error: any) {
      // Only clear tokens if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
      // For other errors (network, 500), keep the tokens to retry later
    }
  }

  useEffect(() => {
    refreshProfile()
      .catch(() => {
        // Silently handle errors - user is just not logged in
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async (email: string, password: string) => {
    await authApi.login(email, password)
    await refreshProfile()
  }

  const register = async (payload: { email: string; password: string; display_name?: string }) => {
    await authApi.register(payload)
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

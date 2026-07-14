import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi } from '../api'
import { getToken, setToken, clearToken } from '../lib/http'
import type { User } from '../lib/types'

interface AuthState {
  user: User | null
  token: string | null
  ready: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTok] = useState<string | null>(getToken())
  const [ready, setReady] = useState(false)

  // Restore session on load
  useEffect(() => {
    const t = getToken()
    if (!t) {
      setReady(true)
      return
    }
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => clearToken())
      .finally(() => {
        setReady(true)
        setTok(getToken())
      })
  }, [])

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password)
    setToken(res.token)
    setTok(res.token)
    setUser(res.user)
  }

  const logout = () => {
    clearToken()
    setTok(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

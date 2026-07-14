import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi } from '../api'
import type { User } from '../types'

interface AuthCtx {
  user: User | null
  token: string | null
  login: (u: string, p: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('ruyi_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('ruyi_token')
    const u = localStorage.getItem('ruyi_user')
    if (t && u) {
      setToken(t)
      try {
        setUser(JSON.parse(u))
      } catch {
        /* ignore */
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const resp = await authApi.login(username, password)
    const payload = resp.data.data // AxiosResponse -> ApiResp -> { token, user }
    localStorage.setItem('ruyi_token', payload.token)
    localStorage.setItem('ruyi_user', JSON.stringify(payload.user))
    setToken(payload.token)
    setUser(payload.user)
  }

  const logout = () => {
    localStorage.removeItem('ruyi_token')
    localStorage.removeItem('ruyi_user')
    setToken(null)
    setUser(null)
  }

  return <Ctx.Provider value={{ user, token, login, logout, loading }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth must be used within AuthProvider')
  return c
}

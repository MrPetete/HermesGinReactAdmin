import axios, { type AxiosInstance } from 'axios'

// Single network seam. Base path is the Vite proxy (/api -> backend:8080).
// Every response is unwrapped from the { code, message, data } envelope.
const TOKEN_KEY = 'ruyi_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Called by the auth guard on 401. Assigned by App once react-router is mounted.
let onUnauthorized: (() => void) | null = null
export function registerUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

export interface ApiError {
  message: string
  status: number
}

const http: AxiosInstance = axios.create({ baseURL: '/api', timeout: 15000 })

http.interceptors.request.use((cfg) => {
  const t = getToken()
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

http.interceptors.response.use(
  (res) => {
    const body = res.data
    // unwrap envelope: code 0 -> data
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code !== 0) {
        return Promise.reject({ message: body.message || 'error', status: res.status } as ApiError)
      }
      res.data = body.data
    }
    return res
  },
  (err) => {
    if (err?.response?.status === 401) {
      clearToken()
      onUnauthorized?.()
    }
    const message = err?.response?.data?.message || err?.message || 'request failed'
    return Promise.reject({ message, status: err?.response?.status } as ApiError)
  },
)

export default http

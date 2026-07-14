import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ruyi_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ruyi_token')
      localStorage.removeItem('ruyi_user')
      if (location.pathname !== '/login') location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export interface ApiResp<T> {
  code: number
  message: string
  data: T
}

export default api

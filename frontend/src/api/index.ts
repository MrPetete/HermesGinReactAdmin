import http from '../lib/http'
import type { User, Document } from '../lib/types'

export const authApi = {
  login: (username: string, password: string) =>
    http.post<{ token: string; user: User }>('/auth/login', { username, password }).then((r) => r.data),
  me: () => http.get<User>('/auth/me').then((r) => r.data),
}

export interface DashboardOverview {
  stats: { users: number; documents: number; roles: Record<string, number> }
  recent_documents: Document[]
}
export const dashboardApi = {
  overview: () => http.get<DashboardOverview>('/dashboard/overview').then((r) => r.data),
  insights: () => http.get<{ insights: string }>('/dashboard/insights').then((r) => r.data),
}

export const usersApi = {
  list: (page = 1, size = 10) =>
    http.get<{ items: User[]; total: number }>('/users', { params: { page, size } }).then((r) => r.data),
}

export const documentsApi = {
  list: (page = 1, size = 20) =>
    http.get<{ items: Document[]; total: number }>('/documents', { params: { page, size } }).then((r) => r.data),
}

export const aiApi = {
  chat: (messages: { role: string; content: string }[]) =>
    http.post<{ answer: string }>('/ai/chat', { messages }).then((r) => r.data),
  search: (q: string) =>
    http.get<{ answer: string; results: Document[]; count: number }>('/ai/search', { params: { q } }).then((r) => r.data),
}

import api, { ApiResp } from './client'
import type { User } from '../types'

export type { User }

export const authApi = {
  login: (username: string, password: string) =>
    api.post<ApiResp<{ token: string; user: User }>>('/auth/login', { username, password }),
  me: () => api.get<ApiResp<User>>('/auth/me'),
  changePassword: (oldPwd: string, newPwd: string) =>
    api.post('/auth/password', { old: oldPwd, new: newPwd }),
}

export const userApi = {
  list: (page = 1, size = 10) =>
    api.get<ApiResp<{ items: User[]; total: number; page: number; size: number }>>('/users', {
      params: { page, size },
    }),
  create: (body: Partial<User> & { password: string }) => api.post('/users', body),
  update: (id: number, body: Partial<User>) => api.put(`/users/${id}`, body),
  remove: (id: number) => api.delete(`/users/${id}`),
}

export const docApi = {
  list: (page = 1, size = 10, keyword = '') =>
    api.get<ApiResp<{ items: any[]; total: number }>>('/documents', {
      params: { page, size, keyword },
    }),
  get: (id: number) => api.get<ApiResp<any>>(`/documents/${id}`),
  create: (body: { title: string; content: string; tags?: string; summary?: string }) =>
    api.post('/documents', body),
  update: (id: number, body: Partial<any>) => api.put(`/documents/${id}`, body),
  remove: (id: number) => api.delete(`/documents/${id}`),
}

export const dashboardApi = {
  overview: () => api.get<ApiResp<any>>('/dashboard/overview'),
  insights: () => api.get<ApiResp<{ insights: string }>>('/dashboard/insights'),
}

export const aiApi = {
  chat: (messages: { role: string; content: string }[]) =>
    api.post<ApiResp<{ answer: string }>>('/ai/chat', { messages }),
  search: (q: string) => api.get<ApiResp<{ answer: string; results: any[]; count: number }>>('/ai/search', { params: { q } }),
  ask: (id: number, question: string) =>
    api.post<ApiResp<{ answer: string; document: string }>>(`/ai/documents/${id}/ask`, { question }),
}

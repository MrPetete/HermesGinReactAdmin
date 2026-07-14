import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '../src/api/client'
import { authApi, userApi, docApi, dashboardApi, aiApi } from '../src/api'

// Mock the axios instance exported by the client module.
vi.mock('../src/api/client', async (importActual) => {
  const actual = await importActual<typeof import('../src/api/client')>()
  return {
    ...actual,
    default: {
      ...actual.default,
      post: vi.fn(),
      get: vi.fn(),
    },
  }
})

const mockedApi = api as unknown as {
  post: ReturnType<typeof vi.fn>
  get: ReturnType<typeof vi.fn>
}

// Backend wraps every payload: { code, message, data: T }.
// Axios returns AxiosResponse<ApiResp<T>>, so callers read resp.data.data.
const wrap = <T,>(data: T) => ({ data: { code: 0, message: 'ok', data } })

const sampleUser = { id: 1, username: 'admin', email: 'a@b.c', role: 'admin', status: 'active', created_at: '', updated_at: '' }

beforeEach(() => {
  mockedApi.post.mockReset()
  mockedApi.get.mockReset()
})

describe('api client response shape (matches real exports)', () => {
  it('authApi.login unwraps resp.data.data.token (triple-nested)', async () => {
    mockedApi.post.mockResolvedValue(wrap({ token: 'JWT123', user: sampleUser }))
    const resp = await authApi.login('admin', 'admin123')
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', { username: 'admin', password: 'admin123' })
    expect(resp.data.data.token).toBe('JWT123')
    expect(resp.data.data.user.username).toBe('admin')
  })

  it('userApi.list unwraps the { items, total } envelope', async () => {
    mockedApi.get.mockResolvedValue(wrap({ items: [sampleUser], total: 1, page: 1, size: 10 }))
    const resp = await userApi.list()
    expect(mockedApi.get).toHaveBeenCalledWith('/users', { params: { page: 1, size: 10 } })
    expect(resp.data.data.items).toHaveLength(1)
    expect(resp.data.data.items[0].role).toBe('admin')
    expect(resp.data.data.total).toBe(1)
  })

  it('docApi.create posts and unwraps (no owner_id in contract)', async () => {
    mockedApi.post.mockResolvedValue(wrap({ id: 9, title: 'T', content: 'C' }))
    const resp = await docApi.create({ title: 'T', content: 'C' })
    expect(mockedApi.post).toHaveBeenCalledWith('/documents', { title: 'T', content: 'C' })
    expect(resp.data.data.id).toBe(9)
  })

  it('dashboardApi.overview unwraps object payload', async () => {
    mockedApi.get.mockResolvedValue(wrap({ total_users: 5, total_documents: 3, active_users: 4, role_distribution: { admin: 1 } }))
    const resp = await dashboardApi.overview()
    expect(mockedApi.get).toHaveBeenCalledWith('/dashboard/overview')
    expect(resp.data.data.total_users).toBe(5)
  })

  it('aiApi.chat sends a messages array and unwraps { answer }', async () => {
    mockedApi.post.mockResolvedValue(wrap({ answer: 'hello' }))
    const resp = await aiApi.chat([{ role: 'user', content: 'hi' }])
    expect(mockedApi.post).toHaveBeenCalledWith('/ai/chat', { messages: [{ role: 'user', content: 'hi' }] })
    expect(resp.data.data.answer).toBe('hello')
  })
})

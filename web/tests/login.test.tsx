import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import Login from '../src/pages/Login'
import { AuthProvider } from '../src/context/AuthContext'
import { authApi } from '../src/api'
import type { User } from '../src/types'

// Mock the auth API so no network is touched.
vi.mock('../src/api', async (importActual) => {
  const actual = await importActual<typeof import('../src/api')>()
  return {
    ...actual,
    authApi: { ...actual.authApi, login: vi.fn() },
  }
})

// Capture navigate so we can assert redirect.
const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

const sampleUser: User = { id: 1, username: 'admin', email: 'a@b.c', role: 'admin', status: 'active', created_at: '', updated_at: '' }

beforeEach(() => {
  vi.mocked(authApi.login).mockReset()
  navigateMock.mockReset()
  localStorage.removeItem('ruyi_token')
  localStorage.removeItem('ruyi_user')
})

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Login page (auth flow)', () => {
  it('shows the brand and default credentials hint', () => {
    renderLogin()
    expect(screen.getByText(/Ruyi · AI Admin/)).toBeInTheDocument()
    expect(screen.getByText(/Default: admin \/ admin123/)).toBeInTheDocument()
  })

  it('on success: stores token+user and redirects to /dashboard', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      data: { code: 0, message: 'ok', data: { token: 'JWT123', user: sampleUser } },
    } as any)

    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }))

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/dashboard')
    })
    expect(localStorage.getItem('ruyi_token')).toBe('JWT123')
    expect(localStorage.getItem('ruyi_user')).toBe(JSON.stringify(sampleUser))
  })

  it('on failure: shows the error message and does NOT redirect', async () => {
    vi.mocked(authApi.login).mockRejectedValue({
      response: { data: { message: 'invalid credentials' } },
    })

    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/)).toBeInTheDocument()
    })
    expect(navigateMock).not.toHaveBeenCalled()
    expect(localStorage.getItem('ruyi_token')).toBeNull()
  })
})

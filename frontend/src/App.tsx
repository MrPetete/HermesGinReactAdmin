import { ConfigProvider, App as AntApp, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ruyiTheme } from './theme/theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import { registerUnauthorizedHandler } from './lib/http'
import AdminShell from './layouts/AdminShell'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import UsersPage from './pages/Users'
import DocumentsPage from './pages/Documents'
import AiChatPage from './pages/AiChat'
import SmartSearchPage from './pages/SmartSearch'
import SettingsPage from './pages/Settings'

function Guard({ children }: { children: React.ReactNode }) {
  const { token, ready } = useAuth()
  if (!ready) {
    return (
      <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: '#0a1426' }}>
        <Spin size="large" />
      </div>
    )
  }
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { token } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/*"
        element={
          <Guard>
            <AdminShell>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/ai/chat" element={<AiChatPage />} />
                <Route path="/ai/search" element={<SmartSearchPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AdminShell>
          </Guard>
        }
      />
    </Routes>
  )
}

export default function App() {
  // wire 401 -> back to login
  registerUnauthorizedHandler(() => {
    window.location.assign('/login')
  })

  return (
    <ConfigProvider theme={ruyiTheme} locale={zhCN}>
      <AntApp>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  )
}

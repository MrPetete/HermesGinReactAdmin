import { Routes, Route, Navigate } from 'react-router-dom'
import AdminShell from './layouts/AdminShell'
import DashboardPage from './pages/Dashboard'
import UsersPage from './pages/Users'
import DocumentsPage from './pages/Documents'
import AiChatPage from './pages/AiChat'
import SmartSearchPage from './pages/SmartSearch'
import SettingsPage from './pages/Settings'

// Central route table — add a feature by registering it here + a nav item in AdminShell.
export default function AppRouter() {
  return (
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
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Documents from './pages/Documents'
import AiChat from './pages/AiChat'
import SmartSearch from './pages/SmartSearch'

export default function App() {
  const { token, loading } = useAuth()
  if (loading) return <Spin size="large" style={{ position: 'fixed', top: '50%', left: '50%' }} />
  if (!token) return <Routes><Route path="/login" element={<Login />} /><Route path="*" element={<Navigate to="/login" />} /></Routes>
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="documents" element={<Documents />} />
        <Route path="ai/chat" element={<AiChat />} />
        <Route path="ai/search" element={<SmartSearch />} />
      </Route>
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

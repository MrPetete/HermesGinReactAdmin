import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Typography } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  MessageOutlined,
  SearchOutlined,
  LogoutOutlined,
  UserOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const nav = useNavigate()
  const loc = useLocation()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const items = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/users', icon: <TeamOutlined />, label: 'Users (RBAC)' },
    { key: '/documents', icon: <FileTextOutlined />, label: 'Documents' },
    { key: '/ai/chat', icon: <MessageOutlined />, label: 'AI Chat' },
    { key: '/ai/search', icon: <SearchOutlined />, label: 'Smart Search' },
  ]

  const menu = (
    <Menu
      items={[
        { key: 'me', icon: <UserOutlined />, label: user?.username || 'user', disabled: true },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Sign out', onClick: logout },
      ]}
    />
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, gap: 8 }}>
          <RobotOutlined style={{ fontSize: 22, color: '#a78bfa' }} />
          {!collapsed && <span>Ruyi AI</span>}
        </div>
        <Menu theme="dark" selectedKeys={[loc.pathname]} items={items} onClick={(e) => nav(e.key)} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 24, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <Dropdown overlay={menu} trigger={['click']}>
            <span style={{ cursor: 'pointer' }}>
              <Avatar style={{ background: '#7c3aed' }} icon={<UserOutlined />} />{' '}
              <Typography.Text strong>{user?.username}</Typography.Text>
            </span>
          </Dropdown>
        </Header>
        <Content style={{ margin: 16, padding: 24, background: '#f5f5f5', borderRadius: 8, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

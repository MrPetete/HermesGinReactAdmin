import { Layout, Menu, Avatar, Dropdown, Typography, Badge } from 'antd'
import type { MenuProps } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  RobotOutlined,
  SearchOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { tokens } from '../theme/tokens'
import AuroraBackground from '../components/common/AuroraBackground'

const { Header, Sider, Content } = Layout

const NAV: MenuProps['items'] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
  { key: '/users', icon: <TeamOutlined />, label: '用户管理' },
  { key: '/documents', icon: <FileTextOutlined />, label: '文档中心' },
  { key: '/ai/chat', icon: <RobotOutlined />, label: 'AI 助手' },
  { key: '/ai/search', icon: <SearchOutlined />, label: '智能搜索' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
]

// Fixed shell: 56px top bar, 220px sidebar, scrollable 100vh main. (Pete's saved layout.)
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const active: string =
    NAV?.find((n) => loc.pathname === n?.key || loc.pathname.startsWith(`${n?.key}/`))?.key?.toString() ??
    '/dashboard'

  return (
    <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: 'transparent' }}>
      <AuroraBackground />

      <Sider
        width={tokens.layout.sidebarW}
        collapsedWidth={tokens.layout.sidebarWCollapsed}
        collapsed={collapsed}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 20,
          background: 'rgba(10, 20, 38, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: `1px solid ${tokens.color.border}`,
        }}
      >
        <div
          style={{
            height: tokens.layout.headerH,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 18px',
            borderBottom: `1px solid ${tokens.color.border}`,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: tokens.color.gold, letterSpacing: 2 }}>如</span>
          {!collapsed && (
            <span style={{ fontWeight: 700, fontSize: 16, color: tokens.color.text, letterSpacing: 1 }}>
              如意 · AI 管理
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[active]}
          items={NAV}
          onClick={(e) => nav(e.key)}
          style={{ borderInlineEnd: 'none', background: 'transparent', paddingTop: 8 }}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? tokens.layout.sidebarWCollapsed : tokens.layout.sidebarW,
          height: '100vh',
          transition: 'margin-left 0.2s',
          background: 'transparent',
        }}
      >
        <Header
          style={{
            height: tokens.layout.headerH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${tokens.layout.contentPad}px`,
            borderBottom: `1px solid ${tokens.color.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(10, 20, 38, 0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ cursor: 'pointer', fontSize: 18, color: tokens.color.text }} onClick={() => setCollapsed((c) => !c)}>
              <MenuFoldOutlined />
            </span>
            <Typography.Text style={{ color: tokens.color.text, fontSize: 15 }}>如意管理平台</Typography.Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Badge count={3} size="small" color={tokens.color.jade}>
              <BellOutlined style={{ fontSize: 18, color: tokens.color.text }} />
            </Badge>
            <Dropdown menu={{ items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <Avatar size={32} style={{ background: tokens.color.jade, color: tokens.color.canvas, fontWeight: 700 }}>
                  如
                </Avatar>
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ color: tokens.color.text, fontSize: 13 }}>Admin</div>
                  <div style={{ color: tokens.color.gold, fontSize: 11 }}>超级管理员</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ height: 'calc(100vh - 56px)', background: 'transparent' }}>{children}</Content>
      </Layout>
    </Layout>
  )
}

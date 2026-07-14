import { Layout, Menu, Avatar, Dropdown, Typography, Badge } from 'antd'
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
import { user } from '../mock/data'
import { accent } from '../theme'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '工作台' },
  { key: 'users', icon: <TeamOutlined />, label: '用户管理' },
  { key: 'documents', icon: <FileTextOutlined />, label: '文档中心' },
  { key: 'ai-chat', icon: <RobotOutlined />, label: 'AI 助手' },
  { key: 'search', icon: <SearchOutlined />, label: '智能搜索' },
  { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sider
        width={220}
        collapsedWidth={64}
        collapsed={collapsed}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: `1px solid ${accent.ink}`,
        }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 18px',
            borderBottom: `1px solid ${accent.ink}`,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: accent.gold,
              letterSpacing: 2,
            }}
          >
            如
          </span>
          {!collapsed && (
            <span style={{ fontWeight: 700, fontSize: 16, color: accent.cloud, letterSpacing: 1 }}>
              如意 · AI 管理
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selected]}
          items={menuItems}
          onClick={(e) => setSelected(e.key)}
          style={{ borderInlineEnd: 'none', background: 'transparent', paddingTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 64 : 220, height: '100vh', transition: 'margin-left .2s' }}>
        <Header
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: `1px solid ${accent.ink}`,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{ cursor: 'pointer', fontSize: 18, color: accent.cloud }}
              onClick={() => setCollapsed((c) => !c)}
            >
              <MenuFoldOutlined />
            </span>
            <Typography.Text style={{ color: accent.cloud, fontSize: 15 }}>
              如意管理平台
            </Typography.Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Badge count={3} size="small" color={accent.jade}>
              <BellOutlined style={{ fontSize: 18, color: accent.cloud }} />
            </Badge>
            <Dropdown
              menu={{
                items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }],
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <Avatar
                  size={32}
                  style={{ background: accent.jade, color: accent.ink, fontWeight: 700 }}
                >
                  {user.initials}
                </Avatar>
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ color: accent.cloud, fontSize: 13 }}>{user.name}</div>
                  <div style={{ color: accent.gold, fontSize: 11 }}>{user.role}</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            height: 'calc(100vh - 56px)',
            overflowY: 'auto',
            padding: 20,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

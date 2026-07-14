import { Card, Input, Button, Typography, Space, App as AntApp } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokens } from '../../theme/tokens'
import { useAuth } from '../../context/AuthContext'
import AuroraBackground from '../../components/common/AuroraBackground'

const { Title, Text } = Typography

export default function LoginPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()
  const { message } = AntApp.useApp()

  const submit = async () => {
    setLoading(true)
    try {
      await login(username, password)
      message.success('登录成功')
      nav('/dashboard')
    } catch (e: any) {
      message.error(e?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'grid', placeItems: 'center', position: 'relative' }}>
      <AuroraBackground />
      <Card
        className="ruyi-glass ruyi-glass-strong"
        style={{ width: 380, zIndex: 1, borderColor: tokens.color.border }}
        styles={{ body: { padding: 32 } }}
      >
        <Space direction="vertical" size={6} style={{ width: '100%', marginBottom: 22 }}>
          <Title level={2} className="ruyi-gradient-text" style={{ margin: 0, textAlign: 'center', fontWeight: 700 }}>
            如 意
          </Title>
          <Text style={{ color: tokens.color.textSecondary, display: 'block', textAlign: 'center' }}>
            AI 管理平台 · 登录
          </Text>
        </Space>

        <Space direction="vertical" size={14} style={{ width: '100%' }}>
          <Input
            size="large"
            prefix={<UserOutlined style={{ color: tokens.color.textTertiary }} />}
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={submit}
            style={{ background: 'rgba(10,20,38,0.6)', borderColor: tokens.color.border, color: tokens.color.text }}
          />
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: tokens.color.textTertiary }} />}
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={submit}
            style={{ background: 'rgba(10,20,38,0.6)', borderColor: tokens.color.border, color: tokens.color.text }}
          />
          <Button type="primary" size="large" block loading={loading} onClick={submit}>
            登 录
          </Button>
          <Text style={{ color: tokens.color.textTertiary, fontSize: 12, textAlign: 'center', display: 'block' }}>
            演示账号：admin / admin123
          </Text>
        </Space>
      </Card>
    </div>
  )
}

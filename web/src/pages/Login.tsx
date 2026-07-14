import { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onFinish = async (v: { username: string; password: string }) => {
    setErr('')
    setLoading(true)
    try {
      await login(v.username, v.password)
      nav('/dashboard')
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#7c3aed 0%,#2563eb 100%)' }}>
      <Card style={{ width: 380, boxShadow: '0 20px 50px rgba(0,0,0,.25)' }}>
        <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 16 }}>
          <RobotOutlined style={{ fontSize: 40, color: '#7c3aed' }} />
          <Typography.Title level={3} style={{ margin: 0 }}>Ruyi · AI Admin</Typography.Title>
          <Typography.Text type="secondary">Good fortune, as you wish.</Typography.Text>
        </Space>
        {err && <Alert type="error" message={err} style={{ marginBottom: 12 }} />}
        <Form layout="vertical" onFinish={onFinish} initialValues={{ username: 'admin', password: 'admin123' }}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Sign in
          </Button>
        </Form>
        <Typography.Paragraph type="secondary" style={{ marginTop: 12, fontSize: 12, textAlign: 'center' }}>
          Default: admin / admin123
        </Typography.Paragraph>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Card, Input, Button, List, Avatar, Space, Typography } from 'antd'
import { RobotOutlined, UserOutlined, SendOutlined } from '@ant-design/icons'
import { aiApi } from '../api'
import { useAuth } from '../context/AuthContext'

interface Msg { role: 'user' | 'assistant'; content: string }

export default function AiChat() {
  const { user } = useAuth()
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: `Hi ${user?.username}, I'm Ruyi. Ask me anything about your admin system.` },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const next = [...msgs, { role: 'user' as const, content: input }]
    setMsgs(next)
    setInput('')
    setLoading(true)
    try {
      const { data } = await aiApi.chat(next.map((m) => ({ role: m.role, content: m.content })))
      setMsgs([...next, { role: 'assistant', content: data.data.answer }])
    } catch (e: any) {
      setMsgs([...next, { role: 'assistant', content: 'Error: ' + (e?.response?.data?.message || 'request failed') }])
    } finally { setLoading(false) }
  }

  return (
    <Card title={<span><RobotOutlined /> AI Chat Assistant</span>} style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <List
          dataSource={msgs}
          renderItem={(m) => (
            <List.Item style={{ justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', border: 'none' }}>
              <Space style={{ maxWidth: '80%' }}>
                {m.role === 'assistant' && <Avatar style={{ background: '#7c3aed' }} icon={<RobotOutlined />} />}
                <Typography.Paragraph style={{ background: m.role === 'user' ? '#7c3aed' : '#f0f0f0', color: m.role === 'user' ? '#fff' : '#000', padding: '8px 12px', borderRadius: 8, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </Typography.Paragraph>
                {m.role === 'user' && <Avatar icon={<UserOutlined />} />}
              </Space>
            </List.Item>
          )}
        />
      </div>
      <Space.Compact style={{ width: '100%', marginTop: 12 }}>
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={send}
          disabled={loading}
        />
        <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={send}>Send</Button>
      </Space.Compact>
    </Card>
  )
}

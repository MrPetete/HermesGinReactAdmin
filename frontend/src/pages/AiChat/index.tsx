import { useState } from 'react'
import { Input, Button, Avatar, Space, Typography, Spin } from 'antd'
import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import { tokens } from '../../theme/tokens'
import { seedChat, type ChatMsg } from '../../mock/ai'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import PageContainer from '../../components/common/PageContainer'

const { Text } = Typography

export default function AiChatPage() {
  const [msgs, setMsgs] = useState<ChatMsg[]>(seedChat)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)

  const send = () => {
    const q = input.trim()
    if (!q) return
    setMsgs((m) => [...m, { role: 'user', content: q }])
    setInput('')
    setBusy(true)
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { role: 'ai', content: `已收到：「${q}」。这是 mock 回复——接入真实 LLM 后此处将返回生成式答案。` },
      ])
      setBusy(false)
    }, 700)
  }

  return (
    <PageContainer>
      <FadeUp>
        <SectionTitle title="AI 助手" subtitle="如意生成式对话（mock）" />
      </FadeUp>
      <FadeUp delay={80}>
        <div className="ruyi-glass" style={{ borderRadius: tokens.radius.md, padding: 16, minHeight: 420, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'ai' && <Avatar style={{ background: tokens.color.jade, color: tokens.color.canvas }} icon={<RobotOutlined />} />}
                <div
                  className="ruyi-glass"
                  style={{
                    maxWidth: '72%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    color: tokens.color.text,
                    background: m.role === 'user' ? 'rgba(47,111,176,0.35)' : tokens.glass.bg,
                  }}
                >
                  {m.content}
                </div>
                {m.role === 'user' && <Avatar style={{ background: tokens.color.primary, color: '#fff' }} icon={<UserOutlined />} />}
              </div>
            ))}
            {busy && <Spin size="small" />}
          </div>
          <Space.Compact style={{ marginTop: 14, width: '100%' }}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={send}
              placeholder="问问如意任何问题…"
              style={{ background: 'rgba(10,20,38,0.6)', borderColor: tokens.color.border, color: tokens.color.text }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={send} loading={busy}>
              发送
            </Button>
          </Space.Compact>
        </div>
      </FadeUp>
    </PageContainer>
  )
}

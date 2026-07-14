import { Typography, Space, Tag, Divider, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { tokens } from '../../theme/tokens'
import { useAuth } from '../../context/AuthContext'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import PageContainer from '../../components/common/PageContainer'

const { Text, Paragraph } = Typography

export default function SettingsPage() {
  const { logout, user } = useAuth()
  const nav = useNavigate()

  const doLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <PageContainer>
      <FadeUp>
        <SectionTitle title="系统设置" subtitle="主题与平台配置" />
      </FadeUp>
      <FadeUp delay={80}>
        <div className="ruyi-glass" style={{ borderRadius: tokens.radius.md, padding: 20, maxWidth: 640 }}>
          <Text strong style={{ color: tokens.color.text }}>账户</Text>
          <Paragraph style={{ color: tokens.color.textSecondary, marginTop: 8 }}>
            当前登录：<Tag color="gold">{user?.username ?? '—'}</Tag> · 角色 {user?.role ?? '—'}
          </Paragraph>
          <Divider style={{ borderColor: tokens.color.border }} />
          <Text strong style={{ color: tokens.color.text }}>主题</Text>
          <Paragraph style={{ color: tokens.color.textSecondary, marginTop: 8 }}>
            当前为「如意 · 中国风科技蓝」。所有视觉变量集中在 <Tag color="cyan">theme/tokens.ts</Tag>，修改即换肤。
          </Paragraph>
          <Space wrap>
            <Tag color="blue">墨蓝画布</Tag>
            <Tag color="cyan">玉青强调</Tag>
            <Tag color="gold">鎏金点缀</Tag>
            <Tag>玻璃拟态</Tag>
            <Tag>极光背景</Tag>
          </Space>
          <Divider style={{ borderColor: tokens.color.border }} />
          <Button danger icon={<LogoutOutlined />} onClick={doLogout}>退出登录</Button>
        </div>
      </FadeUp>
    </PageContainer>
  )
}

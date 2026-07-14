import { Row, Col, Card, Statistic, Typography, List, Tag, Space, Avatar } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  RobotOutlined,
  TeamOutlined,
  FileTextOutlined,
  MessageOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import AdminLayout from '../layout/AdminLayout'
import { stats, trend, recentActivity, aiInsight, type StatItem } from '../mock/data'
import { accent } from '../theme'

const { Title, Text, Paragraph } = Typography

const iconFor: Record<string, React.ReactNode> = {
  users: <TeamOutlined />,
  docs: <FileTextOutlined />,
  active: <MessageOutlined />,
  insights: <BulbOutlined />,
}

function StatCard({ s }: { s: StatItem }) {
  const up = s.tone === 'up'
  return (
    <Card
      variant="borderless"
      style={{ borderTop: `2px solid ${up ? accent.jade : accent.gold}` }}
      styles={{ body: { padding: 18 } }}
    >
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <div>
          <Text style={{ color: accent.cloud, opacity: 0.75, fontSize: 13 }}>{s.title}</Text>
          <div style={{ marginTop: 6 }}>
            <Statistic
              value={s.value}
              suffix={s.suffix}
              valueStyle={{ color: accent.cloud, fontWeight: 700, fontSize: 26 }}
            />
          </div>
        </div>
        <Avatar
          shape="square"
          size={44}
          style={{ background: 'rgba(57,197,187,.12)', color: accent.jade, fontSize: 20 }}
        >
          {iconFor[s.key]}
        </Avatar>
      </Space>
      <div style={{ marginTop: 10, fontSize: 12, color: up ? accent.jade : '#e08a8a' }}>
        {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(s.delta)}% 较上周
      </div>
    </Card>
  )
}

function TrendChart() {
  const max = Math.max(...trend.map((t) => t.value))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 180, padding: '10px 4px' }}>
      {trend.map((t) => (
        <div key={t.day} style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              height: `${(t.value / max) * 140}px`,
              background: `linear-gradient(180deg, ${accent.cyan}, ${accent.jade})`,
              borderRadius: '6px 6px 0 0',
              marginBottom: 8,
            }}
          />
          <Text style={{ color: accent.cloud, opacity: 0.7, fontSize: 12 }}>{t.day}</Text>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  return (
    <AdminLayout>
      <Title level={4} style={{ color: accent.cloud, marginTop: 0, marginBottom: 16 }}>
        工作台
      </Title>

      <Row gutter={[16, 16]}>
        {stats.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.key}>
            <StatCard s={s} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="访问趋势 · 近 7 日" variant="borderless">
            <TrendChart />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <RobotOutlined style={{ color: accent.jade }} />
                AI 洞察
              </Space>
            }
            variant="borderless"
            style={{ height: '100%' }}
          >
            <Paragraph style={{ color: accent.cloud, opacity: 0.85, lineHeight: 1.8 }}>{aiInsight}</Paragraph>
            <Tag color="cyan" style={{ marginTop: 8 }}>由 如意 AI 生成</Tag>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="最近动态" variant="borderless">
            <List
              dataSource={recentActivity}
              renderItem={(it) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ background: 'transparent', color: accent[it.tone], fontSize: 18 }}>
                        ●
                      </Avatar>
                    }
                    title={<Text style={{ color: accent.cloud }}>{it.action}</Text>}
                    description={<Text style={{ color: accent.cloud, opacity: 0.55, fontSize: 12 }}>{it.who} · {it.time}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  )
}

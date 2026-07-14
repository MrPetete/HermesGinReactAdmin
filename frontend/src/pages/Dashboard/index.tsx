import { Row, Col, Card, List, Tag, Typography, Space, Avatar, Spin } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import { tokens } from '../../theme/tokens'
import { useMock } from '../../hooks/useMock'
import { stats, trend, recentActivity, aiInsight, type StatItem } from '../../mock/dashboard'
import GlassCard from '../../components/ui/GlassCard'
import StatTile from '../../components/ui/StatTile'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import TrendBars from '../../components/charts/TrendBars'
import PageContainer from '../../components/common/PageContainer'

const { Title, Text, Paragraph } = Typography

export default function DashboardPage() {
  const { data, loading } = useMock(() => ({ stats, trend, recentActivity, aiInsight }))

  return (
    <PageContainer>
      <FadeUp>
        <div style={{ marginBottom: 18 }}>
          <Title level={3} className="ruyi-gradient-text" style={{ margin: 0, fontWeight: 700 }}>
            工作台
          </Title>
          <Text style={{ color: tokens.color.textTertiary }}>如意 AI 管理平台 · 实时概览</Text>
        </div>
      </FadeUp>

      {loading || !data ? (
        <div style={{ display: 'grid', placeItems: 'center', height: 300 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {data.stats.map((s: StatItem, i) => (
              <Col xs={24} sm={12} lg={6} key={s.key}>
                <FadeUp delay={i * 80}>
                  <StatTile title={s.title} value={s.value} delta={s.delta} icon={s.icon} />
                </FadeUp>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={16}>
              <FadeUp delay={120}>
                <GlassCard title="访问趋势 · 近 7 日">
                  <TrendBars data={data.trend} />
                </GlassCard>
              </FadeUp>
            </Col>
            <Col xs={24} lg={8}>
              <FadeUp delay={200}>
                <GlassCard
                  title={
                    <Space>
                      <RobotOutlined style={{ color: tokens.color.jade }} />
                      AI 洞察
                    </Space>
                  }
                  style={{ height: '100%' }}
                >
                  <Paragraph style={{ color: tokens.color.text, opacity: 0.85, lineHeight: 1.8, marginBottom: 12 }}>
                    {data.aiInsight}
                  </Paragraph>
                  <Tag color="cyan">由 如意 AI 生成</Tag>
                </GlassCard>
              </FadeUp>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24}>
              <FadeUp delay={260}>
                <GlassCard title="最近动态">
                  <List
                    dataSource={data.recentActivity}
                    renderItem={(it) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar style={{ background: 'transparent', color: tokens.color[it.tone], fontSize: 18 }}>●</Avatar>
                          }
                          title={<Text style={{ color: tokens.color.text }}>{it.action}</Text>}
                          description={
                            <Text style={{ color: tokens.color.textTertiary, fontSize: 12 }}>{it.who} · {it.time}</Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </GlassCard>
              </FadeUp>
            </Col>
          </Row>
        </>
      )}
    </PageContainer>
  )
}

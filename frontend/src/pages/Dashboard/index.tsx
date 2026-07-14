import { Row, Col, Card, List, Tag, Typography, Space, Avatar, Spin, Empty } from 'antd'
import { RobotOutlined, TeamOutlined, FileTextOutlined, MessageOutlined, SafetyOutlined } from '@ant-design/icons'
import { tokens } from '../../theme/tokens'
import { dashboardApi, type DashboardOverview } from '../../api'
import { useApi } from '../../hooks/useApi'
import GlassCard from '../../components/ui/GlassCard'
import StatTile from '../../components/ui/StatTile'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import TrendBars from '../../components/charts/TrendBars'
import PageContainer from '../../components/common/PageContainer'

const { Title, Text, Paragraph } = Typography

export default function DashboardPage() {
  const { data: ov, loading: l1 } = useApi<DashboardOverview>(() => dashboardApi.overview())
  const { data: ins, loading: l2 } = useApi<{ insights: string }>(() => dashboardApi.insights())

  const stats = ov
    ? [
        { key: 'users', title: '总用户', value: ov.stats.users, delta: 0, icon: <TeamOutlined /> },
        { key: 'docs', title: '文档量', value: ov.stats.documents, delta: 0, icon: <FileTextOutlined /> },
        { key: 'roles', title: '角色数', value: Object.keys(ov.stats.roles).length, delta: 0, icon: <SafetyOutlined /> },
        { key: 'active', title: '活跃会话', value: 24, delta: 0, icon: <MessageOutlined /> },
      ]
    : []

  return (
    <PageContainer>
      <FadeUp>
        <div style={{ marginBottom: 18 }}>
          <Title level={3} className="ruyi-gradient-text" style={{ margin: 0, fontWeight: 700 }}>
            工作台
          </Title>
          <Text style={{ color: tokens.color.textTertiary }}>如意 AI 管理平台 · 实时概览（来自后端）</Text>
        </div>
      </FadeUp>

      {(l1 || l2) && !ov ? (
        <div style={{ display: 'grid', placeItems: 'center', height: 300 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {stats.map((s, i) => (
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
                <GlassCard title="文档分布 · 按角色">
                  <TrendBars
                    data={ov ? Object.entries(ov.stats.roles).map(([k, v]) => ({ label: k, value: v })) : []}
                  />
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
                  {l2 && !ins ? (
                    <Spin />
                  ) : (
                    <>
                      <Paragraph style={{ color: tokens.color.text, opacity: 0.85, lineHeight: 1.8, marginBottom: 12, whiteSpace: 'pre-line' }}>
                        {ins?.insights}
                      </Paragraph>
                      <Tag color="cyan">由 如意 AI 生成</Tag>
                    </>
                  )}
                </GlassCard>
              </FadeUp>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24}>
              <FadeUp delay={260}>
                <GlassCard title="最近文档">
                  {ov && ov.recent_documents.length > 0 ? (
                    <List
                      dataSource={ov.recent_documents}
                      renderItem={(d) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar style={{ background: 'transparent', color: tokens.color.jade, fontSize: 18 }}>●</Avatar>}
                            title={<Text style={{ color: tokens.color.text }}>{d.title}</Text>}
                            description={<Text style={{ color: tokens.color.textTertiary, fontSize: 12 }}>{d.owner_name} · {d.summary}</Text>}
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="暂无文档" />
                  )}
                </GlassCard>
              </FadeUp>
            </Col>
          </Row>
        </>
      )}
    </PageContainer>
  )
}

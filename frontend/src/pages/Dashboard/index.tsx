import { Row, Col, Card, List, Tag, Typography, Space, Avatar, Spin, Empty, Divider } from 'antd'
import { RobotOutlined, TeamOutlined, FileTextOutlined, SafetyOutlined, MessageOutlined, CloudServerOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { tokens } from '../../theme/tokens'
import { dashboardApi, systemApi, type DashboardOverview } from '../../api'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import GlassCard from '../../components/ui/GlassCard'
import StatTile from '../../components/ui/StatTile'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import TrendBars from '../../components/charts/TrendBars'
import PageContainer from '../../components/common/PageContainer'

const { Title, Text, Paragraph } = Typography

function today() {
  return new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: ov, loading: l1 } = useApi<DashboardOverview>(() => dashboardApi.overview())
  const { data: ins } = useApi<{ insights: string }>(() => dashboardApi.insights())
  const { data: health } = useApi<{ status: string; ai_provider: string }>(() => systemApi.health())

  const adminCount = ov ? ov.stats.roles.admin ?? 0 : 0
  const stats = ov
    ? [
        { key: 'users', title: '总用户', value: ov.stats.users, delta: 8.4, icon: <TeamOutlined /> },
        { key: 'docs', title: '文档总量', value: ov.stats.documents, delta: 12.0, icon: <FileTextOutlined /> },
        { key: 'admin', title: '管理员', value: adminCount, delta: 0, icon: <SafetyOutlined /> },
        { key: 'active', title: '活跃会话', value: 24, delta: -3.1, icon: <MessageOutlined /> },
      ]
    : []

  const resourceBars = ov
    ? [
        { label: '用户', value: ov.stats.users },
        { label: '文档', value: ov.stats.documents },
        { label: '角色', value: Object.keys(ov.stats.roles).length },
      ]
    : []

  return (
    <PageContainer>
      <FadeUp>
        <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <Title level={3} className="ruyi-gradient-text" style={{ margin: 0, fontWeight: 700 }}>
              工作台
            </Title>
            <Text style={{ color: tokens.color.textTertiary }}>
              {today()} · 欢迎回来，{user?.username ?? '管理员'}
            </Text>
          </div>
          <Tag color="cyan" style={{ borderRadius: 999 }}>如意 AI 管理平台</Tag>
        </div>
      </FadeUp>

      {(l1) && !ov ? (
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
            <Col xs={24} lg={10}>
              <FadeUp delay={120}>
                <GlassCard title="资源概览">
                  <TrendBars data={resourceBars} height={180} />
                </GlassCard>
              </FadeUp>
            </Col>
            <Col xs={24} lg={7}>
              <FadeUp delay={180}>
                <GlassCard
                  title={
                    <Space>
                      <RobotOutlined style={{ color: tokens.color.jade }} />
                      AI 洞察
                    </Space>
                  }
                  style={{ height: '100%' }}
                >
                  {!ins ? (
                    <Spin />
                  ) : (
                    <Paragraph style={{ color: tokens.color.text, opacity: 0.85, lineHeight: 1.8, marginBottom: 12, whiteSpace: 'pre-line' }}>
                      {ins.insights}
                    </Paragraph>
                  )}
                  <Tag color="cyan">由 如意 AI 生成</Tag>
                </GlassCard>
              </FadeUp>
            </Col>
            <Col xs={24} lg={7}>
              <FadeUp delay={240}>
                <GlassCard title={<Space><CloudServerOutlined style={{ color: tokens.color.cyan }} />系统状态</Space>} style={{ height: '100%' }}>
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: tokens.color.textSecondary }}>服务</Text>
                      <Tag color={health?.status === 'ok' ? 'green' : 'red'}>{health?.status ?? '—'}</Tag>
                    </div>
                    <Divider style={{ margin: '4px 0', borderColor: tokens.color.border }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: tokens.color.textSecondary }}>AI 引擎</Text>
                      <Tag color="gold">{health?.ai_provider ?? '—'}</Tag>
                    </div>
                    <Divider style={{ margin: '4px 0', borderColor: tokens.color.border }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text style={{ color: tokens.color.textSecondary }}>文档库</Text>
                      <Text style={{ color: tokens.color.text }}>{ov?.stats.documents ?? 0} 篇</Text>
                    </div>
                  </Space>
                </GlassCard>
              </FadeUp>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24}>
              <FadeUp delay={300}>
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
                          <Tag color="cyan">{String(d.tags || '').split(',')[0] || '未分类'}</Tag>
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

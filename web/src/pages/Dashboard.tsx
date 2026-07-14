import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Typography, Button, Spin, Tag, List, message } from 'antd'
import { TeamOutlined, FileTextOutlined, RobotOutlined, ReloadOutlined } from '@ant-design/icons'
import { dashboardApi } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(true)
  const [insLoading, setInsLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await dashboardApi.overview()
      setStats(data.data)
    } finally {
      setLoading(false)
    }
  }

  const loadInsights = async () => {
    setInsLoading(true)
    try {
      const { data } = await dashboardApi.insights()
      setInsights(data.data.insights)
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'insights failed')
    } finally {
      setInsLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading || !stats) return <Spin size="large" />

  const roles = stats.stats.roles || {}
  return (
    <div>
      <Typography.Title level={3}>Welcome back, {user?.username} 👋</Typography.Title>
      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="Users" value={stats.stats.users} prefix={<TeamOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="Documents" value={stats.stats.documents} prefix={<FileTextOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="Admin roles" value={roles.admin || 0} prefix={<RobotOutlined />} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={14}>
          <Card title="Recent documents">
            <List
              dataSource={stats.recent_documents}
              locale={{ emptyText: 'No documents yet' }}
              renderItem={(d: any) => (
                <List.Item>
                  <List.Item.Meta title={d.title} description={<Tag>{d.tags || 'untagged'}</Tag>} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card
            title={<span><RobotOutlined /> AI Insights</span>}
            extra={<Button size="small" icon={<ReloadOutlined />} loading={insLoading} onClick={loadInsights}>Generate</Button>}
          >
            {insLoading ? <Spin /> : insights ? (
              <Typography.Paragraph style={{ whiteSpace: 'pre-wrap' }}>{insights}</Typography.Paragraph>
            ) : (
              <Button type="dashed" onClick={loadInsights}>Ask AI for insights</Button>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

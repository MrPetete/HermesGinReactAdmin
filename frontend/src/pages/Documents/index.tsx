import { Row, Col, Typography, Tag, Space } from 'antd'
import { tokens } from '../../theme/tokens'
import { documentsApi } from '../../api'
import { useApi } from '../../hooks/useApi'
import GlassCard from '../../components/ui/GlassCard'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import PageContainer from '../../components/common/PageContainer'

const { Paragraph, Text } = Typography

export default function DocumentsPage() {
  const { data, loading } = useApi(() => documentsApi.list())

  return (
    <PageContainer>
      <FadeUp>
        <SectionTitle title="文档中心" subtitle="知识库（后端检索）" />
      </FadeUp>
      <Row gutter={[16, 16]}>
        {(data?.items ?? []).map((d, i) => (
          <Col xs={24} md={12} key={d.id}>
            <FadeUp delay={i * 80}>
              <GlassCard lift>
                <Space direction="vertical" style={{ width: '100%' }} size={10}>
                  <Text strong style={{ color: tokens.color.text, fontSize: 16 }}>{d.title}</Text>
                  <Paragraph style={{ color: tokens.color.textSecondary, margin: 0 }}>{d.summary}</Paragraph>
                  <Space size={6}>
                    {String(d.tags || '').split(',').filter(Boolean).map((t) => <Tag key={t} color="cyan">{t}</Tag>)}
                  </Space>
                  <Text style={{ color: tokens.color.textTertiary, fontSize: 12 }}>
                    {d.owner_name} · 更新于 {d.updated_at?.slice(0, 10)}
                  </Text>
                </Space>
              </GlassCard>
            </FadeUp>
          </Col>
        ))}
        {loading && <Col span={24}><Text style={{ color: tokens.color.textTertiary }}>加载中…</Text></Col>}
        {!loading && data?.items?.length === 0 && (
          <Col span={24}><Text style={{ color: tokens.color.textTertiary }}>暂无文档</Text></Col>
        )}
      </Row>
    </PageContainer>
  )
}

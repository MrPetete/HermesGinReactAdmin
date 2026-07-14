import { Row, Col, Typography, Tag, Space } from 'antd'
import { tokens } from '../../theme/tokens'
import { useMock } from '../../hooks/useMock'
import { documents, type DocRow } from '../../mock/documents'
import GlassCard from '../../components/ui/GlassCard'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import PageContainer from '../../components/common/PageContainer'

const { Paragraph, Text } = Typography

export default function DocumentsPage() {
  const { data, loading } = useMock(() => documents)

  return (
    <PageContainer>
      <FadeUp>
        <SectionTitle title="文档中心" subtitle="知识库与 AI 检索" />
      </FadeUp>
      <Row gutter={[16, 16]}>
        {(data ?? []).map((d: DocRow, i) => (
          <Col xs={24} md={12} key={d.id}>
            <FadeUp delay={i * 80}>
              <GlassCard lift>
                <Space direction="vertical" style={{ width: '100%' }} size={10}>
                  <Text strong style={{ color: tokens.color.text, fontSize: 16 }}>{d.title}</Text>
                  <Paragraph style={{ color: tokens.color.textSecondary, margin: 0 }}>{d.summary}</Paragraph>
                  <Space size={6}>
                    {d.tags.map((t) => <Tag key={t} color="cyan">{t}</Tag>)}
                  </Space>
                  <Text style={{ color: tokens.color.textTertiary, fontSize: 12 }}>
                    {d.owner} · 更新于 {d.updated}
                  </Text>
                </Space>
              </GlassCard>
            </FadeUp>
          </Col>
        ))}
        {loading && <Col span={24}><Text style={{ color: tokens.color.textTertiary }}>加载中…</Text></Col>}
      </Row>
    </PageContainer>
  )
}

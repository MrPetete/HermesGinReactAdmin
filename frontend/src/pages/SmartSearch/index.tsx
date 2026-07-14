import { useState } from 'react'
import { Input, Button, List, Tag, Space, Typography, Avatar, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { tokens } from '../../theme/tokens'
import { searchHits, type SearchHit } from '../../mock/ai'
import GlassCard from '../../components/ui/GlassCard'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import PageContainer from '../../components/common/PageContainer'

const { Text, Paragraph } = Typography

export default function SmartSearchPage() {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [done, setDone] = useState(false)

  const run = () => {
    if (!q.trim()) return
    // mock retrieval over the fixtures
    setHits(searchHits)
    setDone(true)
  }

  return (
    <PageContainer>
      <FadeUp>
        <SectionTitle title="智能搜索" subtitle="向量召回 + 生成式摘要（mock）" />
      </FadeUp>
      <FadeUp delay={80}>
        <Space.Compact style={{ width: '100%', maxWidth: 640 }}>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onPressEnter={run}
            prefix={<SearchOutlined style={{ color: tokens.color.textTertiary }} />}
            placeholder="搜索文档、用户、权限…"
            style={{ background: 'rgba(10,20,38,0.6)', borderColor: tokens.color.border, color: tokens.color.text }}
          />
          <Button type="primary" onClick={run}>搜索</Button>
        </Space.Compact>

        <div style={{ marginTop: 16 }}>
          {done ? (
            <List
              dataSource={hits}
              renderItem={(h) => (
                <GlassCard lift style={{ marginBottom: 12 }}>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text strong style={{ color: tokens.color.text }}>{h.title}</Text>
                    <Tag color="cyan">相关度 {(h.score * 100).toFixed(0)}%</Tag>
                  </Space>
                  <Paragraph style={{ color: tokens.color.textSecondary, margin: '8px 0 0' }}>{h.excerpt}</Paragraph>
                </GlassCard>
              )}
            />
          ) : (
            <Empty description={<Text style={{ color: tokens.color.textTertiary }}>输入关键词开始检索</Text>} />
          )}
        </div>
      </FadeUp>
    </PageContainer>
  )
}

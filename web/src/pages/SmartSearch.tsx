import { useState } from 'react'
import { Card, Input, Button, List, Tag, Typography, Space, Empty, Spin } from 'antd'
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons'
import { aiApi } from '../api'

export default function SmartSearch() {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!q.trim()) return
    setLoading(true); setAnswer(''); setResults([])
    try {
      const { data } = await aiApi.search(q)
      setAnswer(data.data.answer)
      setResults(data.data.results)
    } catch (e: any) {
      setAnswer('Error: ' + (e?.response?.data?.message || 'search failed'))
    } finally { setLoading(false) }
  }

  return (
    <Card title={<span><SearchOutlined /> Smart Search</span>}>
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <Input placeholder="Describe what you're looking for (e.g. 'rbac roles')" value={q} onChange={(e) => setQ(e.target.value)} onPressEnter={run} />
        <Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={run}>Search</Button>
      </Space.Compact>
      {loading && <Spin />}
      {!loading && answer && (
        <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: 12, borderRadius: 8 }}>
          {answer}
        </Typography.Paragraph>
      )}
      {!loading && results.length > 0 && (
        <List
          header={`${results.length} result(s)`}
          dataSource={results}
          renderItem={(d: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 20 }} />}
                title={d.title}
                description={<><Tag>{d.tags || 'untagged'}</Tag> {d.summary}</>}
              />
            </List.Item>
          )}
        />
      )}
      {!loading && !answer && <Empty description="Ask the AI to search your knowledge base" />}
    </Card>
  )
}

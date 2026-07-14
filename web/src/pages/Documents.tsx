import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Tag, Space, Popconfirm, message, Drawer, Typography } from 'antd'
import { PlusOutlined, RobotOutlined } from '@ant-design/icons'
import { docApi, aiApi } from '../api'

export default function Documents() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [qaDoc, setQaDoc] = useState<any>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [qaLoading, setQaLoading] = useState(false)
  const [form] = Form.useForm()

  const load = async (p = page) => {
    const { data } = await docApi.list(p, 10)
    setItems(data.data.items)
    setTotal(data.data.total)
  }
  useEffect(() => { load() }, [])

  const onCreate = async () => {
    try {
      const v = await form.validateFields()
      await docApi.create(v)
      message.success('Document created')
      setOpen(false); form.resetFields(); load()
    } catch (e: any) { message.error(e?.response?.data?.message || 'create failed') }
  }
  const onDelete = async (id: number) => {
    try { await docApi.remove(id); message.success('Deleted'); load() } catch (e: any) { message.error(e?.response?.data?.message || 'delete failed') }
  }
  const onAsk = async () => {
    if (!question.trim()) return
    setQaLoading(true); setAnswer('')
    try {
      const { data } = await aiApi.ask(qaDoc.id, question)
      setAnswer(data.data.answer)
    } catch (e: any) { message.error(e?.response?.data?.message || 'Q&A failed') }
    finally { setQaLoading(false) }
  }

  const cols = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Title', dataIndex: 'title' },
    { title: 'Tags', dataIndex: 'tags', render: (t: string) => t?.split(',').map((x: string) => <Tag key={x}>{x}</Tag>) },
    { title: 'Owner', dataIndex: 'owner_name' },
    {
      title: 'Action',
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<RobotOutlined />} onClick={() => { setQaDoc(r); setQuestion(''); setAnswer('') }}>Ask AI</Button>
          <Popconfirm title="Delete?" onConfirm={() => onDelete(r.id)}>
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>New document</Button>
      </Space>
      <Table rowKey="id" dataSource={items} columns={cols} pagination={{ total, current: page, onChange: setPage }} />
      <Modal title="New document" open={open} onOk={onCreate} onCancel={() => setOpen(false)} okText="Create">
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="tags" label="Tags (comma separated)"><Input /></Form.Item>
          <Form.Item name="summary" label="Summary"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}><Input.TextArea rows={5} /></Form.Item>
        </Form>
      </Modal>
      <Drawer title={`Ask AI about: ${qaDoc?.title || ''}`} open={!!qaDoc} onClose={() => setQaDoc(null)} width={480}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Paragraph type="secondary">{qaDoc?.content}</Typography.Paragraph>
          <Input.TextArea rows={3} placeholder="Your question..." value={question} onChange={(e) => setQuestion(e.target.value)} />
          <Button type="primary" loading={qaLoading} onClick={onAsk}>Ask</Button>
          {answer && <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{answer}</Typography.Paragraph>}
        </Space>
      </Drawer>
    </div>
  )
}

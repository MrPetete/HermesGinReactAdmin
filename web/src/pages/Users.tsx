import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { userApi } from '../api'

const roleColor: Record<string, string> = { admin: 'red', manager: 'blue', viewer: 'default' }

export default function Users() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const load = async (p = page) => {
    const { data } = await userApi.list(p, 10)
    setItems(data.data.items)
    setTotal(data.data.total)
  }
  useEffect(() => { load() }, [])

  const onCreate = async () => {
    try {
      const v = await form.validateFields()
      await userApi.create(v)
      message.success('User created')
      setOpen(false)
      form.resetFields()
      load()
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'create failed')
    }
  }

  const onDelete = async (id: number) => {
    try { await userApi.remove(id); message.success('Deleted'); load() }
    catch (e: any) { message.error(e?.response?.data?.message || 'delete failed') }
  }

  const cols = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role', render: (r: string) => <Tag color={roleColor[r]}>{r}</Tag> },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
    {
      title: 'Action',
      render: (_: any, r: any) => (
        <Popconfirm title="Delete this user?" onConfirm={() => onDelete(r.id)}>
          <Button danger size="small">Delete</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>New user</Button>
      </Space>
      <Table rowKey="id" dataSource={items} columns={cols} pagination={{ total, current: page, onChange: setPage }} />
      <Modal title="Create user" open={open} onOk={onCreate} onCancel={() => setOpen(false)} okText="Create">
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email"><Input /></Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}><Input.Password /></Form.Item>
          <Form.Item name="role" label="Role" initialValue="viewer">
            <Select options={[{ value: 'admin', label: 'admin' }, { value: 'manager', label: 'manager' }, { value: 'viewer', label: 'viewer' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

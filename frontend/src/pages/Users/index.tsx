import { Table, Tag, Space, Avatar } from 'antd'
import { tokens } from '../../theme/tokens'
import { usersApi } from '../../api'
import { useApi } from '../../hooks/useApi'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import PageContainer from '../../components/common/PageContainer'

export default function UsersPage() {
  const { data, loading } = useApi(() => usersApi.list())

  const columns = [
    { title: '用户', dataIndex: 'username', render: (n: string) => (
        <Space>
          <Avatar style={{ background: tokens.color.jade, color: tokens.color.canvas }}>{n[0]}</Avatar>
          <span style={{ color: tokens.color.text }}>{n}</span>
        </Space>
      ) },
    { title: '邮箱', dataIndex: 'email', render: (e: string) => <span style={{ color: tokens.color.textSecondary }}>{e}</span> },
    { title: '角色', dataIndex: 'role', render: (r: string) => <Tag color={r === 'admin' ? 'gold' : r === 'manager' ? 'cyan' : 'default'}>{r}</Tag> },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag> },
  ]

  return (
    <PageContainer>
      <FadeUp>
        <SectionTitle title="用户管理" subtitle="来自后端 RBAC 数据" />
      </FadeUp>
      <FadeUp delay={100}>
        <div className="ruyi-glass ruyi-lift" style={{ borderRadius: tokens.radius.md, overflow: 'hidden' }}>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={data?.items ?? []}
            pagination={{ pageSize: 10 }}
            style={{ background: 'transparent' }}
          />
        </div>
      </FadeUp>
    </PageContainer>
  )
}

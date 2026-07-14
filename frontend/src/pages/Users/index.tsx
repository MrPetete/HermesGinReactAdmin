import { Table, Tag, Space, Avatar } from 'antd'
import { tokens } from '../../theme/tokens'
import { useMock } from '../../hooks/useMock'
import { users, type UserRow } from '../../mock/users'
import SectionTitle from '../../components/ui/SectionTitle'
import FadeUp from '../../components/ui/FadeUp'
import PageContainer from '../../components/common/PageContainer'

const roleColor: Record<UserRow['role'], string> = {
  管理员: 'gold',
  经理: 'cyan',
  访客: 'default',
}

export default function UsersPage() {
  const { data, loading } = useMock(() => users)

  const columns = [
    { title: '用户', dataIndex: 'name', render: (n: string) => (
        <Space>
          <Avatar style={{ background: tokens.color.jade, color: tokens.color.canvas }}>{n[0]}</Avatar>
          <span style={{ color: tokens.color.text }}>{n}</span>
        </Space>
      ) },
    { title: '邮箱', dataIndex: 'email', render: (e: string) => <span style={{ color: tokens.color.textSecondary }}>{e}</span> },
    { title: '角色', dataIndex: 'role', render: (r: UserRow['role']) => <Tag color={roleColor[r]}>{r}</Tag> },
    { title: '状态', dataIndex: 'status', render: (s: UserRow['status']) => (
        <Tag color={s === '活跃' ? 'green' : 'red'}>{s}</Tag>
      ) },
    { title: '最近活跃', dataIndex: 'lastActive', render: (t: string) => (
        <span style={{ color: tokens.color.textTertiary, fontSize: 12 }}>{t}</span>
      ) },
  ]

  return (
    <PageContainer>
      <FadeUp>
        <SectionTitle title="用户管理" subtitle="RBAC 角色与状态总览" />
      </FadeUp>
      <FadeUp delay={100}>
        <div className="ruyi-glass ruyi-lift" style={{ borderRadius: tokens.radius.md, overflow: 'hidden' }}>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={data ?? []}
            pagination={false}
            style={{ background: 'transparent' }}
          />
        </div>
      </FadeUp>
    </PageContainer>
  )
}

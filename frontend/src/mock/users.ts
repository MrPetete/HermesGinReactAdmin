export interface UserRow {
  id: number
  name: string
  email: string
  role: '管理员' | '经理' | '访客'
  status: '活跃' | '禁用'
  lastActive: string
}

export const users: UserRow[] = [
  { id: 1, name: '林婉清', email: 'wanqing@ruyi.ai', role: '管理员', status: '活跃', lastActive: '刚刚' },
  { id: 2, name: '陈思远', email: 'siyuan@ruyi.ai', role: '经理', status: '活跃', lastActive: '12 分钟前' },
  { id: 3, name: '赵明', email: 'ming@ruyi.ai', role: '访客', status: '活跃', lastActive: '1 小时前' },
  { id: 4, name: '王悦', email: 'yue@ruyi.ai', role: '经理', status: '禁用', lastActive: '3 天前' },
  { id: 5, name: '李航', email: 'hang@ruyi.ai', role: '访客', status: '活跃', lastActive: '2 小时前' },
  { id: 6, name: '周岚', email: 'lan@ruyi.ai', role: '管理员', status: '活跃', lastActive: '5 分钟前' },
]

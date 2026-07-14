// Mock data — frontend runs standalone, no backend required.
export interface StatItem {
  key: string
  title: string
  value: number
  suffix?: string
  delta: number // % change vs last period
  tone: 'up' | 'down' | 'flat'
}

export const stats: StatItem[] = [
  { key: 'users', title: '总用户', value: 1284, delta: 12.5, tone: 'up' },
  { key: 'docs', title: '文档量', value: 326, delta: 8.2, tone: 'up' },
  { key: 'active', title: '活跃会话', value: 89, delta: -3.1, tone: 'down' },
  { key: 'insights', title: 'AI 洞察', value: 47, delta: 21.0, tone: 'up' },
]

// 7-day trend for the simple bar chart (visits).
export const trend: { day: string; value: number }[] = [
  { day: '周一', value: 420 },
  { day: '周二', value: 510 },
  { day: '周三', value: 468 },
  { day: '周四', value: 612 },
  { day: '周五', value: 705 },
  { day: '周六', value: 533 },
  { day: '周日', value: 489 },
]

export interface ActivityItem {
  id: number
  who: string
  action: string
  time: string
  tone: 'jade' | 'gold' | 'cyan'
}

export const recentActivity: ActivityItem[] = [
  { id: 1, who: 'Admin', action: '新增用户「林婉清」', time: '2 分钟前', tone: 'jade' },
  { id: 2, who: 'AI', action: '生成周报洞察 · 准确率 96%', time: '11 分钟前', tone: 'cyan' },
  { id: 3, who: 'Manager', action: '归档文档《运营策略 Q3》', time: '34 分钟前', tone: 'gold' },
  { id: 4, who: 'Viewer', action: '导出数据看板 PDF', time: '1 小时前', tone: 'cyan' },
  { id: 5, who: 'Admin', action: '调整 RBAC 角色权限', time: '2 小时前', tone: 'jade' },
]

export const aiInsight =
  '本周用户增长 12.5%，活跃会话小幅回落 3.1%，建议将「智能搜索」入口前置至首页以提升留存；' +
  '文档库《运营策略 Q3》被引用频次最高，可作为知识库锚点。整体运行平稳，无异常告警。'

export const user = {
  name: 'Admin',
  role: '超级管理员',
  initials: '如',
}

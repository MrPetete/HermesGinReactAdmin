export interface DocRow {
  id: number
  title: string
  summary: string
  tags: string[]
  owner: string
  updated: string
}

export const documents: DocRow[] = [
  { id: 1, title: '运营策略 Q3', summary: '第三季度增长目标与渠道分配方案。', tags: ['运营', '战略'], owner: '陈思远', updated: '今天' },
  { id: 2, title: '如意 AI 能力白皮书', summary: '智能搜索、文档问答与洞察的生成式能力说明。', tags: ['AI', '产品'], owner: '林婉清', updated: '昨天' },
  { id: 3, title: '用户权限模型 v2', summary: 'RBAC 角色与资源映射规范。', tags: ['安全', 'RBAC'], owner: '周岚', updated: '2 天前' },
  { id: 4, title: '数据看板指标字典', summary: '核心 KPI 定义与口径。', tags: ['数据', 'BI'], owner: '王悦', updated: '3 天前' },
]

export interface ChatMsg {
  role: 'user' | 'ai'
  content: string
}
export interface SearchHit {
  title: string
  excerpt: string
  score: number
}

export const seedChat: ChatMsg[] = [
  { role: 'ai', content: '你好，我是如意 AI 助手。可以问我关于运营、文档或权限的任何问题。' },
]

export const searchHits: SearchHit[] = [
  { title: '运营策略 Q3', excerpt: '第三季度增长目标与渠道分配方案，建议前置智能搜索入口…', score: 0.96 },
  { title: '如意 AI 能力白皮书', excerpt: '智能搜索基于向量召回与生成式摘要，准确率 96%…', score: 0.91 },
  { title: '用户权限模型 v2', excerpt: 'RBAC 角色包括管理员、经理、访客，支持资源级授权…', score: 0.84 },
]

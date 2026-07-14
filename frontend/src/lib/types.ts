export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
  status: 'active' | 'disabled'
  created_at: string
  updated_at: string
}

export interface Document {
  id: number
  title: string
  summary: string
  content: string
  tags: string
  owner_id: number
  owner_name: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

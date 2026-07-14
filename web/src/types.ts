export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
  status: 'active' | 'disabled'
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  owner: number
  name_ja?: string
  name_uz?: string
  description_ja?: string
  description_uz?: string
  subject_ja?: string
  subject_uz?: string
  is_public?: boolean
  color?: string
  created_at: string
  updated_at: string
  is_member?: boolean
  member_status?: 'active' | 'pending' | 'rejected' | null
  [key: string]: any
}

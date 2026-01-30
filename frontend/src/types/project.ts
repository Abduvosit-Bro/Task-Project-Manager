export interface Project {
  id: number
  owner: number
  name_ja?: string
  name_uz?: string
  description_ja?: string
  description_uz?: string
  color?: string
  created_at: string
  updated_at: string
  [key: string]: any
}

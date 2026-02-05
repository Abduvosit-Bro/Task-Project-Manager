import api from './client'

export const fetchProjects = async () => {
  const { data } = await api.get('/projects/')
  // Handle pagination (Django DRF PageNumberPagination returns { count, results: [] })
  if (data && Array.isArray(data.results)) {
    return data.results
  }
  return Array.isArray(data) ? data : []
}

export const fetchProject = async (id: number) => {
  const { data } = await api.get(`/projects/${id}/`)
  return data
}

export const createProject = async (payload: {
  name_ja: string
  name_uz: string
  description_ja?: string
  description_uz?: string
  subject_ja?: string
  subject_uz?: string
  is_public?: boolean
  color?: string
}) => {
  const sanitized = {
    ...payload,
    name_ja: payload.name_ja?.trim(),
    name_uz: payload.name_uz?.trim(),
    description_ja: payload.description_ja?.trim() || undefined,
    description_uz: payload.description_uz?.trim() || undefined,
    subject_ja: payload.subject_ja?.trim() || undefined,
    subject_uz: payload.subject_uz?.trim() || undefined,
  }
  const { data } = await api.post('/projects/', sanitized)
  return data
}

export const updateProject = async (id: number, payload: Partial<{
  name_ja: string
  name_uz: string
  description_ja: string
  description_uz: string
  subject_ja: string
  subject_uz: string
  is_public: boolean
  color: string
}>) => {
  const { data } = await api.patch(`/projects/${id}/`, payload)
  return data
}

export const deleteProject = async (id: number) => {
  await api.delete(`/projects/${id}/`)
}

export const fetchPublicProjects = async () => {
  const { data } = await api.get('/projects/public/')
  // Handle pagination if needed, but assuming simple list for now or same structure
  if (data && Array.isArray(data.results)) {
    return data.results
  }
  return Array.isArray(data) ? data : []
}

export const joinProject = async (id: number) => {
    const { data } = await api.post(`/projects/${id}/join/`)
    return data
}

export const updateMemberStatus = async (projectId: number, memberId: number, status: 'active' | 'rejected') => {
    const { data } = await api.post(`/projects/${projectId}/members/${memberId}/status/`, { status })
    return data
}

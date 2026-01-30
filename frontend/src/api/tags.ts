import api from './client'

export const fetchTags = async () => {
  const { data } = await api.get('/tags/')
  if (data && Array.isArray(data.results)) {
    return data.results
  }
  return Array.isArray(data) ? data : []
}

export const createTag = async (payload: { name: string; color?: string }) => {
  const { data } = await api.post('/tags/', { ...payload, name: payload.name.trim() })
  return data
}

export const deleteTag = async (id: number) => {
  await api.delete(`/tags/${id}/`)
}

export const updateTag = async (id: number, payload: { name?: string; color?: string }) => {
  const { data } = await api.patch(`/tags/${id}/`, { ...payload, name: payload.name?.trim() })
  return data
}

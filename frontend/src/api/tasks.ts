import api from './client'

export const fetchTasks = async (projectId: string, params?: Record<string, string>) => {
  const filtered = Object.fromEntries(Object.entries(params || {}).filter(([, value]) => value))
  const { data } = await api.get(`/projects/${projectId}/tasks/`, { params: filtered })
  if (data && Array.isArray(data.results)) {
    return data.results
  }
  return Array.isArray(data) ? data : []
}

export const createTask = async (projectId: string, payload: Record<string, unknown>) => {
  const { data } = await api.post(`/projects/${projectId}/tasks/`, payload)
  return data
}

export const updateTask = async (taskId: number, payload: Record<string, unknown>) => {
  const { data } = await api.patch(`/tasks/${taskId}/`, payload)
  return data
}

export const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}/`)
}

export const fetchTask = async (taskId: number) => {
  const { data } = await api.get(`/tasks/${taskId}/`)
  return data
}

export const updateTaskStatus = async (taskId: number, status: string) => {
  const { data } = await api.patch(`/tasks/${taskId}/status/`, { status })
  return data
}

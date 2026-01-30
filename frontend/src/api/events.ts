import api from './client'

export const fetchEvents = async (projectId: string, params?: Record<string, string>) => {
  const { data } = await api.get(`/projects/${projectId}/events/`, { params })
  if (data && Array.isArray(data.results)) {
    return data.results
  }
  return Array.isArray(data) ? data : []
}

export const createEvent = async (projectId: string, payload: Record<string, unknown>) => {
  const { data } = await api.post(`/projects/${projectId}/events/`, payload)
  return data
}

export const updateEvent = async (eventId: number, payload: Record<string, unknown>) => {
  const { data } = await api.patch(`/events/${eventId}/`, payload)
  return data
}

export const fetchEvent = async (eventId: number) => {
  const { data } = await api.get(`/events/${eventId}/`)
  return data
}

export const fetchCalendar = async (projectId: string, params?: Record<string, string>) => {
  const { data } = await api.get(`/projects/${projectId}/calendar/`, { params })
  return data
}

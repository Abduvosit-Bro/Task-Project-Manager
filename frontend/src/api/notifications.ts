import api from './client'

export const fetchNotifications = async () => {
  const { data } = await api.get('/notifications')
  if (data && Array.isArray(data.results)) {
    return data.results
  }
  return Array.isArray(data) ? data : []
}

export const fetchNotification = async (id: number) => {
  const { data } = await api.get(`/notifications/${id}`)
  return data
}

export const markNotificationRead = async (id: number) => {
  const { data } = await api.patch(`/notifications/${id}`, { is_read: true })
  return data
}

export const markAllNotificationsRead = async () => {
  const { data } = await api.post('/notifications/mark-all-read')
  return data
}

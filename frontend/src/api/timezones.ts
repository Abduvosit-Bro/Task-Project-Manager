import api from './client'

export const fetchTimezones = async () => {
  const { data } = await api.get('/auth/timezones')
  return data as string[]
}

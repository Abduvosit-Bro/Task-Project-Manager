import api from './client'

export const translateText = async (payload: {
  source_lang: 'ja' | 'uz'
  target_lang: 'ja' | 'uz'
  text: string
}) => {
  const { data } = await api.post('/translate', payload)
  return data
}

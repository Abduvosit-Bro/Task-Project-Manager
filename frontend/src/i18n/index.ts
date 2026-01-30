import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ja from './ja.json'
import uz from './uz.json'

const resources = {
  ja: { translation: ja },
  uz: { translation: uz },
}

const stored = localStorage.getItem('ui_language')

void i18n.use(initReactI18next).init({
  resources,
  lng: stored || 'ja',
  fallbackLng: 'ja',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

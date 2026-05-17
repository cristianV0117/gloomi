import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'

function readStoredLang(): string {
  try {
    const lng = localStorage.getItem('gloomi-lang')
    if (lng === 'en' || lng === 'es') return lng
  } catch {
    /* ignore */
  }
  return 'es'
}

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: readStoredLang(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

export default i18n

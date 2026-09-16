import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import arTranslations from './locales/ar.json'
import enTranslations from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslations,
      },
      en: {
        translation: enTranslations,
      },
    },
    fallbackLng: 'en',
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Prefer English by default; ignore stale FBS Arabic preference in old storage key
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'hdp-i18nextLng',
    },
  })
  .then(() => {
    const lang = (i18n.language || 'en').startsWith('ar') ? 'ar' : 'en'
    if (!i18n.language?.startsWith('ar') && !i18n.language?.startsWith('en')) {
      void i18n.changeLanguage('en')
    }
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  })

i18n.on('languageChanged', (lng) => {
  const lang = lng.startsWith('ar') ? 'ar' : 'en'
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
})

export default i18n

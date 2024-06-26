import pl from './locales/pl.json'
import en from './locales/en.json'
import fr from './locales/fr.json'

export default defineI18nConfig(() => ({
  useCookie: true,
  legacy: false,
  locale: 'pl',
  locales: ['pl', 'en', 'fr'],
  defaultLocale: 'pl',
  fallbackLocale: 'en',
  messages: {
    pl,
    en,
    fr,
  },
}))

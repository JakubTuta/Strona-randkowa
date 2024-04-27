import pl from './locales/pl.json'
import en from './locales/en.json'

export default defineI18nConfig(() => ({
    useCookie: true,
    legacy: false,
    locale: 'en',
    locales: ['pl', 'en'],
    defaultLocale: 'en',
    fallbackLocale: 'pl',
    messages: {
        pl,
        en,
    },
}))

import {defineI18nConfig} from "~/node_modules/.pnpm/@nuxtjs+i18n@8.3.1_rollup@4.13.2_vue@3.4.21/node_modules/@nuxtjs/i18n/dist/runtime/composables";

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            welcome: 'Welcome'
        },
        fr: {
            welcome: 'Bienvenue'
        }
    }
}))

/* eslint-disable node/prefer-global/process */
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Randki+',
      meta: [
        { name: 'description', content: 'Strona randkowa Politechniki Łódzkiej.' },
      ],
    },
  },
  build: {
    transpile: ['vuetify', 'vue3-emoji-picker'],
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      NODE_ENV: process.env.NODE_ENV,
      APP_VERSION: process.env.npm_package_version,
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'pl',
    vueI18n: './i18n.config.ts',
  },
  devtools: { enabled: true },
})

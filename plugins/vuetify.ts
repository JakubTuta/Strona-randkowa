import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#A87676',
            secondary: '#76A8A8',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#A87676',
            secondary: '#87CACA',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        rounded: 'm',
        color: 'primary',
        variant: 'outlined',
      },
      VTextField: {
        variant: 'outlined',
      },
    },
  })
  app.vueApp.use(vuetify)
})

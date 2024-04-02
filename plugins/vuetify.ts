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
            primary: '#FF9B85',
            secondary: '#FFD97D',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#FF9B85',
            secondary: '#FFD97D',
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

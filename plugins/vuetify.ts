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
        highContrast: {
          dark: true,
          colors: {
            background: '#000000',
            surface: '#ffffff',
            primary: '#F1C232',
            secondary: '#F1C232',
            error: '#ff0000',
            info: '#0000ff',
            success: '#00ff00',
            warning: '#ffff00',
          },
        },
        blackAndWhite: {
          dark: true,
          colors: {
            background: '#000000',
            surface: '#ffffff',
            primary: '#ffffff',
            secondary: '#000000',
            error: '#ffffff',
            info: '#ffffff',
            success: '#ffffff',
            warning: '#ffffff',
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

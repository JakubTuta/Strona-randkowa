import type { ThemeInstance } from 'vuetify'

export function toggleTheme(theme: ThemeInstance) {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

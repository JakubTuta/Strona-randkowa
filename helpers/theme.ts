import type { ThemeInstance } from 'vuetify'
import type {UnwrapRef} from "vue";

export function toggleTheme(theme: ThemeInstance) {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

export function setMyTheme(theme: ThemeInstance, newTheme: string) {
  theme.global.name.value = newTheme
}

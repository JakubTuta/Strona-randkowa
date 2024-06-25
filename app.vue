<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { useTheme } from 'vuetify'
import ShowSettings from '~/components/showSettings.vue'
import { setMyTheme } from '~/helpers/theme'
import { changeFont } from '~/helpers/fonts'

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const { locale, setLocale } = useI18n()
const currentLang = useLocalStorage('current-lang', 'pl')

const theme = useTheme()
const currentTheme = useLocalStorage('current-theme', 'dark')

const currentFont = useLocalStorage('current-font', '16px')

const showForm = ref(false)
function showEditForm() {
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

onMounted(() => {
  if (currentLang.value) {
    setLocale(currentLang.value)
  }
  else {
    setLocale((navigator.languages.includes('pl') || navigator.languages.includes('pl-PL'))
      ? locale.value = 'pl'
      : (navigator.languages.includes('fr') || navigator.languages.includes('fr-FR'))
            ? locale.value = 'fr'
            : locale.value = 'en'
    )
  }

  if (currentTheme.value)
    setMyTheme(theme, currentTheme.value)

  if (currentFont.value)
    changeFont(currentFont.value)

  appStore.currentUser()
})

watch(userData, (newValue) => {
  if (newValue && newValue.languageCode !== locale.value) {
    setLocale(newValue.languageCode)
    localStorage.setItem('current-lang', newValue.languageCode)
  }
}, { immediate: true })
</script>

<template>
  <NuxtLayout>
    <v-app>
      <v-main>
        <AppLoading />
        <v-btn class="settingsButton" justify="start" icon="mdi-cog" color="secondary" @click="showEditForm" />
        <NuxtPage />
        <AppSnackbar />
      </v-main>
    </v-app>
    <ShowSettings :is-show="showForm" @on-close="closeForm" />
  </NuxtLayout>
</template>

<style scoped>
  .settingsButton {
    position: fixed;
    left: 2em;
    bottom: 2em;
    z-index: 1;
  }
</style>

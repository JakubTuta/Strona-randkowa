<script setup lang="ts">
const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const { locale, setLocale } = useI18n()

onMounted(async () => {
  await appStore.currentUser()
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

        <NuxtPage />
        <AppSnackbar />
      </v-main>
    </v-app>
  </NuxtLayout>
</template>

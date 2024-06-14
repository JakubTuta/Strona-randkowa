<script setup lang="ts">
import ShowSettings from '~/components/showSettings.vue'
import EmailVerification from "~/components/user/EmailVerification.vue";

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const { locale, setLocale } = useI18n()

const showForm = ref(false)
function showEditForm() {
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

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
        <v-btn class="settingsButton" icon="mdi-cog" color="secondary" @click="showEditForm" />
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
    right: 2em;
    bottom: 2em;
    z-index: 1;
  }
</style>

<script setup lang="ts">
const appStore = useAppStore()

onMounted(async () => {
  await appStore.currentUser()
})
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

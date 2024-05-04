<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSnackbarStore } from '~/store/snackbarStore'

const { t } = useI18n()

const snackbarStore = useSnackbarStore()
const { visible, color, timeout, text } = storeToRefs(snackbarStore)

function hideSnackbar() {
  snackbarStore.hideSnackbar()
}

function showSnackbarInfinity() {
  snackbarStore.showSnackbarInfinity(
    'secondary',
    t('OfflineMode.offline'),
  )
}

onMounted(() => {
  window.addEventListener(
    'online',
    hideSnackbar,
  )
  window.addEventListener(
    'offline',
    showSnackbarInfinity,
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'online',
    hideSnackbar,
  )
  window.removeEventListener(
    'offline',
    showSnackbarInfinity,
  )
})
</script>

<template>
  <v-snackbar :color="color || 'primary'" :model-value="visible" :timeout="timeout || 600">
    <div class="flex justify-center">
      {{ $t(text) }}
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import {
  sendEmailVerification,
} from 'firebase/auth'

const appStore = useAppStore()

const isModalShow = ref(false)
const { auth } = useFirebase()
const { t } = useI18n()
const loading = ref(false)

async function sendEmail() {
  loading.value = true
  if (auth.currentUser)
    await sendEmailVerification(auth.currentUser)
  loading.value = false
  isModalShow.value = !isModalShow.value
}

const hasTimeToVerifyPassed = computed(() => {
  return !auth.currentUser?.emailVerified
})

function signOut() {
  appStore.signOut()
  navigateTo('/')
}

</script>

<template>
  <v-dialog
      v-model="hasTimeToVerifyPassed"
      max-width="500px"
      persistent
  >
    <v-card>
      <v-card-title>
        {{ t("emailVerification.title") }}
      </v-card-title>

      <v-card-text class="text-center">
        <p>{{ t("emailVerification.content") }}</p>

        <v-btn
            :loading="loading"
            color="primary"
            class="my-4"
            block
            prepend-icon="mdi-email-arrow-left-outline"
            :text="t('emailVerification.sendAgain')"
            @click="sendEmail"
        />

        <v-btn
            block
            class="my-4"
            :text="t('emailVerification.signOut')"
            @click="signOut"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

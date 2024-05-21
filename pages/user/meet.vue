<script lang="ts" setup>
import type { THobby } from '~/types/hobby'
import type { UserModel } from '~/models/user'

definePageMeta({
  layout: 'user',
})

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)
const { t } = useI18n()

const currentUser = ref<UserModel>()

const showDetails = ref<boolean>(false)

function setData() {
  if (userData.value != null)
    currentUser.value = userData.value
}

function countAge(dateBirth: Date) {
  const today = new Date()

  let age = today.getFullYear() - dateBirth.getFullYear()
  const m = today.getMonth() - dateBirth.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < dateBirth.getDate()))
    age--

  return age.toString()
}

onMounted(() => setData())
</script>

<template>
  <v-sheet class="d-flex align-center flex-wrap text-center mx-auto my-10 px-4" elevation="4" max-width="1000" rounded>
    <v-card v-if="currentUser" class="mx-auto">
      <v-img width="500" src="/testPerson3.jpg" cover />

      <v-card-title>
        {{ `${currentUser?.firstName} ${currentUser?.lastName}` }}
      </v-card-title>

      <v-card-subtitle>
        {{ `${countAge(currentUser?.dateBirth)}, ${t(`fieldsOfStudies.${currentUser?.fieldOfStudy}`)}` }}
      </v-card-subtitle>
      <v-card-text>
        {{ currentUser?.description }}
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" text="Rozwiń" @click="showDetails = !showDetails" />
      </v-card-actions>

      <v-expand-transition>
        <div v-show="showDetails">
          <v-divider />

          <v-card-text>
            <div>
              tutaj będą wszystkie wiadomości o profilu 
            </div>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-sheet>
</template>

<style>

</style>

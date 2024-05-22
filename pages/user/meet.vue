<script lang="ts" setup>
import type { THobby } from '~/types/hobby'
import type { UserModel } from '~/models/user'
import profileCard from '~/components/user/profileCard.vue'

definePageMeta({
  layout: 'user',
})

const currentUser = ref<UserModel>()

function setData() {
  const appStore = useAppStore()
  const { userData } = storeToRefs(appStore)
  if (userData.value !== undefined)
    currentUser.value = userData.value
}
watch(currentUser, (oldUser, newUser) => {
  currentUser.value = newUser
  setData()
})

onMounted(() => setData())
</script>

<template>
  <v-sheet class="mx-auto my-10 px-4" elevation="4" max-width="700" rounded>
    <profile-card :user="currentUser" />
  </v-sheet>
</template>

<style>

</style>

<script lang="ts" setup>
import type { THobby } from '~/types/hobby'
import type { UserModel } from '~/models/user'
import profileCard from '~/components/user/profileCard.vue'
import likedCard from '~/components/user/likedCard.vue'

definePageMeta({
  layout: 'user',
})

let allUsers: UserModel[]
let currentUser: UserModel
const isReady = ref<boolean>(false)
const endFlag = ref<boolean>(false)
const counter = ref<number>(0)

// async function oldSetData() {
//   const appStore = useAppStore()
//   const { userData } = storeToRefs(appStore)
//   currentUser = userData
// }

async function setData() {
  const appStore = useAppStore()
  try {
    allUsers = await appStore.getAllUsers()
    currentUser = allUsers[0]
    console.log(currentUser)
    isReady.value = true
  }
  catch (e) {
    console.log(e)
  }
}

function thankYouNext() {
  if (counter.value !== allUsers.length - 1) {
    isReady.value = false
    currentUser = allUsers[counter.value + 1]
    counter.value += 1
    isReady.value = true
  }
  else {
    endFlag.value = true
  }
}
// watch(currentUser, (oldUser, newUser) => {
//   currentUser.value = newUser
//   setData()
// })

onMounted(() => setData())
</script>

<template>
  <v-sheet v-if="!endFlag" class="mx-auto my-10 px-4" elevation="4" max-width="700" rounded>
    <profile-card v-if="isReady && !endFlag" :user="currentUser" @dislike="thankYouNext" />
  </v-sheet>
  <v-sheet v-else class="mx-auto my-10 px-4" elevation="4" max-width="700" rounded>
    <v-card
      class="mx-auto"
    >
      <v-img
        class="align-end text-white"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
        cover
      >
        <v-card-title class="text-h4">
          {{ $t("matchingView.endTitle") }}
        </v-card-title>
      </v-img>
      <v-card-text class="text-h6">
        <div>{{ $t("matchingView.endMessage") }}</div>
      </v-card-text>
    </v-card>
  </v-sheet>

  <v-sheet class="mx-auto my-10 px-4" elevation="4" rounded>
    <liked-card :user="currentUser" />
  </v-sheet>
</template>

<style>

</style>

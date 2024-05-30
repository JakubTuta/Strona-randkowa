<script lang="ts" setup>
import type { Timestamp } from 'firebase/firestore'
import type { THobby } from '~/types/hobby'
import type { UserModel } from '~/models/user'
import profileCard from '~/components/user/profileCard.vue'
import likedCard from '~/components/user/likedCard.vue'
import { LikeModel } from '~/models/like'
import { DislikeModel } from '~/models/dislike'

definePageMeta({
  layout: 'user',
})

const matchingStore = useMatchingStore()
const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const currentUser: UserModel | null = userData.value

let allUsers: UserModel[]
let currentDisplayUser: UserModel
const isReady = ref<boolean>(false)
const endFlag = ref<boolean>(false)
const counter = ref<number>(0)

// async function oldSetData() {
//   const appStore = useAppStore()
//   const { userData } = storeToRefs(appStore)
//   currentUser = userData
// }

async function setData() {
  try {
    allUsers = await appStore.getAllUsers()
    currentDisplayUser = allUsers[0]
  }
  catch (e) {
    // console.log(e)
  }
  isReady.value = true
}

function setNewUser() {
  if (counter.value !== allUsers.length - 1) {
    isReady.value = false
    currentDisplayUser = allUsers[counter.value + 1]
    console.log(currentUser)
    console.log(currentDisplayUser)
    counter.value += 1
    isReady.value = true
  }
  else {
    endFlag.value = true
  }
}

function thankYouNext() {
  const newDislike = new DislikeModel({
    whoDisliked: currentUser?.reference,
    dislikedProfile: currentDisplayUser.reference,
    date: new Date(),
  }, null)
  try {
    matchingStore.addDislike(newDislike)
    setNewUser()
  }
  catch (e) {
    console.log(e)
  }
}

function likeProfile() {
  const newLike = new LikeModel({
    whoLiked: currentUser?.reference,
    likedProfile: currentDisplayUser.reference,
    date: new Date(),
  }, null)
  try {
    matchingStore.addLike(newLike)
    setNewUser()
  }
  catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  console.log(currentUser)
  setData()
})
</script>

<template>
  <v-sheet v-if="!endFlag" class="mx-auto my-10 px-4" elevation="4" max-width="700" rounded>
    <profile-card v-if="isReady && !endFlag" :user="currentDisplayUser" @dislike="thankYouNext" @like="likeProfile" />
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

  <!-- <v-sheet class="mx-auto my-10 px-4" elevation="4" rounded>
    <liked-card :user="currentUser" />
  </v-sheet> -->
</template>

<style>

</style>

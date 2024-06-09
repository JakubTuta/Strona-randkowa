<script lang="ts" setup>
import type { UserModel } from '~/models/user'
import profileCard from '~/components/user/profileCard.vue'
import likedCard from '~/components/user/likedCard.vue'
import { LikeModel } from '~/models/like'
import { DislikeModel } from '~/models/dislike'

definePageMeta({
  layout: 'user',
  middleware: ['auth'],
})

const { t } = useI18n()

const matchingStore = useMatchingStore()
const appStore = useAppStore()
const restStore = useRestStore()
const sharedStore = useSharedStore()

const { userData } = storeToRefs(appStore)
// const { allLikes } = storeToRefs(matchingStore)

const currentUser: UserModel | null = userData.value

let allUsers: UserModel[]
let currentDisplayUser: UserModel
const isReady = ref<boolean>(false)
const endFlag = ref<boolean>(false)
const matchFlag = ref<boolean>(false)
const newPairInfo = ref<string>()
const counter = ref<number>(0)

const { userMatches } = storeToRefs(appStore)

async function setData() {
  try {
    console.log(currentUser)
    await restStore.getTopUsers(currentUser)
    const { users } = storeToRefs(restStore)
    console.log(users)
    allUsers = users.value
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
    counter.value += 1
    isReady.value = true

    // newPairInfo.value = `${currentDisplayUser.firstName}, ${t(`fieldsOfStudies.${currentDisplayUser.fieldOfStudy}`)}`
    // matchFlag.value = true
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
    // console.log(e)
  }
}

async function likeProfile() {
  const newLike = new LikeModel({
    whoLiked: currentUser?.reference,
    likedProfile: currentDisplayUser.reference,
    date: new Date(),
  }, null)
  try {
    const check = await restStore.checkMatches(currentUser, newLike)
    console.log(check)
    if (check) {
      const textToShow = t('matchingView.matchSnackbar')
      sharedStore.customTextSnackbar(textToShow)
      newPairInfo.value = `${currentDisplayUser.firstName}, ${t(`fieldsOfStudies.${currentDisplayUser.fieldOfStudy}`)}`
      matchFlag.value = true
    }
    setNewUser()
  }
  catch (e) {
    console.log(e)
  }
}

async function setUserMatches() {
  if (currentUser?.matches !== undefined) {
    await appStore.fetchLikedProfiles(currentUser?.matches)
    console.log(userMatches)
  }
}

onMounted(() => {
  setData()
  matchingStore.getAllLikes()
  setUserMatches()
})
</script>

<template>
  <v-row cols="12">
    <v-col md="6" sm="12">
      <v-sheet v-if="!endFlag" class="mx-auto my-10 px-4" elevation="4" rounded>
        <profile-card v-if="isReady && !endFlag" :user="currentDisplayUser" @dislike="thankYouNext" @like="likeProfile" />
      </v-sheet>
      <v-sheet v-else class="mx-auto my-10 px-4" elevation="4" rounded>
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
    </v-col>

    <v-col md="6" sm="12">
      <v-sheet class="mx-auto my-10 px-4" elevation="4" rounded>
        <v-alert
          v-model="matchFlag"
          class="mx-auto my-10 px-4"
          border="start"
          :text="newPairInfo"
          :title="$t('matchingView.matchSnackbar')"
          type="success"
          closable
        />

        <v-card v-if="userMatches.length">
          <v-card-title class="text-h5 d-flex justify-center align-center flex-column">
            {{ $t("matchingView.yourMatches") }}
          </v-card-title>
          <v-card-text class="d-flex justify-center align-center flex-column">
            <v-row cols="12" class="d-flex justify-center align-center">
              <liked-card v-for="(user, index) in userMatches" :key="index" :user="user" />
            </v-row>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title class="d-flex justify-center align-center flex-column">
            {{ $t("matchingView.noMatches") }}
          </v-card-title>
        </v-card>
      </v-sheet>
    </v-col>
  </v-row>
</template>

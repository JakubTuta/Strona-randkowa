<script lang="ts" setup>
import type { UserModel } from '~/models/user'
import profileCard from '~/components/user/profileCard.vue'
import { LikeModel } from '~/models/like'
import { DislikeModel } from '~/models/dislike'

definePageMeta({
  layout: 'user',
  middleware: ['auth'],
})

const { t } = useI18n()

const matchingStore = useMatchingStore()
const sharedStore = useSharedStore()

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const restStore = useRestStore()
const { users } = storeToRefs(restStore)

const currentDisplayUser = ref<UserModel | null>(null)
const matchFlag = ref(false)
const newPairInfo = ref('')
const counter = ref(0)

async function setData() {
  if (!userData.value)
    return

  await restStore.getTopUsers(userData.value)
  currentDisplayUser.value = users.value[0]
}

function setNewUser() {
  if (counter.value !== users.value.length - 1) {
    currentDisplayUser.value = users.value[counter.value + 1]
    counter.value += 1
  }
}

function thankYouNext() {
  const newDislike = new DislikeModel({
    whoDisliked: userData.value?.reference || null,
    dislikedProfile: currentDisplayUser.value?.reference || null,
    date: new Date(),
  }, null)

  matchingStore.addDislike(newDislike)
  setNewUser()
}

async function likeProfile() {
  const likedProfile = currentDisplayUser.value

  const newLike = new LikeModel({
    whoLiked: userData.value?.reference || null,
    likedProfile: likedProfile?.reference || null,
  }, null)

  restStore.checkMatches(userData.value, newLike).then((response) => {
    if (response) {
      const textToShow = t('matchingView.matchSnackbar')
      sharedStore.customTextSnackbar(textToShow)
      newPairInfo.value = `${likedProfile?.firstName || ''}, ${t(`fieldsOfStudies.${likedProfile?.fieldOfStudy || ''}`)}`
      matchFlag.value = true
    }
  })
  setNewUser()
}

async function setUserMatches() {
  if (!userData.value?.matches.length)
    await appStore.fetchLikedProfiles(userData.value?.matches || [])
}

watch(userData, (newValue) => {
  if (newValue) {
    setData()
    matchingStore.getAllLikes()
    setUserMatches()
  }
}, { immediate: true })

watch(matchFlag, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      matchFlag.value = false
    }, 4000)
  }
})
</script>

<template>
  <v-alert
    v-model="matchFlag"
    position="static"
    border="start"
    :text="newPairInfo"
    :title="$t('matchingView.matchSnackbar')"
    type="success"
    closable
    style="position: fixed; top: 90px; right: 30px; z-index: 1000;"
  >
    <template #close>
      <v-icon color="red" size="large" @click="() => matchFlag = !matchFlag">
        mdi-close-circle-outline
      </v-icon>
    </template>
  </v-alert>

  <v-row class="d-flex align-center justify-center" style="height: 90%">
    <v-col md="6" sm="12">
      <v-sheet v-if="currentDisplayUser" class="mx-auto my-10 px-4" elevation="4" rounded>
        <profile-card :user="currentDisplayUser" @dislike="thankYouNext" @like="likeProfile" />
      </v-sheet>
      <v-sheet v-else elevation="4" rounded>
        <v-card>
          <v-img
            class="align-end text-white"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
          >
            <v-card-title class="text-h4">
              {{ $t("matchingView.endTitle") }}
            </v-card-title>
          </v-img>
          <v-card-text class="text-h6 ma-1">
            <div>{{ $t("matchingView.endMessage") }}</div>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-col>
  </v-row>

  <!-- <v-col md="6" sm="12">
      <v-sheet class="mx-auto my-10 px-4" elevation="4" rounded>
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
    </v-col> -->
</template>

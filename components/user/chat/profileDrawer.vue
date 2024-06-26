<script lang="ts" setup>
import { useDisplay, useTheme } from 'vuetify'
import deleteModal from './deleteModal.vue'
import blockingModal from './blockingModal.vue'
import type { UserModel } from '~/models/user'
import type { THobby } from '~/types/hobby'

const drawerProps = defineProps<{
  pickedUser: UserModel | null
}>()
const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const restStore = useRestStore()

const vTheme = useTheme()
const { name } = useDisplay()
const drawer = defineModel({ default: false })
const { t } = useI18n()

const { pickedUser } = toRefs(drawerProps)

const userAge = computed(() => {
  const today = new Date()
  const userDate = pickedUser.value?.dateBirth || new Date()

  const yearDifference = today.getFullYear() - userDate.getFullYear()

  const monthDifference = today.getMonth() - userDate.getMonth()
  const dayDifference = today.getDate() - userDate.getDate()

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0))
    return yearDifference - 1

  return yearDifference
})

const drawerWidth = computed(() => {
  switch (name.value) {
    case 'xs':
      return 300
    case 'sm':
      return 400
    case 'md':
      return 500
    case 'lg':
      return 600
    case 'xl':
      return 700
    default:
      return 600
  }
})

function setDateString(date: Date) {
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const userDetails = computed(() => {
  if (pickedUser.value) {
    return {
      birthDate: setDateString(pickedUser.value.dateBirth),
      gender: pickedUser.value.gender,
      faculty: pickedUser.value.faculty,
      fieldOfStudy: pickedUser.value.fieldOfStudy,
      preferredGender: pickedUser.value.preferredGender,
      lookingFor: pickedUser.value.lookingFor,
      hobbies: pickedUser.value.hobbies,
      totalScore: countTotalRating(pickedUser.value.score),
    }
  }
  else {
    return {
      birthDate: '',
      gender: '',
      faculty: '',
      fieldOfStudy: '',
      preferredGender: '',
      lookingFor: '',
      hobbies: [],
      totalScore: 0,
    }
  }
})

function countTotalRating(scores: any) {
  if (scores.length) {
    let sum = 0
    const totalElements = scores.length

    for (let i = 0; i < totalElements; i++) {
      sum += scores[i].score
    }

    return sum / totalElements
  }
  else {
    return 0
  }
}

const rateFlag = ref<boolean>(false)
const rating = ref<number>()

function changeRateFlag() {
  rateFlag.value = !rateFlag.value
}

async function addRating() {
  console.log(userData.value.reference)
  console.log(pickedUser.value?.reference)
  console.log(rating.value)
  try {
    await restStore.rateProfile(userData.value?.reference, pickedUser.value?.reference, rating.value)
  }
  catch (e) {
    console.log(e)
  }
  changeRateFlag()
  rating.value = 0
}

const deleteModalFlag = ref<boolean>(false)

function changeDeleteModalFlag() {
  deleteModalFlag.value = !deleteModalFlag.value
}

async function deleteUserFromMatches() {
  console.log(userData.value?.reference)
  console.log(pickedUser.value?.reference)
  await appStore.deleteMatch(userData.value?.reference, pickedUser.value?.reference)
}

const blockModalFlag = ref<boolean>(false)

function changeBlockModalFlag() {
  blockModalFlag.value = !blockModalFlag.value
}

async function blockUser() {
  console.log(userData.value?.reference)
  console.log(pickedUser.value?.reference)
  await appStore.blockProfile(userData.value?.reference, pickedUser.value?.reference)
}
</script>

<template>
  <v-navigation-drawer v-model="drawer" :width="drawerWidth" temporary location="right" class="pt-2 px-2">
    <v-row>
      <v-col cols="12" align="center">
        <v-avatar
          class="ma-3"
          rounded="xl"
          size="100"
        >
          <v-img v-if="pickedUser?.photos.length" :src="pickedUser?.photos[0]" />
          <v-img v-else-if="vTheme.current.value.dark" src="/account-dark.png" />
          <v-img v-else src="/account-white.png" />
        </v-avatar>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" align="center" class="text-h3">
        {{ pickedUser?.firstName }} {{ pickedUser?.lastName }}, {{ userAge }}
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="6" align="center">
        <v-tooltip
          :text="$t('chatView.rate')"
          location="top"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              density="comfortable"
              icon="mdi-star"
              color=""
              size="large" class="mr-1"
              @click="changeRateFlag"
            />
          </template>
        </v-tooltip>

        <v-tooltip
          :text="$t('chatView.remove')"
          location="top"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              density="comfortable"
              icon="mdi-delete-outline"
              color=""
              size="large" class="mr-1 ml-1"
              @click="changeDeleteModalFlag"
            />
          </template>
        </v-tooltip>

        <v-tooltip
          :text="$t('chatView.block')"
          location="top"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              density="comfortable"
              icon="mdi-lock"
              color=""
              size="large" class="ml-1"
              @click="changeBlockModalFlag"
            />
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row justify="center">
      <div v-if="rateFlag" class="d-flex align-center">
        <v-rating
          v-model="rating"
          class="ma-2"
          density="compact"
        />
        <v-btn
          density="comfortable"
          icon="mdi-check"
          color="primary"
          size="small"
          class="ml-2"
          @click="addRating"
        />
      </div>
      <div v-else>
        <v-rating
          v-if="!rateFlag"
          v-model="userDetails.totalScore"
          class="ma-2"
          density="compact"
          readonly
        />
      </div>
    </v-row>

    <v-row>
      <v-col class="text-h6" cols="12" align="center">
        {{ pickedUser?.description }}
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6" sm="12">
        <v-text-field v-model="userDetails.birthDate" :label="t('profile.dateBirth')" readonly />
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-text-field v-model="userDetails.gender" :value="t(`user.sex.${userDetails.gender}`)" :label="t('profile.gender')" readonly />
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-text-field v-model="userDetails.faculty" :label="t('profile.faculty')" readonly />
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-text-field
          v-model="userDetails.fieldOfStudy" :value="t(`fieldsOfStudies.${userDetails.fieldOfStudy}`)" :label="t('profile.fieldOfStudy')"
          readonly
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="6" sm="12">
        <v-text-field
          v-model="userDetails.lookingFor" :value="t(`user.preferredRelationship.${userDetails.lookingFor}`)"
          :label="t('profile.lookingFor')" readonly
        />
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-text-field
          v-model="userDetails.preferredGender" :value="t(`user.sex.${userDetails.preferredGender}`)"
          :label="t('profile.preferredGender')" readonly
        />
      </v-col>
      <v-col cols="12" md="12" sm="12" class="d-flex justify-center">
        <v-chip-group v-if="userDetails.hobbies">
          <v-chip v-for="element in userDetails.hobbies" :key="element" size="large" draggable>
            {{ t(`user.hobbies.${element}`) }}
          </v-chip>
        </v-chip-group>
        <v-chip-group v-else>
          <v-chip size="large" class="outlined">
            {{ t("profile.nothingToShow") }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row justify="center">
      <div v-for="(photo, index) in pickedUser?.photos.slice(1)" :key="index" :value="photo">
        <v-col>
          <v-img
            class="mx-auto my-5 elevation-5" rounded="xl" :width="150" :height="150" cover
            :src="photo"
          />
        </v-col>
      </div>
    </v-row>

    <delete-modal :is-show="deleteModalFlag" @on-delete="deleteUserFromMatches" @on-close="changeDeleteModalFlag" />
    <blocking-modal :is-show="blockModalFlag" @on-block="blockUser" @on-close="changeBlockModalFlag" />
  </v-navigation-drawer>
</template>

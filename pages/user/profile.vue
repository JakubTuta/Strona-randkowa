<script lang="ts" setup>
import EditProfile from '~/components/user/profile/editProfile.vue'
import EditPreferences from '~/components/user/profile/editPreferences.vue'
import type { THobby } from '~/types/hobby'
import type { UserModel } from '~/models/user'

definePageMeta({
  layout: 'user',
  middleware: ['auth'],
})

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)
const { t } = useI18n()

const currentUser: UserModel | null = userData.value

const description = ref<string>('')
const name = ref<string>('')
const surname = ref<string>('')
const age = ref<string>('')
const index = ref<string>('')
const gender = ref<string>('')
const birthDate = ref < string >('')
const faculty = ref<string>('')
const fieldOfStudy = ref<string>('')
const preferredGender = ref<string>('')
const lookingFor = ref<string>('')
const hobbies = ref<THobby[]>()

const photoAddFlag = ref<boolean>(true)
const editPhotosFlag = ref<boolean>(false)

const image = ref('')

function countAge(dateBirth: Date) {
  const today = new Date()

  let age = today.getFullYear() - dateBirth.getFullYear()
  const m = today.getMonth() - dateBirth.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < dateBirth.getDate()))
    age--

  return age.toString()
}

function setDateString(date: Date) {
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function setData() {
  console.log(currentUser)
  if (currentUser != null) {
    description.value = currentUser.description
    surname.value = currentUser.lastName
    name.value = currentUser.firstName
    index.value = (currentUser.index).toString()
    age.value = countAge(currentUser.dateBirth)
    birthDate.value = setDateString(currentUser.dateBirth)
    gender.value = currentUser.gender
    faculty.value = currentUser.faculty
    fieldOfStudy.value = currentUser.fieldOfStudy
    preferredGender.value = currentUser.preferredGender
    lookingFor.value = currentUser.lookingFor
    hobbies.value = currentUser.hobbies
    if (currentUser.photos.length > 3)
      photoAddFlag.value = false
  }
}

const editProfileFlag = ref<boolean>(false)
const editPreferencesFlag = ref<boolean>(false)

function changeProfileEditFlag() {
  editProfileFlag.value = !editProfileFlag.value
}

function changePreferencesEditFlag() {
  editPreferencesFlag.value = !editPreferencesFlag.value
}

function changeEditPhotosFlag() {
  editPhotosFlag.value = !editPhotosFlag.value
}

watch(currentUser, async (newUser, oldUser) => {
  setData()
})

onMounted(() => {
  setData()
  console.log(currentUser?.photos.length)
},
)

function setImage(url: string) {
  image.value = url
  if (currentUser != null)
    appStore.addImage(currentUser, url)
}

function deleteImage(url: string) {
  const string = appStore.getPhotoPath(url)
  console.log(url)
  console.log(string)
  if (currentUser != null)
    appStore.removeImage(currentUser, url)
  editPhotosFlag.value = false
  photoAddFlag.value = true
}

function setMainPhoto(url: string) {
  if (currentUser != null)
    appStore.editMainPhoto(currentUser, url)
}
</script>

<template>
  <v-row justify="center" cols="12" class="mx-2">
    <v-col cols="12" sm="10" md="6">
      <v-sheet
        class="d-flex align-center flex-wrap text-center mx-auto my-10 px-4" elevation="4" max-height="1200"
        max-width="1100" rounded
      >
        <v-col>
          <v-row justify="center">
            <v-col sm="12" md="12">
              <div class="text-h5 my-2">
                <v-icon left class="mr-2">
                  mdi-face-man-shimmer
                </v-icon>
                {{ t('profile.yourMainPhoto') }}
              </div>
              <div>
                <v-img
                  class="mx-auto my-5 elevation-5" rounded="xl" :width="400" :height="400" cover
                  :src="userData?.photos[0]"
                />
              </div>
            </v-col>
          </v-row>

          <v-row justify="center">
            <div v-for="(photo, index) in userData?.photos.slice(1)" :key="index" :value="photo">
              <v-col>
                <v-img
                  class="mx-auto my-5 elevation-5" rounded="xl" :width="150" :height="150" cover
                  :src="photo"
                />
                <v-btn v-if="editPhotosFlag" size="small" color="primary" icon="mdi-face-man-shimmer" class="mr-2" @click="setMainPhoto(photo)" />
                <v-btn v-if="editPhotosFlag" size="small" color="error" icon="mdi-delete" class="ml-2" @click="deleteImage(photo)" />
              </v-col>
            </div>
          </v-row>

          <v-row justify="center">
            <UploadImage v-if="photoAddFlag" class="my-2" @set-image="setImage" />

            <v-col>
              <v-btn v-if="!editPhotosFlag" append-icon="mdi-grease-pencil" color="secondary" @click="changeEditPhotosFlag">
                {{ t('profile.configuration') }}
              </v-btn>
              <v-btn v-else @click="changeEditPhotosFlag">
                {{ t('universal.form.close') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-sheet>
    </v-col>

    <v-col cols="12" sm="10" md="6">
      <v-sheet
        class="d-flex align-center flex-wrap text-center mx-auto my-10 px-4" elevation="4" max-width="1100"
        max-height="1300" height="782" rounded
      >
        <v-col cols="12" sm="12" md="12">
          <v-row>
            <div class="mx-auto text-h4 flex-wrap my-2">
              {{ `${userData?.firstName} ${userData?.lastName}, ${age}` }}
              <v-card-subtitle>
                {{ index }}
              </v-card-subtitle>
            </div>
          </v-row>

          <v-row>
            <v-col cols="12" md="12" sm="12">
              <v-textarea v-model="description" rows="3" no-resize density="compact" variant="outlined" :label="t('profile.description')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="birthDate" density="compact" :label="t('profile.dateBirth')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="gender" density="compact" :value="t(`user.sex.${gender}`)" :label="t('profile.gender')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="faculty" density="compact" :label="t('profile.faculty')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                v-model="fieldOfStudy"
                density="compact" :value="t(`fieldsOfStudies.${fieldOfStudy}`)" :label="t('profile.fieldOfStudy')"
                readonly
              />
            </v-col>
          </v-row>

          <v-card-actions class="justify-end">
            <v-btn variant="elevated" append-icon="mdi-grease-pencil" @click="changeProfileEditFlag()">
              {{ t("profile.editProfile") }}
            </v-btn>
          </v-card-actions>

          <v-row>
            <v-col cols="12" md="12" sm="12">
              <div class="mx-auto text-h5">
                {{ t("profile.yourPreferences") }}
              </div>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                v-model="lookingFor"
                density="compact" :value="t(`user.preferredRelationship.${lookingFor}`)"
                :label="t('profile.lookingFor')" readonly
              />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field
                v-model="preferredGender"
                density="compact" :value="t(`user.sex.${preferredGender}`)"
                :label="t('profile.preferredGender')" readonly
              />
            </v-col>
            <v-col cols="12" md="12" sm="12" class="d-flex justify-center">
              <v-chip-group v-if="hobbies">
                <v-chip v-for="element in hobbies" :key="element" size="large" draggable>
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

          <v-card-actions class="justify-end">
            <v-btn variant="elevated" append-icon="mdi-grease-pencil" @click="changePreferencesEditFlag()">
              {{ t("profile.editPreferences") }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-sheet>
    </v-col>
  </v-row>

  <EditProfile :is-show="editProfileFlag" :user-data="currentUser" @on-close="changeProfileEditFlag" />
  <EditPreferences :is-show="editPreferencesFlag" :user-data="currentUser" @on-close="changePreferencesEditFlag" />
</template>

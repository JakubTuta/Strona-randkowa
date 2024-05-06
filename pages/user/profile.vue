<script lang="ts" setup>
import EditProfile from '~/components/user/editProfile.vue'
import EditPreferences from '~/components/user/editPreferences.vue'

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const name = ref<string>('')
const surname = ref<string>('')
const age = ref<string>('')
const index = ref<string>('')
const gender = ref<string>('')
const birthDate = ref < string >('')
const faculty = ref<string>('')
const preferredGender = ref<string>('')
const lookingFor = ref<string>('')

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
  if (userData.value != null) {
    surname.value = userData.value.lastName
    name.value = userData.value.firstName
    index.value = (userData.value.index).toString()
    age.value = countAge(userData.value.dateBirth)
    birthDate.value = setDateString(userData.value.dateBirth)
    gender.value = userData.value.gender
    faculty.value = userData.value.faculty
    preferredGender.value = userData.value.preferred_gender
    lookingFor.value = userData.value.looking_for
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
definePageMeta({
  layout: 'user',
})

onMounted(() => {
  setData()
},
)
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" sm="12" md="6">
      <v-sheet
        class="d-flex align-center flex-wrap text-center mx-auto my-10 px-4" elevation="4" max-height="1200"
        max-width="1100" rounded
      >
        <v-row justify="center">
          <v-col cols="12" sm="12" md="12">
            <div>
              <v-card-title class="text-h4 my-2">
                Twoje profilowe:
              </v-card-title>
            </div>
            <div>
              <v-img
                class="mx-auto my-5 elevation-5" rounded="xl" :width="400" :height="400" cover
                src="/testPerson3.jpg"
              />
            </div>

            <!-- ZMIENIĆ NA PĘTLE WYŚWIETLANIE ZDJĘĆ W ZALEŻNOŚCI OD DŁUGOŚCI TABLICY PHOTOS W USERZE -->
            <v-row justify="center">
              <div>
                <v-col>
                  <v-img
                    class="mx-auto my-5 elevation-5" rounded="xl" :width="150" :height="150" cover
                    src="/testPerson3.jpg"
                  />
                </v-col>
              </div>

              <div>
                <v-col>
                  <v-img
                    class="mx-auto my-5 elevation-5" rounded="xl" :width="150" :height="150" cover
                    src="/testPerson3.jpg"
                  />
                </v-col>
              </div>

              <div>
                <v-col>
                  <v-img
                    class="mx-auto my-5 elevation-5" rounded="xl" :width="150" :height="150" cover
                    src="/testPerson3.jpg"
                  />
                </v-col>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>

    <v-col cols="12" sm="12" md="6">
      <v-sheet
        class="d-flex align-center flex-wrap text-center mx-auto my-10 px-4" elevation="4" max-width="1100"
        max-height="1200" rounded
      >
        <v-col cols="12" sm="12" md="12">
          <v-row>
            <div class="mx-auto">
              <v-card-title class="text-h4 flex-wrap">
                {{ `${userData?.firstName} ${userData?.lastName}, ${age}` }}
              </v-card-title>
              <v-card-subtitle>
                {{ index }}
              </v-card-subtitle>
            </div>
          </v-row>

          <v-row>
            <v-col cols="12" md="12" sm="12">
              <v-text-field :label="$t('profile.description')" readonly />
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-text-field v-model="birthDate" :label="$t('profile.dateBirth')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="gender" :label="$t('profile.gender')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="faculty" :label="$t('profile.faculty')" readonly />
            </v-col>
            <!-- <v-col cols="12" md="6" sm="12">
              <v-text-field :label="$t('profile.fieldOfStudy')" readonly />
            </v-col> -->
          </v-row>

          <v-card-actions class="justify-end">
            <v-btn @click="changeProfileEditFlag()">
              {{ $t("profile.editProfile") }}
            </v-btn>
          </v-card-actions>

          <v-row>
            <div class="mx-auto">
              <v-card-title class="text-h4">
                {{ $t("profile.yourPreferences") }}
              </v-card-title>
            </div>
          </v-row>

          <v-row>
            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="lookingFor" :label="$t('profile.lookingFor')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field v-model="preferredGender" :label="$t('profile.prefferedGender')" readonly />
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-chip-group>
                <v-chip
                  v-for="element in ['Silownia', 'Piłka', 'Książki', 'Praca', 'IT', 'Basen', 'Koszenie trawy']"
                  :key="element" size="large" class="outlined"
                >
                  {{ element }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>

          <v-card-actions class="justify-end">
            <v-btn @click="changePreferencesEditFlag()">
              {{ $t("profile.editPreferences") }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-sheet>
    </v-col>
  </v-row>

  <EditProfile :is-show="editProfileFlag" @on-close="changeProfileEditFlag" />
  <EditPreferences :is-show="editPreferencesFlag" @on-close="changePreferencesEditFlag" />
</template>

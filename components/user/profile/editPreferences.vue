<script lang="ts" setup>
import type { UserModel } from '~/models/user'
import { useGenders } from '~/composables/genders'
import type { TPreferredGender } from '~/types/preferredGender'
import type { TLookingFor } from '~/types/lookingFor'
import { useRelationship } from '~/composables/relationship'
import { useHobbies } from '~/composables/hobbies'
import type { THobby } from '~/types/hobby'

const props = defineProps<{
  isShow: boolean
  userData: UserModel | null
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
  (e: 'onSave'): UserModel
}>()

const appStore = useAppStore()
const { isShow, userData } = toRefs(props)
const { t } = useI18n()

const { mappedRelationships } = useRelationship()
const { mappedGendersPreferences } = useGenders()
const { mappedHobbies } = useHobbies()

const newDataUser = ref<UserModel | null>(userData.value)
const isShowRef = ref<boolean>()

const currentGenderPref = ref<TPreferredGender>()
const currentLookingFor = ref<TLookingFor>()
const hobbiesList = ref<THobby[]>()
// const currentDate = ref<Date>(newDataUser.value?.dateBirth)

function setCurrentStudentData() {
  if (userData.value != null)
    newDataUser.value = userData.value

  if (newDataUser.value != null) {
    currentGenderPref.value = newDataUser.value.preferredGender
    currentLookingFor.value = newDataUser.value.lookingFor
    hobbiesList.value = newDataUser.value.hobbies
  }
}

function close() {
  emit('onClose')
}

function saveData() {
  if (newDataUser.value != null) {
    newDataUser.value.preferredGender = currentGenderPref.value
    newDataUser.value.lookingFor = currentLookingFor.value
    newDataUser.value.hobbies = hobbiesList.value
    appStore.editUser(newDataUser.value)
  }
  emit('onSave')
  emit('onClose')
}
setCurrentStudentData()
watch(isShow, () => isShowRef.value = isShow.value)
</script>

<template>
  <v-dialog max-width="800px" :model-value="isShowRef" scrollable @update:model-value="close">
    <v-card>
      <v-card-title class="text-h5 flex-wrap">
        {{ t("profile.editProfile") }}
      </v-card-title>
      <v-card-text>
        <v-select
          v-model="currentLookingFor" :label="t('profile.lookingFor')" :items="mappedRelationships"
          variant="outlined"
        />

        <v-select
          v-model="currentGenderPref" :label="t('profile.prefferedGender')" :items="mappedGendersPreferences"
          variant="outlined"
        />
        <v-select v-model="hobbiesList" :items="mappedHobbies" label="Hobby" chips multiple />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="close">
          {{ t('universal.form.close') }}
        </v-btn>
        <v-btn color="success" @click="saveData">
          {{ t('universal.form.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

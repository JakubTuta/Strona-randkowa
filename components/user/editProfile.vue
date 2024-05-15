<script lang="ts" setup>
import { useFaculties } from '~/composables/faculties'
import { useFieldsOfStudies } from '~/composables/fieldsOfStudies'
import type { UserModel } from '~/models/user'
import { useGenders } from '~/composables/genders'
import type { TGender } from '~/types/gender'
import { descriptionLenghtRule, requiredRule } from '~/helpers/rules'
import formValidation from '~/helpers/formValidation'

const props = defineProps<{
  isShow: boolean
  userData: UserModel | null
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
  (e: 'onSave'): UserModel
}>()

const { form, valid, isValid } = formValidation()

const appStore = useAppStore()
const { isShow, userData } = toRefs(props)

const { facultiesList } = useFaculties()
const { mappedGenders } = useGenders()
const { mappedFieldsOfStudies } = useFieldsOfStudies()

const newDataUser = ref<UserModel | null>(userData.value)
const isShowRef = ref<boolean>()

const currentName = ref<string>('')
const currentSurname = ref<string>('')
const currentDescription = ref<string>('')
const currentFaculty = ref<string>('')
const currentFieldOfStudy = ref<string>('')
const currentGender = ref<TGender>()
// const currentDate = ref<Date>(newDataUser.value?.dateBirth)

function setCurrentStudentData() {
  if (userData.value != null)
    newDataUser.value = userData.value

  if (newDataUser.value != null) {
    currentDescription.value = newDataUser.value.description
    currentFaculty.value = newDataUser.value.faculty
    currentFieldOfStudy.value = newDataUser.value.fieldOfStudy
    currentGender.value = newDataUser.value.gender
    currentName.value = newDataUser.value.firstName
    currentSurname.value = newDataUser.value.lastName
  }
}

function close() {
  emit('onClose')
}

async function saveData() {
  if (await isValid() && newDataUser.value != null) {
    newDataUser.value.firstName = currentName.value
    newDataUser.value.lastName = currentSurname.value
    newDataUser.value.description = currentDescription.value
    newDataUser.value.faculty = currentFaculty.value
    newDataUser.value.fieldOfStudy = currentFieldOfStudy.value
    newDataUser.value.gender = currentGender.value
    appStore.editUser(newDataUser.value)
    emit('onSave')
    emit('onClose')
  }
}
setCurrentStudentData()
watch(isShow, () => isShowRef.value = isShow.value)
</script>

<template>
  <v-dialog max-width="800px" :model-value="isShowRef" scrollable @update:model-value="close">
    <v-card>
      <v-card-title class="text-h5 flex-wrap">
        {{ $t("profile.editProfile") }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" class="w-100" @submit.prevent="saveData">
          <v-text-field v-model="currentName" :label="$t('profile.firstName')" :rules="[requiredRule()]" />
          <v-text-field v-model="currentSurname" :label="$t('profile.lastName')" :rules="[requiredRule()]" />

          <v-text-field
            v-model="currentDescription" :label="$t('profile.description')"
            :rules="[descriptionLenghtRule()]"
          />

          <v-select v-model="currentFaculty" :label="$t('profile.faculty')" :items="facultiesList" variant="outlined" />
          <v-select
            v-model="currentFieldOfStudy" :label="$t('profile.fieldOfStudy')" :items="mappedFieldsOfStudies"
            variant="outlined"
          />
          <v-select v-model="currentGender" :label="$t('profile.gender')" :items="mappedGenders" variant="outlined" />

          <!-- <VueDatePicker
          v-model="currentDate" class="py-4" auto-apply placeholder="Podaj datę urodzenia"
          :enable-time-picker="false" position="left"
        /> -->
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="close">
          Zamknij
        </v-btn>
        <v-btn color="success" @click="saveData">
          Zapisz
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

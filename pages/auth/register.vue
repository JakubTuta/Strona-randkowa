<script setup lang="ts">
import type { DocumentReference } from 'firebase/firestore'
import { useTheme } from 'vuetify'
import VueDatePicker from '@vuepic/vue-datepicker'
import formValidation, { validateForm } from '~/helpers/formValidation'
import { lengthRule, lengthRuleShort, passwordRule, requiredRule } from '~/helpers/rules'
import { type IUser, UserModel } from '~/models/user'
import type { TGender } from '~/types/gender'
import { useFieldsOfStudies } from '~/composables/fieldsOfStudies'

import '@vuepic/vue-datepicker/dist/main.css'

let createdUserRef: DocumentReference | null = null
const { t } = useI18n()

useHead({
  title: `${t('registration.register')} - ${t('appName')}`,
})

const appStore = useAppStore()
const sharedStore = useSharedStore()

const router = useRouter()
const { current } = useTheme()

const { mappedGenders, mappedGendersPreferences } = useGenders()
const { mappedRelationships } = useRelationship()
const { facultiesList } = useFaculties()
const { fieldsOfStudies } = useFieldsOfStudies()

const { form, valid, isValid } = formValidation()

const credentialsForm: Ref<null | {
  resetValidation: () => void
  reset: () => void
  validate: () => Promise<{ valid: boolean }>
}> = ref(null)

const infoForm: Ref<null | {
  resetValidation: () => void
  reset: () => void
  validate: () => Promise<{ valid: boolean }>
}> = ref(null)

const name = ref('')
const surname = ref('')
const gender: Ref<TGender | null> = ref(null)
const faculty: Ref<string | null> = ref(null)
const fieldOfStudy: Ref<string | null> = ref(null)
const password1 = ref('')
const password2 = ref('')
const rules = ref(false)
const index = ref('')
const dateBirth = ref(null)
const preferredGender = ref(null)
const lookingFor = ref(null)
const image = ref('')

const isPasswordShown = ref(false)
const currentStep = ref('1')

function verifyPassword() {
  return password1.value === password2.value
}

function prepareNewAccount() {
  return new UserModel(
    {
      firstName: name.value,
      lastName: surname.value,
      email: `${index.value}@edu.p.lodz.pl`,
      dateBirth: dateBirth.value ? dateBirth.value : new Date(),
      index: Number.parseInt(index.value),
      gender: gender.value || 'other',
      faculty: faculty.value || '',
      fieldOfStudy: fieldOfStudy.value || '',
      role: 'user',
      description: '',
      score: {
        count: 0,
        average: 0,
      },
      elo: 1000,
      preferredGender: preferredGender.value || 'any',
      lookingFor: lookingFor.value || 'other',
      photos: [image.value],
      blockedProfiles: [],
      hobbies: [],
      matches: [],
      verifiedImages: 0,
      languageCode: 'pl',
    },
    createdUserRef,
  )
}

async function createAccount() {
  let canCreateAccount = true

  if (!await isValid())
    canCreateAccount = false

  if (!image.value) {
    sharedStore.failureSnackbar({ code: String(t('registration.noPhoto')) })
    canCreateAccount = false
  }

  if (!dateBirth.value) {
    sharedStore.failureSnackbar({ code: String(t('registration.noBirthDate')) })
    canCreateAccount = false
  }

  if (canCreateAccount) {
    createdUserRef = await appStore.registerWithPassword(`${index.value}@edu.p.lodz.pl`, password1.value)

    if (createdUserRef) {
      await appStore.createUser(prepareNewAccount())
      sharedStore.successSnackbar()
      router.push('/')
    }
  }
}

async function checkStepCondition(next: () => void) {
  let canProceedToNextStep = true

  if (index.value.length !== 6) {
    sharedStore.failureSnackbar({ code: String(t('registration.invalidIndex')) })
    canProceedToNextStep = false
  }

  if (!verifyPassword()) {
    sharedStore.failureSnackbar({ code: String(t('universal.passwordsNotMatch')) })
    canProceedToNextStep = false
  }

  if (currentStep.value === '1' && (!credentialsForm.value || !await validateForm(credentialsForm.value)))
    canProceedToNextStep = false

  if (currentStep.value === '2' && (!infoForm.value || !await validateForm(infoForm.value)))
    canProceedToNextStep = false

  if (canProceedToNextStep)
    next()
}

const isDark = computed(() => {
  return current.value.dark
})

function setImage(url: string) {
  image.value = url
}
</script>

<template>
  <v-img
    src="/landingTwo.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
    class="d-flex justify-center flex-wrap w-100 h-100"
  >
    <v-card
      class="d-flex align-center justify-center flex-wrap text-center mx-auto mb-4  mt-16 pt-16 px-4 bg-transparent text-white"
      elevation="0" max-width="1100" rounded
    >
      <v-row justify="center">
        <v-col cols="12" sm="12" md="10">
          <div class="d-flex flex-column align-center justify-center h-100 mx-2 py-4">
            <div class="text-h4 my-2">
              {{ t('registration.register') }}
            </div>

            <v-col cols="12" md="10" lg="8">
              <v-stepper v-model="currentStep" class="stepper w-100" elevation="8">
                <template #default="{ prev, next }">
                  <v-stepper-header>
                    <v-stepper-item :title="t('registration.step', { step: 1 })" value="1" color="secondary" />

                    <v-divider />

                    <v-stepper-item
                      :title="t('registration.step', { step: 2 })"
                      value="2" color="secondary"
                    />

                    <v-divider />

                    <v-stepper-item :title="t('registration.step', { step: 3 })" value="3" color="secondary" />
                  </v-stepper-header>

                  <v-stepper-window>
                    <v-stepper-window-item value="1">
                      <v-form ref="credentialsForm">
                        <div class="py-4">
                          <div>
                            <span>
                              {{ t('registration.studentIndex') }}
                            </span>
                            <v-otp-input
                              v-model="index"
                              type="number"
                              class="mb-4"
                              @keyup.enter="createAccount"
                            />
                          </div>

                          <v-text-field
                            v-model="password1" :label="t('registration.password')" color="secondary"
                            :append-inner-icon="isPasswordShown ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="isPasswordShown ? 'text' : 'password'" :rules="[requiredRule(), passwordRule()]"
                            prepend-inner-icon="mdi-lock" density="comfortable" @keyup.enter="checkStepCondition(next)"
                            @click:append-inner="isPasswordShown = !isPasswordShown"
                          />

                          <v-text-field
                            v-model="password2" prepend-inner-icon="mdi-lock" color="secondary"
                            :label="t('registration.repeatPassword')"
                            :append-inner-icon="isPasswordShown ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="isPasswordShown ? 'text' : 'password'" :rules="[requiredRule(), passwordRule()]"
                            density="comfortable" @keyup.enter="checkStepCondition(next)"
                            @click:append-inner="isPasswordShown = !isPasswordShown"
                          />
                        </div>
                      </v-form>
                    </v-stepper-window-item>

                    <v-stepper-window-item value="2">
                      <v-form ref="infoForm">
                        <div class="py-4">
                          <v-select
                            v-model="gender" :label="t('registration.sex')" :items="mappedGenders"
                            color="secondary" variant="outlined" density="comfortable"
                            :rules="[requiredRule()]"
                          />

                          <v-select
                            v-model="faculty" :label="t('registration.faculty')" :items="facultiesList"
                            color="secondary" variant="outlined" density="comfortable"
                            :rules="[requiredRule()]"
                          />

                          <v-select
                            v-model="fieldOfStudy" :label="t('registration.fieldOfStudy')"
                            :items="fieldsOfStudies" color="secondary" variant="outlined" density="comfortable"
                            :rules="[requiredRule()]"
                          />

                          <v-select
                            v-model="preferredGender" :label="t('registration.preferredGender')"
                            :items="mappedGendersPreferences" color="secondary" variant="outlined"
                            density="comfortable"
                            :rules="[requiredRule()]"
                          />

                          <v-select
                            v-model="lookingFor" :label="t('registration.lookingFor')"
                            :items="mappedRelationships" color="secondary" variant="outlined" density="comfortable"
                            :rules="[requiredRule()]"
                          />
                        </div>
                      </v-form>
                    </v-stepper-window-item>

                    <v-stepper-window-item value="3">
                      <v-form ref="form" v-model="valid" @submit.prevent="createAccount">
                        <div class="py-4">
                          <VueDatePicker
                            v-model="dateBirth" class="mb-6" :dark="isDark" auto-apply
                            :placeholder="t('registration.giveBirthDate')" :enable-time-picker="false" position="left"
                            :max-date="new Date()"
                          />

                          <v-text-field
                            v-model="name" :label="t('registration.name')" type="text"
                            :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" density="comfortable"
                            color="secondary" @keyup.enter="createAccount"
                          />

                          <v-text-field
                            v-model="surname" :label="t('registration.surname')" type="text"
                            :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" density="comfortable"
                            color="secondary" @keyup.enter="createAccount"
                          />

                          <v-checkbox
                            v-model="rules" color="secondary" class="mt-n4 mb-2 "
                            :label="t('registration.acceptPolicy')" :rules="[requiredRule()]"
                          />

                          <UploadImage :image="image" class="my-2" @set-image="setImage" />
                        </div>
                      </v-form>

                      <v-btn variant="elevated" color="secondary" @click="createAccount">
                        {{ t('registration.registerYourself') }}
                      </v-btn>
                    </v-stepper-window-item>
                  </v-stepper-window>
                  <v-stepper-actions :next-text="$t('registration.nextStep')" :prev-text="$t('registration.prevStep')" @click:prev="prev" @click:next="checkStepCondition(next)" />
                </template>
              </v-stepper>
            </v-col>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-img>
</template>

<style scoped>
.stepper {
  background: rgba(0, 0, 0, 0.76);
  color: white;
}
</style>

<style>
:root {
  /* Vue datepicker styling */
  --dp-font-family: Roboto, sans-serif;
  --dp-input-padding: 11px 30px 11px 12px; /*Padding in the input*/
  --dp-cell-size: 28px;   /*Width and height of calendar cell*/

}

.dp__theme_dark {
  --dp-background-color: rgba(0, 0, 0, 0.6);
  --dp-primary-color: #87CACA;
  --dp-border-color: rgb(133, 133, 133);
  --dp-disabled-color-text: #fff;
}

.dp__theme_light {
  --dp-background-color: rgba(0, 0, 0, 0.6);
  --dp-primary-color: #76A8A8;
    --dp-border-color: rgb(133, 133, 133);
}

::placeholder {
  color: white;
  opacity: 1; /* Firefox */
}
</style>

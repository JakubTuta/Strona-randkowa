<script setup lang="ts">
import type { DocumentReference } from 'firebase/firestore'
import { useTheme } from 'vuetify'
import VueDatePicker from '@vuepic/vue-datepicker'
import { Timestamp } from 'firebase/firestore'
import formValidation, { validateForm } from '~/helpers/formValidation'
import { emailRule, lengthRule, lengthRuleShort, passwordRule, requiredRule } from '~/helpers/rules'
import { UserModel } from '~/models/user'
import type { TGender } from '~/types/gender'

import '@vuepic/vue-datepicker/dist/main.css'

let createdUserRef: DocumentReference | null = null
const { t } = useI18n()

useHead({
  title: 'Rejestracja - ' +  t("appName"),
})

const appStore = useAppStore()
const sharedStore = useSharedStore()

const router = useRouter()
const { current } = useTheme()

const { mappedGenders, mappedGendersPreferences } = useGenders()
const { mappedRelationships } = useRelationship()
const { facultiesList } = useFaculties()

const { form, valid, isValid } = formValidation()

const credentialsForm: Ref<null | {
  resetValidation: () => void
  reset: () => void
  validate: () => Promise<{ valid: boolean }>
}> = ref(null)

const email = ref('')
const name = ref('')
const surname = ref('')
const gender: Ref<TGender | null> = ref(null)
const faculty: Ref<string | null> = ref(null)
const password1 = ref('')
const password2 = ref('')
const rules = ref(false)
const index = ref('')
const dateBirth = ref(null)
const preferredGender = ref(null)
const lookingFor = ref(null)

const isPasswordShown = ref(false)

function verifyPassword() {
  return password1.value === password2.value
}

function prepareNewAccount() {
  return new UserModel(
    {
      firstName: name.value,
      lastName: surname.value,
      dateBirth: dateBirth.value ? Timestamp.fromDate(dateBirth.value) : null,
      index: Number.parseInt(index.value),
      gender: gender.value || 'other',
      faculty: faculty.value || '',
      role: 'user',
      description: '',
      score: 0,
      elo: 0,
      preferred_gender: preferredGender.value || 'any',
      looking_for: lookingFor.value || 'other',
      photos: [],
      blocked_profiles: [],
      hobbies: [],
    },
    createdUserRef,
  )
}

async function createAccount() {
  if (!await isValid())
    return

  if (index.value.length !== 6) {
    sharedStore.failureSnackbar({ code: String('Nie podano indeksu') })
    return
  }

  createdUserRef = await appStore.registerWithPassword(email.value, password1.value)

  if (createdUserRef) {
    await appStore.createUser(prepareNewAccount())
    sharedStore.successSnackbar()
    router.push('/')
  }
}

async function checkStepCondition(next: () => void) {
  if (!credentialsForm.value || !await validateForm(credentialsForm.value))
    return

  if (!verifyPassword()) {
    sharedStore.failureSnackbar({ code: String(t('universal.passwordsNotMatch')) })
    return
  }

  next()
}

const isDark = computed(() => {
  return current.value.dark
})
</script>

<template>
  <v-img
    src="/public/landingTwo.jpeg"
    cover
    gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
    class="d-flex justify-center flex-wrap w-100 h-100"
  >
    <v-card
      class="d-flex align-center justify-center flex-wrap text-center mx-auto mb-4  mt-16 pt-16 px-4 bg-transparent text-white"
      elevation="0"
      max-width="1100"
      rounded
    >
      <v-row justify="center">
        <v-col cols="12" sm="12" md="10">
          <div class="d-flex flex-column align-center justify-center h-100 mx-2 py-4">
            <div class="text-h4 my-2">
              Rejestracja
            </div>

            <v-col cols="12" md="10" lg="8">
              <v-stepper class="stepper w-100" elevation="8">
                <template #default="{ prev, next }">
                  <v-stepper-header>
                    <v-stepper-item
                      :title="$t('registration.step', { step: 1 })"
                      value="1"
                      color="secondary"
                    />

                    <v-divider />

                    <v-stepper-item
                      :title="$t('registration.step', { step: 2 })"
                      :subtitle="$t('registration.optional')"
                      value="2"
                      color="secondary"
                    />

                    <v-divider />

                    <v-stepper-item
                      :title="$t('registration.step', { step: 3 })"
                      value="3"
                      color="secondary"
                    />
                  </v-stepper-header>

                  <v-stepper-window>
                    <v-stepper-window-item
                      value="1"
                    >
                      <v-form ref="credentialsForm" @submit.prevent="createAccount">
                        <div class="py-4">
                          <v-text-field
                            v-model="email" label="Adres Email" placeholder="example@mail.com" type="email"
                            :rules="[requiredRule(), emailRule()]" prepend-inner-icon="mdi-email"
                            density="comfortable"
                            color="secondary"
                            @keyup.enter="checkStepCondition(next)"
                          />

                          <v-text-field
                            v-model="password1"
                            label="Hasło"
                            color="secondary"
                            :append-inner-icon="isPasswordShown ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="isPasswordShown ? 'text' : 'password'" :rules="[requiredRule(), passwordRule()]"
                            prepend-inner-icon="mdi-lock" density="comfortable"
                            @keyup.enter="checkStepCondition(next)"
                            @click:append-inner="isPasswordShown = !isPasswordShown"
                          />

                          <v-text-field
                            v-model="password2"
                            prepend-inner-icon="mdi-lock"
                            color="secondary"
                            label="Powtórz hasło"
                            :append-inner-icon="isPasswordShown ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="isPasswordShown ? 'text' : 'password'" :rules="[requiredRule(), passwordRule()]"
                            density="comfortable" @keyup.enter="checkStepCondition(next)"
                            @click:append-inner="isPasswordShown = !isPasswordShown"
                          />
                        </div>
                      </v-form>
                    </v-stepper-window-item>

                    <v-stepper-window-item
                      value="2"
                    >
                      <div class="py-4">
                        <VueDatePicker
                          v-model="dateBirth"
                          class="mb-6"
                          :dark="isDark"
                          auto-apply
                          placeholder="Podaj datę urodzenia"
                          :enable-time-picker="false"
                          position="left"
                        />

                        <v-select
                          v-model="gender"
                          label="Płeć"
                          :items="mappedGenders"
                          color="secondary"
                          variant="outlined"
                          density="comfortable"
                        />

                        <v-select
                          v-model="faculty"
                          label="Wydział"
                          :items="facultiesList"
                          color="secondary"
                          variant="outlined"
                          density="comfortable"
                        />

                        <v-select
                          v-model="preferredGender"
                          label="Poszukiwana płeć do relacji"
                          :items="mappedGendersPreferences"
                          color="secondary"
                          variant="outlined"
                          density="comfortable"
                        />

                        <v-select
                          v-model="lookingFor"
                          label="Aktualnie moja poszukiwana relacja to: "
                          :items="mappedRelationships"
                          color="secondary"
                          variant="outlined"
                          density="comfortable"
                        />
                      </div>
                    </v-stepper-window-item>

                    <v-stepper-window-item
                      value="3"
                    >
                      <v-form ref="form" v-model="valid" @submit.prevent="createAccount">
                        <div class="py-4">
                          <v-text-field
                            v-model="name" label="Imię" type="text"
                            :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" density="comfortable"
                            color="secondary"
                            @keyup.enter="createAccount"
                          />

                          <v-text-field
                            v-model="surname" label="Nazwisko" type="text"
                            :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" density="comfortable"
                            color="secondary"
                            @keyup.enter="createAccount"
                          />
                          <v-checkbox v-model="rules" color="secondary" class="mt-n4 mb-2 " label="Akceptuję regulamin" :rules="[requiredRule()]" />

                          <span>
                            Indeks uczelniany
                          </span>

                          <v-otp-input
                            v-model="index"
                            type="number"
                            class="mb-4"
                            @keyup.enter="createAccount"
                          />
                        </div>
                      </v-form>

                      <v-btn variant="elevated" color="secondary" @click="createAccount">
                        Zarejestruj się
                      </v-btn>
                    </v-stepper-window-item>
                  </v-stepper-window>
                  <v-stepper-actions
                    @click:prev="prev"
                    @click:next="checkStepCondition(next)"
                  />
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

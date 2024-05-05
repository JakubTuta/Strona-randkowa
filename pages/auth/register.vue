<script setup lang="ts">
import type { DocumentReference } from 'firebase/firestore'
import formValidation, { validateForm } from '~/helpers/formValidation'
import { emailRule, lengthRule, lengthRuleShort, passwordRule, requiredRule } from '~/helpers/rules'
import { UserModel } from '~/models/user'

// import '@vuepic/vue-datepicker/dist/main.css'

let createdUserRef: DocumentReference | null = null

useHead({
  title: 'Rejestracja - Randki+',
})

const appStore = useAppStore()

const { t } = useI18n()
const router = useRouter()

const sharedStore = useSharedStore()

const { form, valid, isValid } = formValidation()

const credentialsForm: Ref<null | {
  resetValidation: () => void
  reset: () => void
  validate: () => Promise<{ valid: boolean }>
}> = ref(null)

const email = ref('')
const userName = ref('')
const name = ref('')
const surname = ref('')
const gender = ref('')
const faculty = ref('')
// const birthDate = ref('')
const password1 = ref('')
const password2 = ref('')
const rules = ref(false)
const index = ref('') // DODAĆ ZASADY ŻE MUSZĄ BYĆ CYFRY I MAX 6 ZNAKÓW

const isPasswordShown = ref(false)

function verifyPassword() {
  return password1.value === password2.value
}

function prepareNewAccount() {
  return new UserModel(
    {
      userName: userName.value,
      email: email.value,
      firstName: name.value,
      lastName: surname.value,
      dateBirth: '',
      index: Number.parseInt(index.value),
      gender: gender.value,
      faculty: faculty.value,
      role: 'user',
      description: '',
      score: 0,
      elo: 0,
      preferred_gender: '',
      looking_for: '',
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
</script>

<template>
  <NavBarGuest />

  <v-card
    class="d-flex align-center justify-center flex-wrap text-center mx-auto mb-4 px-4 bg-transparent"
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
            <v-stepper class="w-100">
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
                      <v-text-field
                        v-model="userName" label="Nazwa użytkownika" type="text"
                        density="comfortable"
                        color="secondary"
                        @keyup.enter="checkStepCondition(next)"
                      />

                      <v-select
                        v-model="gender"
                        label="Płeć"
                        :items="['Mężczyzna', 'Kobieta']"
                        color="secondary"
                        variant="outlined"
                        density="comfortable"
                      />

                      <v-select
                        v-model="faculty"
                        label="Wydział"
                        :items="['WEEIA', 'FTIMS']"
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
          <!--

            <VueDatePicker
              v-model="birthDate" class="mt-2" auto-apply :enable-time-picker="true"
              label="Data urodzenia" :min-date="new Date()" position="left"
            />

 -->
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

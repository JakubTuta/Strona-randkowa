<script setup lang="ts">
import type { DocumentReference } from 'firebase/firestore'
import formValidation from '~/helpers/formValidation'
import { emailRule, lengthRule, lengthRuleShort, passwordRule, requiredRule } from '~/helpers/rules'
import NavBarGuest from '~/composables/navBars/navBarGuest.vue'
import { UserModel } from '~/models/user'
import { useAppStore } from '~/store/appStore'
import { useSharedStore } from '~/store/sharedStore'
// import '@vuepic/vue-datepicker/dist/main.css'

let createdUserRef: DocumentReference | null = null

const appStore = useAppStore()

const { t } = useI18n()
const router = useRouter()

const sharedStore = useSharedStore()

const { form, valid, isValid } = formValidation()

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
      name: name.value,
      lastName: surname.value,
      dateBirth: '',
      index: index.value,
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

  if (!verifyPassword()) {
    sharedStore.failureSnackbar({ code: String(t('universal.passwordsNotMatch')) })
    return
  }

  createdUserRef = await appStore.registerWithPassword(email.value, password1.value)

  sharedStore.init()

  if (createdUserRef) {
    await appStore.createUser(prepareNewAccount())
    sharedStore.successSnackbar()
    router.push('/')
  }
  else { sharedStore.failureSnackbar({ code: String(t('universal.emailExists')) }) }

  // valid.value = false
}

// onMounted(() => {
//   if (user.value) {
//     getUserQuery(user.value.uid, firestore).then(data => createdUserRef = data.ref)
//   }
// })
</script>

<template>
  <NavBarGuest />

  <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto my-10 px-4" elevation="4"
    max-width="1100" rounded
  >
    <v-row justify="center">
      <v-col cols="12" sm="12" md="6">
        <div class="d-flex flex-column align-center justify-center h-100 mx-2 pa-6">
          <v-img
            class="mx-auto my-5 elevation-5" rounded="xl" :width="300" max-height="300px" aspect-ratio="4/3" cover
            src="/LandingOne.jpeg"
          />
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <div class="d-flex flex-column align-center justify-center h-100 mx-2 py-4">
          <div class="text-h5 my-2">
            Rejestracja
          </div>

          <v-form ref="form" v-model="valid" class="w-75 my-2" @submit.prevent="createAccount">
            <v-text-field
              v-model="email" label="Adres Email" placeholder="example@mail.com" type="email"
              :rules="[requiredRule(), emailRule()]" @keyup.enter="createAccount"
            />

            <v-text-field
              v-model="userName" label="Nazwa użytkownika" type="text"
              :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" @keyup.enter="createAccount"
            />

            <v-text-field
              v-model="name" label="Imię" type="text"
              :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" @keyup.enter="createAccount"
            />

            <v-text-field
              v-model="surname" label="Nazwisko" type="text"
              :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" @keyup.enter="createAccount"
            />

            <v-select v-model="gender" label="Płeć" :items="['Mężczyzna', 'Kobieta']" variant="outlined" />

            <v-select v-model="faculty" label="Wydział" :items="['WEEIA', 'FTIMS']" variant="outlined" />

            <!-- <VueDatePicker
              v-model="birthDate" class="mt-2" auto-apply :enable-time-picker="true"
              label="Data urodzenia" :min-date="new Date()" position="left"
            /> -->

            <v-text-field
              v-model="index" label="Indeks uczelniany" type="text"
              :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" @keyup.enter="createAccount"
            />

            <v-text-field
              v-model="password1"
              label="Hasło"
              :append-inner-icon="isPasswordShown ? 'mdi-eye' : 'mdi-eye-off'"
              :type="isPasswordShown ? 'text' : 'password'" :rules="[requiredRule(), passwordRule()]"
              prepend-inner-icon="mdi-lock" @keyup.enter="createAccount"
              @click:append-inner="isPasswordShown = !isPasswordShown"
            />

            <v-text-field
              v-model="password2"
              prepend-inner-icon="mdi-lock"
              label="Powtórz hasło"
              :append-inner-icon="isPasswordShown ? 'mdi-eye' : 'mdi-eye-off'"
              :type="isPasswordShown ? 'text' : 'password'" :rules="[requiredRule(), passwordRule()]"
              @keyup.enter="createAccount" @click:append-inner="isPasswordShown = !isPasswordShown"
            />

            <v-checkbox v-model="rules" label="Akceptuję regulamin" :rules="[requiredRule()]" />

            <v-btn @click="createAccount">
              Zarejestruj się
            </v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

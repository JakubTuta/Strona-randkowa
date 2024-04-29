<script setup lang="ts">
import formValidation from '~/helpers/formValidation'
import { emailRule, lengthRule, lengthRuleShort, passwordRule, requiredRule } from '~/helpers/rules'
import NavBarGuest from '~/composables/navBars/navBarGuest.vue'
import type { UserModel } from '~/models/user'
// import '@vuepic/vue-datepicker/dist/main.css'

// definePageMeta({
//   middleware: ['guest-page-guard'],
// })

// useHead({
//   title: "Rejestracja - Randki+"
// })

// const auth = useAuthStore()

const { form, valid, isValid } = formValidation()

// const {registerError} = storeToRefs(auth)

const email = ref('')
const userName = ref('')
const name = ref('')
const surname = ref('')
// const birthDate = ref('')
const password1 = ref('')
const password2 = ref('')
const rules = ref(false)
const index = ref('') // DODAĆ ZASADY ŻE MUSZĄ BYĆ CYFRY I MAX 6 ZNAKÓW

const showPasswordOne = ref(false)
const showPasswordTwo = ref(false)

function verifyPassword() {
  return password1.value === password2.value
}

async function registerUser() {
  if (await isValid() && verifyPassword()) {
    // await auth.registerUser({
    //   email: email.value,
    //   name: name.value,
    //   password: password1.value,
    //   role: 'user',
    // })
    // if (!registerError.value) {
    //   await auth.loginUser(email.value, password1.value)
    //   navigateTo('/client/profile')
    // }
  }
  else {
    // registerError.value = true
  }
}

// onMounted(() => registerError.value = false)
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

          <v-form ref="form" v-model="valid" class="w-75 my-2" @submit.prevent="registerUser">
            <v-text-field
              v-model="email" label="Adres Email" placeholder="example@mail.com" type="email"
              :rules="[requiredRule(), emailRule()]" @keyup.enter="registerUser"
            />

            <v-text-field
              v-model="userName" label="Nazwa użytkownika" type="text"
              :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" @keyup.enter="registerUser"
            />

            <v-text-field
              v-model="name" label="Imię" type="text"
              :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" @keyup.enter="registerUser"
            />

            <v-text-field
              v-model="surname" label="Nazwisko" type="text"
              :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" @keyup.enter="registerUser"
            />

            <!-- <VueDatePicker
              v-model="birthDate" class="mt-2" auto-apply :enable-time-picker="true"
              label="Data urodzenia" :min-date="new Date()" position="left"
            /> -->

            <v-text-field
              v-model="index" label="Indeks uczelniany" type="text"
              :rules="[requiredRule(), lengthRuleShort(), lengthRule()]" @keyup.enter="registerUser"
            />

            <v-text-field
              v-model="password1" label="Hasło"
              :append-inner-icon="showPasswordOne ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPasswordOne ? 'text' : 'password'" :rules="[requiredRule(), passwordRule()]"
              @keyup.enter="registerUser" @click:append-inner="showPasswordOne = !showPasswordOne"
            />

            <v-text-field
              v-model="password2" label="Powtórz hasło"
              :append-inner-icon="showPasswordTwo ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPasswordTwo ? 'text' : 'password'" :rules="[requiredRule(), passwordRule()]"
              @keyup.enter="registerUser" @click:append-inner="showPasswordTwo = !showPasswordTwo"
            />

            <v-checkbox v-model="rules" label="Akceptuję regulamin" :rules="[requiredRule()]" />

            <v-btn @click="registerUser">
              Zarejestruj się
            </v-btn>
          </v-form>

          <!--          <v-alert -->
          <!--              v-if="registerError" -->
          <!--              color="error" -->
          <!--              variant="tonal" -->
          <!--              class="my-4" -->
          <!--          > -->
          <!--            Niepoprawne dane rejestracji -->
          <!--          </v-alert> -->
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

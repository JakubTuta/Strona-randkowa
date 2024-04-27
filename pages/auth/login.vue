<script setup lang="ts">
import formValidation from '~/helpers/formValidation'
import { emailRule, passwordRule, requiredRule } from '~/helpers/rules'
import NavBarGuest from '~/composables/navBars/navBarGuest.vue'

// useHead({
//   title: 'Logowanie - Randki+',
// })

// const auth = useAuthStore()
// const {user, loginError} = storeToRefs(auth)

const email = ref('')
const password = ref('')

const showPassword = ref(false)

const { form, valid, isValid } = formValidation()

async function logIn() {
  if (await isValid()) {
    // await auth.loginUser(email.value, password.value)

    // if (user.value?.role === 'user')
    //   navigateTo('/client')
    // else if (user.value?.role === 'admin')
    //   navigateTo('/administration')
  }
}

// onMounted(() => loginError.value = false)
</script>

<template>
  <NavBarGuest />

  <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto my-10 px-4"
    elevation="4"
    max-width="1100"
    rounded
  >
    <v-row justify="center">
      <v-col cols="12" sm="12" md="6">
        <div class="d-flex flex-column align-center justify-center h-100 mx-2 py-3">
          <div class="text-h5 my-2">
            Logowanie
          </div>

          <v-form
            ref="form"
            v-model="valid"
            class="w-75 my-2"
            @submit.prevent="logIn"
          >
            <v-text-field
              v-model="email"
              label="Adres Email"
              placeholder="example@mail.com"
              type="email"
              :rules="[requiredRule(), emailRule()]"
              @keyup.enter="logIn"
            />

            <v-text-field
              v-model="password"
              label="Hasło"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              :rules="[requiredRule(), passwordRule()]"
              @click:append-inner="showPassword = !showPassword"
              @keyup.enter="logIn"
            />

            <v-row class="justify-center my-1">
              <v-btn class="mx-2 mb-2" @click="logIn">
                Zaloguj
              </v-btn>
            </v-row>
          </v-form>

          <p class="my-5">
            Nie masz jeszcze konta?
          </p>

          <v-btn to="/auth/register">
            Zarejestruj się
          </v-btn>

          <!--          <v-alert -->
          <!--              v-if="loginError" -->
          <!--              color="error" -->
          <!--              variant="tonal" -->
          <!--              class="my-4" -->
          <!--          > -->
          <!--            Niepoprawne dane logowania -->
          <!--          </v-alert> -->
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <div class="d-flex flex-column align-center justify-center h-100 mx-2 pa-6">
          <v-img
            class="mx-auto my-5 elevation-5"
            rounded="xl"
            :width="300"
            aspect-ratio="4/3"
            cover
            src="/LandingOne.jpeg"
          />
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

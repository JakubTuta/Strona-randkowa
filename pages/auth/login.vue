<script setup lang="ts">
import formValidation from '~/helpers/formValidation'

const { t } = useI18n()

useHead({
  title: `${t('login.login')} - ${t('appName')}`,
})

const email = ref('')
const password = ref('')

const showPassword = ref(false)

const { form, valid, isValid } = formValidation()

const appStore = useAppStore()

async function logIn() {
  if (await isValid())
    await appStore.logInWithPassword(email.value, password.value)
}
</script>

<template>
  <v-img
    src="/public/landingTwo.jpg"
    cover
    gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
    class="d-flex justify-center  flex-wrap w-100 h-100"
  >
    <v-sheet
      class="d-flex align-center justify-center flex-wrap text-center w-100 mt-16 pt-16 mx-auto bg-transparent"
      elevation="0"
      max-width="1450"
      style="color: white !important;"
      rounded
    >
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6">
          <div class="text-h4 my-2">
            {{ t('login.login') }}
          </div>
          <div class="d-flex flex-column align-center justify-center h-100">
            <v-form
              ref="form"
              v-model="valid"
              class="w-75 my-2"
              @submit.prevent="logIn"
            >
              <v-text-field
                v-model="email"
                :label="t('login.email')"
                placeholder="example@mail.com"
                type="email"
                prepend-inner-icon="mdi-email"
                bg-color="rgba(255, 255, 255, 0.10)"
                @keyup.enter="logIn"
              />

              <v-text-field
                v-model="password"
                prepend-inner-icon="mdi-lock"
                :label="t('login.password')"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                bg-color="rgba(255, 255, 255, 0.10)"
                @click:append-inner="showPassword = !showPassword"
                @keyup.enter="logIn"
              />

              <v-row class="justify-center my-1">
                <v-btn class="mx-2 mb-2" color="secondary" variant="elevated" @click="logIn">
                  {{ t('login.signUp') }}
                </v-btn>
              </v-row>
            </v-form>

            <p class="my-5">
              {{ t('login.doYouHaveAccount') }}
            </p>

            <v-btn to="/auth/register" variant="elevated">
              {{ t('login.register') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-img>
</template>

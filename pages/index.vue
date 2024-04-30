<script setup lang="ts">
</script>

<template>
  <NavBarGuest />

  <v-card
    class="d-flex align-center justify-center flex-wrap text-center mx-10 my-10 px-4"
    elevation="4"
    min-height="400"
    rounded
  >
    <v-row justify="center" class="my-5">
      <v-col cols="12" sm="12" md="6">
        <v-img
          class="mx-auto my-5 elevation-5"
          rounded="xl"
          :width="466"
          aspect-ratio="4/3"
          cover
          src="/LandingOne.jpeg"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <div class="d-flex flex-column align-center justify-center h-100 mx-2">
          <span class="text-h4 font-weight-bold">
            Witamy na stronie randkowej
          </span>

          <p class="mt-2">
            Aplikacja zaprojektowana specjalnie do tego żeby ją usunąć. Zaintrygowało?
          </p>
          <v-btn class="my-4" to="auth/login" variant="elevated">
            Logowanie
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>

  <v-card
    class="d-flex align-center justify-center flex-wrap text-center mx-10 my-10"
    elevation="4"
    min-height="250"
    rounded
  >
    <v-img
      src="/public/landingTwo.jpeg"
      max-height="550"
      cover
      gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
    >
      <div class="d-flex flex-column align-center justify-center h-100 mx-2">
        <div class="text-h4 text-white">
          Zobacz jak to działa
        </div>

        <p class="mt-3 text-white">
          Przygotowaliśmy specjalnie dla ciebie krótki opis jak działa nasza aplikacja.
        </p>

        <v-btn class="my-4" to="/auth/login" variant="elevated">
          Przejdź
        </v-btn>
      </div>
    </v-img>
  </v-card>
</template>

<script setup lang="ts">
</script>

<template>
  <NavBarGuest />

  <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto my-10 px-4"
    elevation="4"
    max-width="1100"
    rounded
  >
    <v-row justify="center" class="my-5">
      <v-col cols="12" sm="12" md="6">
        <v-img
          class="mx-auto my-5 elevation-5"
          rounded="xl"
          :width="266"
          aspect-ratio="4/3"
          cover
          src="/LandingOne.jpeg"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <div class="d-flex flex-column align-center justify-center h-100 mx-2">
          <div class="text-h5">
            Witamy na stronie randkowej
          </div>

          <p class="mt-2">
            Aplikacja zaprojektowana specjalnie do tego żeby ją usunąć. Zaintrygowało?
          </p>
          <v-btn class="my-4" to="auth/login">
            Logowanie
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-sheet>

  <v-card
    class="d-flex align-center justify-center flex-wrap text-center mx-auto my-15"
    elevation="4"
    max-width="1100"
    min-height="200"
    rounded
  >
    <v-img
      src="/public/landingOne.jpeg"
      max-height="200"
      cover
      gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
    >
      <div class="d-flex flex-column align-center justify-center h-100 mx-2">
        <div class="text-h4">
          Zobacz jak to działa
        </div>

        <p class="mt-3">
          Przygotowaliśmy specjalnie dla ciebie krótki opis jak działa nasza aplikacja.
        </p>
        <v-btn class="my-4" to="/auth/login">
          Przejdź
        </v-btn>
      </div>
    </v-img>
  </v-card>
</template>

<script setup lang="ts">
</script>

<template>
  <v-img
    src="/landingThree.jpg"
    cover
    gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2">
      <span class="text-h4 font-weight-bold text-white">
        Witamy na stronie randkowej
      </span>

      <p class="mt-2 text-white">
        Aplikacja zaprojektowana specjalnie do tego żeby ją usunąć. Zaintrygowało?
      </p>
      <v-btn class="my-4" to="auth/login" variant="elevated" color="secondary">
        Zacznij już teraz
      </v-btn>
    </div>
  </v-img>

  <v-card
    class="mx-10 my-10 px-4"
    elevation="0"
    min-height="400"
    rounded="xl"
    color="transparent"
  >
    <v-row justify="center" class="my-5">
      <v-col cols="12" sm="12" md="6">
        <v-img
          class="mx-auto my-5 elevation-5"
          rounded="xl"
          :width="466"
          aspect-ratio="4/3"
          cover
          src="/landingOne.jpg"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <div class="d-flex flex-column align-center justify-center h-100 mx-2">
          <div class="text-h4">
            Zobacz jak to działa
          </div>

          <p class="mt-3">
            Przygotowaliśmy specjalnie dla ciebie krótki opis jak działa nasza aplikacja.
          </p>

          <v-btn class="my-4" to="/auth/login" variant="elevated" color="primary">
            Przejdź
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

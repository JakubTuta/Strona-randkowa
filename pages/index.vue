<script setup lang="ts">
import NavBarGuest from '~/composables/navBars/navBarGuest.vue'
</script>

<template>
  <NavBarGuest />
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
      gradient="to bottom, rgba(0,0,0,.2), rgba(0,0,0,.7)"
    >
      <div class="d-flex flex-column align-center justify-center h-100 mx-2">
        <div class="text-h4">
          Witamy na stronie randkowej
        </div>

        <p class="mt-3">
          Aplikacja zaprojektowana specjalnie do tego żeby ją usunąć. Zaintrygowało?
        </p>
        <v-btn class="my-4" to="/auth/login">
          Zaczynamy
        </v-btn>
      </div>
    </v-img>
  </v-card>

  <v-card
    class="d-flex align-center justify-center flex-wrap text-center mx-auto my-15"
    elevation="4"
    max-width="1100"
    min-height="200"
    rounded
  >
    <v-img
      src="/public/landingTwo.jpeg"
      max-height="200"
      cover
      gradient="to bottom, rgba(0,0,0,.2), rgba(0,0,0,.7)"
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

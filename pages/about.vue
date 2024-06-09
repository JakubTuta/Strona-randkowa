<script setup lang="ts">
</script>

<template>
  <v-img
      src="/aboutOne.jpg"
      cover
      gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
      class="mt-15 text-center"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2">
      <span class="text-h4 font-weight-bold text-white">
        Witamy na stronie randkowej
      </span>

      <p class="mt-2 text-white">
        Aplikacja zaprojektowana specjalnie do tego żeby ją usunąć. Zaintrygowało?
      </p>

    </div>
  </v-img>

  <v-card
      class="mx-10 my-10 px-4"
      elevation="0"
      min-height="400"
      rounded="xl"
      color="transparent"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2 my-15 text-center">
      <div class="text-h4">
        Zobacz jak to działa
      </div>

      <p class="mt-3">
        Przygotowaliśmy specjalnie dla ciebie krótki opis jak działa nasza aplikacja.
      </p>

      <v-btn class="my-4" to="/about" variant="elevated" color="primary">
        Przejdź
      </v-btn>
    </div>
  </v-card>

  <v-img
      src="/chat.jpg"
      cover
      gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
      class="text-center"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2">
      <span class="text-h4 font-weight-bold text-white">
        Witamy na stronie randkowej
      </span>

      <p class="mt-2 text-white">
        Aplikacja zaprojektowana specjalnie do tego żeby ją usunąć. Zaintrygowało?
      </p>

    </div>
  </v-img>

  <v-card
      class="mx-10 my-10 px-4"
      elevation="0"
      min-height="400"
      rounded="xl"
      color="transparent"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2 my-15 text-center">
      <div class="text-h4">
        Zobacz jak to działa
      </div>

      <p class="mt-3">
        Przygotowaliśmy specjalnie dla ciebie krótki opis jak działa nasza aplikacja.
      </p>

      <v-btn class="my-4" to="/about" variant="elevated" color="primary">
        Przejdź
      </v-btn>
    </div>
  </v-card>

</template>

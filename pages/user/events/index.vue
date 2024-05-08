<script setup lang="ts">
definePageMeta({
  layout: 'user',
})
</script>

<template>
  <v-container fluid class="px-8">
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8">
        <h1>
          Nachodzące wydarzenia
        </h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-carousel class="rounded-xl" cycle :interval="5000">
          <v-carousel-item
              src="/testEvent.jpg"
              cover
          >
            <v-btn variant="elevated" size="large" color="secondary">
              Dołącz teraz!
            </v-btn>
          </v-carousel-item>

          <v-carousel-item
              src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
              cover
          >
            <v-btn variant="elevated" size="large" color="secondary">
              Dołącz teraz!
            </v-btn>
          </v-carousel-item>

          <v-carousel-item
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              cover
          >
            <v-btn variant="elevated" size="large" color="secondary">
              Dołącz teraz!
            </v-btn>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

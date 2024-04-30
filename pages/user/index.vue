<script lang="ts" setup>
const drawer = ref(false)
</script>

<template>
  <NavBarUser v-model="drawer" />
  <DrawerUser v-model="drawer" class="hidden-md-and-up" />

  <v-container fluid>
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8">
        <h1>
          Nadchodzące wydarzenia
        </h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-carousel class="rounded-xl" cycle :interval="3000">
          <v-carousel-item
            src="/testEvent.jpg"
            cover
          >
            <v-btn variant="elevated">
              Dołącz teraz!
            </v-btn>
          </v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
            cover
          >
            <v-btn variant="elevated">
              Dołącz teraz!
            </v-btn>
          </v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
          >
            <v-btn variant="elevated">
              Dołącz teraz!
            </v-btn>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>

</style>

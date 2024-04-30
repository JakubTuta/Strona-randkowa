<script lang="ts" setup>
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

    <v-row justify="center" class="mt-12">
      <v-col cols="12" md="8">
        <h1>
          Wybrane osoby o podobnych zainteresowaniach
        </h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="8" class="mt-4 d-flex justify-space-around flex-wrap ">
        <UserCard img="/testPerson1.jpg" name="Madzia" :age="22" />

        <UserCard img="/testPerson2.jpg" name="Ewa" :age="21" />

        <UserCard img="/testPerson3.jpg" name="Natalia" :age="24" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.grow {
  transition: all .2s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
  }
</style>

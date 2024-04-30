<script lang="ts" setup>
const drawer = ref(false)

const icons = ['mdi-facebook', 'mdi-twitter', 'mdi-instagram']
</script>

<template>
  <NavBarUser v-model="drawer" />
  <DrawerUser v-model="drawer" class="hidden-md-and-up" />

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
            <v-btn variant="elevated" size="large">
              Dołącz teraz!
            </v-btn>
          </v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
            cover
          >
            <v-btn variant="elevated" size="large">
              Dołącz teraz!
            </v-btn>
          </v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
          >
            <v-btn variant="elevated" size="large">
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
      <v-col cols="12" md="8" class="mt-4 d-flex justify-space-around ">
        <UserCard img="/testPerson1.jpg" name="Madzia" :age="22" />

        <UserCard img="/testPerson2.jpg" name="Ewa" :age="21" />

        <UserCard img="/testPerson3.jpg" name="Natalia" :age="24" />
      </v-col>
    </v-row>
  </v-container>

  <v-footer class="d-flex flex-column justify-center mt-10">
    <div>
      <v-btn
        v-for="icon in icons"
        :key="icon"
        :icon="icon"
        class="mx-4"
        size="small"
        variant="plain"
      />
    </div>

    <div class="text-center mt-2">
      <strong> Projekt Kompetencyjny {{ new Date().getFullYear() }} ©</strong>
    </div>
  </v-footer>
</template>

<style scoped>
.grow {
  transition: all .2s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
  }
</style>

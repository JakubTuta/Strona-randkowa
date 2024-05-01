<script>
import NavBarUser from '~/components/navBarUser.vue'
import ProfileTab from '~/components/user/profileTab.vue'
</script>

<template>
  <NavBarUser />
  <v-row justify="center">
    <v-col cols="12" sm="12" , md="6">
      <v-sheet
        class="d-flex align-center flex-wrap text-center mx-auto my-10 px-4" elevation="4" max-width="1100"
        rounded
      >
        <v-row justify="center">
          <v-col cols="12" sm="12" md="12">
            <div class="d-flex flex-column align-center justify-center h-100 mx-2 pa-6">
              <v-img
                class="mx-auto my-5 elevation-5" rounded="xl" :width="300" aspect-ratio="4/3" cover
                src="/testPerson3.jpg"
              />
            </div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>

    <v-col cols="12" sm="12" , md="6">
      <v-sheet
        class="d-flex align-center flex-wrap text-center mx-auto my-10 px-4" elevation="4" max-width="1100"
        rounded
      >
        <v-col cols="12" sm="12" md="12">
          <v-row>
            <v-card class="mx-auto">
              <v-card-title class="text-h4">
                IMIĘ NAZWISKO, 22
              </v-card-title>
              <v-card-subtitle>
                @anne123
              </v-card-subtitle>
            </v-card>
          </v-row>

          <v-row>
            <v-col cols="12" md="12" sm="12">
              <v-text-field label="Opis" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field label="Data urodzenia" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field label="Płeć" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field label="Wydział" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field label="Kierunek" readonly />
            </v-col>
          </v-row>
        </v-col>
      </v-sheet>
    </v-col>
  </v-row>
</template>

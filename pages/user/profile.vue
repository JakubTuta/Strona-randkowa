<script lang="ts" setup>
import NavBarUser from '~/components/navBarUser.vue'
import EditProfile from '~/components/user/editProfile.vue'
import EditPreferences from '~/components/user/editPreferences.vue'

const editProfileFlag = ref<boolean>(false)
const editPreferencesFlag = ref<boolean>(false)

function changeProfileEditFlag() {
  editProfileFlag.value = !editProfileFlag.value
}

function changePreferencesEditFlag() {
  editPreferencesFlag.value = !editPreferencesFlag.value
}
</script>

<template>
  <NavBarUser />
  <v-row justify="center">
    <v-col cols="12" sm="12" , md="6">
      <v-sheet
        class="d-flex align-center flex-wrap text-center mx-auto my-10 px-4" elevation="4" max-height="1100"
        max-width="1100" rounded
      >
        <v-row justify="center">
          <v-col cols="12" sm="12" md="6">
            <div>
              <v-img
                class="mx-auto my-5 elevation-5" rounded="xl" :width="300" aspect-ratio="4/3" cover
                src="/testPerson3.jpg"
              />
            </div>
          </v-col>
        </v-row>

        <v-row>
          reszta zdjęć
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
            <div class="mx-auto">
              <v-card-title class="text-h4 flex-wrap">
                IMIĘ NAZWISKO, 22
              </v-card-title>
              <v-card-subtitle>
                @anne123
              </v-card-subtitle>
            </div>
          </v-row>

          <v-row>
            <v-col cols="12" md="12" sm="12">
              <v-text-field :label="$t('profile.description')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field :label="$t('profile.dateBirth')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field :label="$t('profile.gender')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field :label="$t('profile.faculty')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field :label="$t('profile.fieldOfStudy')" readonly />
            </v-col>
          </v-row>

          <v-card-actions class="justify-end">
            <v-btn @click="changeProfileEditFlag()">
              Edytuj dane
            </v-btn>
          </v-card-actions>

          <v-row>
            <div class="mx-auto">
              <v-card-title class="text-h4">
                Twoje preferencje i zainteresowania
              </v-card-title>
            </div>
          </v-row>

          <v-row>
            <v-col cols="12" md="6" sm="12">
              <v-text-field :label="$t('profile.lookingFor')" readonly />
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-text-field :label="$t('profile.prefferedGender')" readonly />
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-chip-group>
                <v-chip
                  v-for="element in ['Silownia', 'Piłka', 'Książki', 'Praca', 'IT', 'Basen', 'Koszenie trawy']"
                  :key="element" size="large" class="outlined"
                >
                  {{ element }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>

          <v-card-actions class="justify-end">
            <v-btn @click="changePreferencesEditFlag()">
              Edytuj preferencje
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-sheet>
    </v-col>
  </v-row>

  <EditProfile :is-show="editProfileFlag" @on-close="changeProfileEditFlag" />
  <EditPreferences :is-show="editPreferencesFlag" @on-close="changePreferencesEditFlag" />
</template>

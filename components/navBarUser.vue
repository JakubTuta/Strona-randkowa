<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { toggleTheme } from '~/composables/theme'

const theme = useTheme()
const drawer = defineModel({ default: false })

const eventMenuIcon = ref('mdi-menu-down')

function changeIcon() {
  eventMenuIcon.value = eventMenuIcon.value === 'mdi-menu-down' ? 'mdi-menu-up' : 'mdi-menu-down'
}
</script>

<template>
  <v-app-bar
    prominent
    class="px-2"
  >
    <v-btn variant="text" color="default" to="/user">
      Randki+
    </v-btn>

    <v-spacer />

    <div class="hidden-sm-and-down">
      <v-btn
        variant="text"
        color="default"
        prepend-icon="mdi-account-group"
      >
        Społeczności
      </v-btn>

      <v-btn
        variant="text"
        color="default"
        prepend-icon="mdi-calendar-multiple"
        :append-icon="eventMenuIcon"
      >
        Wydarzenia
        <v-menu activator="parent" @update:model-value="changeIcon">
          <v-list class="justify-center">
            <v-list-item
              to="user/events/add"
              prepend-icon="mdi-plus"
              title="Utwórz wydarzenie"
            />

            <v-list-item
              to="user/events"
              prepend-icon="mdi-party-popper"
              title="Przeglądaj"
            />
          </v-list>
        </v-menu>
      </v-btn>

      <v-btn
        variant="text"
        color="default"
        prepend-icon="mdi-heart"
      >
        Poznawaj
      </v-btn>

      <v-btn
        variant="text"
        color="default"
        prepend-icon="mdi-chat"
      >
        Czat
      </v-btn>
    </div>

    <v-spacer />

    <div class="hidden-xs">
      <v-btn class=" mr-2" color="default" prepend-icon="mdi-account">
        Jan Kowalski
        <v-menu activator="parent">
          <v-list class="justify-center">
            <v-list-item
              prepend-icon="mdi-theme-light-dark"
              title="Zmień motyw"
              @click="toggleTheme(theme)"
            />
            <v-list-item
              to="/"
              prepend-icon="mdi-logout"
              :title="$t('navBar.logout')"
            />
          </v-list>
        </v-menu>
      </v-btn>
    </div>

    <div class="hidden-md-and-up">
      <v-btn class="rounded-xl mr-2" color="default" icon @click.stop="drawer = !drawer">
        <v-icon icon="mdi-menu" />
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style>

</style>

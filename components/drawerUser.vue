<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { toggleTheme } from '~/composables/theme'

const theme = useTheme()
const drawer = defineModel({ default: false })
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="right"
    class="pt-2"
  >
    <div class="hidden-sm-and-up">
      <v-list-item
        append-icon="mdi-account"
        :title="$t('navBar.myProfile')"
      />

      <v-divider />
    </div>

    <v-list-item link title="Społeczności" append-icon="mdi-account-group" />
    <v-list-item link title="Wydarzenia" append-icon="mdi-calendar-multiple">
      <v-menu activator="parent" location="start">
        <v-list class="justify-center">
          <v-list-item
            to="user/events/add"
            append-icon="mdi-plus"
            title="Utwórz wydarzenie"
          />

          <v-list-item
            to="user/events"
            append-icon="mdi-party-popper"
            title="Przeglądaj"
          />
        </v-list>
      </v-menu>
    </v-list-item>
    <v-list-item link title="Poznawaj" append-icon="mdi-heart" />
    <v-list-item link title="Czat" append-icon="mdi-chat" />

    <div class="hidden-sm-and-up">
      <v-divider />
      <v-list-item
        append-icon="mdi-theme-light-dark"
        :title="$t('navBar.changeTheme')"
        @click="toggleTheme(theme)"
      />
      <v-list-item
        to="/"
        append-icon="mdi-logout"
        :title="$t('navBar.logout')"
      />
    </div>
  </v-navigation-drawer>
</template>

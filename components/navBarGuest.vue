<script setup lang="ts">
import { useTheme } from 'vuetify'
import { toggleTheme } from '~/composables/theme'

const { t } = useI18n()

const theme = useTheme()
</script>

<template>
  <v-app-bar
    prominent
    class="px-2"
  >
    <v-btn variant="text" color="default" to="/">
      Randki+
    </v-btn>

    <v-spacer />

    <div class="hidden-sm-and-down">
      <v-btn variant="text" color="default" to="/auth/login">
        {{ t("navBar.login") }}
      </v-btn>

      <v-btn variant="text" color="default" icon="mdi-theme-light-dark" @click="toggleTheme(theme)" />
    </div>

    <div class="hidden-md-and-up">
      <v-btn class="rounded-xl mr-2" color="default" icon>
        <v-icon icon="mdi-menu" />
        <v-menu activator="parent">
          <v-list class="justify-center">
            <v-list-item to="/auth/login">
              <v-list-item-title> {{ t("navBar.login") }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
  </v-app-bar>
</template>

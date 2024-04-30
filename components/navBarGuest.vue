<script setup lang="ts">
import { useTheme } from 'vuetify'
import { toggleTheme } from '~/helpers/theme'

const { t } = useI18n()

const theme = useTheme()
</script>

<template>
  <v-app-bar
    class="px-2 position-fixed"
    color="rgba(0, 0, 0, 0.76)"
    elevation="0"
  >
    <v-btn variant="text" color="white" to="/">
      Randki+
    </v-btn>

    <v-spacer />

    <div class="hidden-sm-and-down">
      <v-btn variant="elevated" color="primary" to="/auth/login">
        {{ t("navBar.login") }}
      </v-btn>

      <v-btn variant="text" color="white" icon="mdi-theme-light-dark" @click="toggleTheme(theme)" />
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

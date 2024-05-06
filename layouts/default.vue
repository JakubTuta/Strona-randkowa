<script lang="ts" setup>
import { icons } from '../helpers/socials'
</script>

<template>
  <v-app>
    <NavBarGuest />
    <slot />

    <v-footer class="d-flex flex-column justify-center" elevation="4">
      <div>
        <v-btn
          v-for="icon in icons"
          :key="icon.name"
          :icon="icon.name"
          :href="icon.url"
          class="mx-4"
          size="small"
          variant="plain"
          target="_blank"
        />
      </div>

      <div class="text-center mt-2">
        <strong> Projekt Kompetencyjny {{ new Date().getFullYear() }} ©</strong>
      </div>
    </v-footer>
  </v-app>
</template>

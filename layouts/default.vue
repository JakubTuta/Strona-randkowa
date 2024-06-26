<script lang="ts" setup>
import { icons } from '~/helpers/socials'

const { t } = useI18n()
</script>

<template>
  <v-app>
    <NavBarGuest />
    <slot />

    <v-footer class="d-flex flex-column justify-center bg-background" elevation="4">
      <div>
        <v-btn
          v-for="icon in icons"
          :key="icon.name"
          :icon="icon.name"
          :href="icon.url"
          class="mx-4"
          size="small"
          color="secondary"
          variant="plain"
          target="_blank"
        />
      </div>

      <div class="text-center mt-2">
        <strong> {{ t('navBar.footer') }} {{ new Date().getFullYear() }} ©</strong>
      </div>
    </v-footer>
  </v-app>
</template>

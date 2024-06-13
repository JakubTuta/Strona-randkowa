<script lang="ts" setup>
import { ref } from 'vue'
import { icons } from '~/helpers/socials'

const { t } = useI18n()
const drawer = ref(false)
</script>

<template>
  <v-app>
    <NavBarUser v-model="drawer" />
    <DrawerUser v-model="drawer" class="hidden-md-and-up" />

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
        <strong> {{ t('navBar.footer') }} {{ new Date().getFullYear() }} ©</strong>
      </div>
    </v-footer>
  </v-app>
</template>

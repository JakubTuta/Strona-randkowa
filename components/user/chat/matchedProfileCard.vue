<script lang="ts" setup>
import { useTheme } from 'vuetify'

const props = defineProps<{
  user: UserModel
}>()

const { user } = toRefs(props)

const vTheme = useTheme()
</script>

<template>
  <v-card style="cursor: pointer;" class=" my-1 mx-1">
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-avatar
        class="ma-3"
        rounded="xl"
        size="85"
      >
        <v-img v-if="user?.photos.length" :src="user?.photos[0]" />
        <v-img v-else-if="vTheme.current.value.dark" src="/account-dark.png" />
        <v-img v-else src="/account-white.png" />
      </v-avatar>

      <div>
        <v-card-title class="text-h5" align="center" justify="center">
          {{ user.firstName }}
          {{ user.lastName }}
        </v-card-title>
      </div>
    </div>
  </v-card>
</template>

<style>

</style>

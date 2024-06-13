<script lang="ts" setup>
const props = defineProps<{
  user: UserModel
}>()

const { user } = toRefs(props)
</script>

<template>
  <v-card style="cursor: pointer;">
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-avatar
        class="ma-3"
        rounded="xl"
        size="85"
      >
        <v-img :src="user?.photos[0]" />
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

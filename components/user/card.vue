<script lang="ts" setup>
defineProps<{
  name: string
  img: string
  age?: number
  fieldOfStudy: string
}>()
</script>

<template>
  <v-card color="primary" height="250" width="250" class="rounded-xl  cursor-pointer grow ma-3">
    <v-img :src="img" class="white--text align-end" cover :aspect-ratio="1" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
      <v-card-title class="width-100 d-flex justify-space-between">
        <span>{{ name }}, {{ age }}</span>
      </v-card-title>

      <v-card-subtitle class="mt-n2 mb-2 font-weight-bold">
        <span> {{ `${$t(`fieldsOfStudies.${fieldOfStudy}`)}` }}</span>
      </v-card-subtitle>
    </v-img>
  </v-card>
</template>

<style scoped>
.grow {
  transition: all .2s ease-in-out;
}

.grow:hover {
  transform: scale(1.1);
}
</style>

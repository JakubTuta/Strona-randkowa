<script lang="ts" setup>
defineProps<{
  name: string
  img: string
  age?: number
}>()
</script>

<template>
  <v-card color="secondary" min-height="300" min-width="310" class="rounded-xl pt-2 cursor-pointer grow ma-3">
    <v-card-title class="width-100 d-flex justify-space-between">
      <span>{{ name }}</span>
      <span v-if="age">{{ age }} lat</span>
    </v-card-title>

    <v-card-subtitle class="mt-n2 mb-2 font-weight-bold">
      <span>WEEIA</span>
    </v-card-subtitle>

    <v-img :src="img" />
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

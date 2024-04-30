<script lang="ts" setup>
const drawer = ref(false)
</script>

<template>
  <NavBarUser v-model="drawer" />

  <div>
    Client page
  </div>

  <DrawerUser v-model="drawer" />
</template>

<style>

</style>

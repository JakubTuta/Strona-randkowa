<script lang="ts" setup>
const sharedStore = useSharedStore()
const { loading } = storeToRefs(sharedStore)
</script>

<template>
  <div>
    <v-progress-linear id="loading" :active="loading" color="secondary" indeterminate absolute />
  </div>
</template>

<style scope>
#loading {
    z-index: 999999999
}
</style>

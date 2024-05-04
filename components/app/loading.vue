import type { logEvent } from 'firebase/analytics';
<script lang="ts" setup>
import { useSharedStore } from '~/store/sharedStore'

const sharedStore = useSharedStore()
const { loading } = storeToRefs(sharedStore)
</script>

<template>
  <div>
    <div v-if="loading">
      LOADING
    </div>
    <v-progress-linear id="loading" :active="loading" color="secondary" indeterminate absolute />
  </div>
</template>

<style scope>
#loading {
    z-index: 999999999
}
</style>

<script lang="ts" setup>
const props = defineProps<{
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  emit('onClose')
}

const { isShow } = toRefs(props)
const isShowRef = ref<boolean>()

watch(isShow, () => isShowRef.value = isShow.value)
</script>

<template>
  <v-dialog max-width="800px" :model-value="isShowRef" scrollable @update:model-value="close">
    <v-card>
      <v-card-title>
        Dialog do preferencji
      </v-card-title>

      <v-card-actions class="justify-end">
        <v-btn color="error" @click="close">
          Zamknij
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

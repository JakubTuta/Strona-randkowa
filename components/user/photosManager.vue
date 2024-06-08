<script lang="ts" setup>
const props = defineProps<{
  isShow: boolean
  userPhotos: string[]
}>()
const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const { isShow, userPhotos } = toRefs(props)

const isShowRef = ref<boolean>()

function close() {
  emit('onClose')
}
watch(isShow, () => isShowRef.value = isShow.value)
</script>

<template>
  <v-dialog max-width="800px" :model-value="isShowRef" scrollable @update:model-value="close">
    <v-card v-for="(photo, index) in userPhotos" :key="index" :value="photo">
      <v-col>
        <v-img
          class="mx-auto my-5 elevation-5" rounded="xl" :width="150" :height="150" cover
          :src="photo"
        />
      </v-col>
    </v-card>
  </v-dialog>
</template>

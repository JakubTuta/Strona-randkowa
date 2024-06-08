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
  <v-dialog max-width="flex" :model-value="isShowRef" @update:model-value="close">
    <v-sheet>
      <v-row>
        <v-card v-for="(photo, index) in userPhotos" :key="index" class="mx-auto my-8" :value="photo">
          <v-card>
            <v-img
              :src="photo"
              height="150"
              width="150"
              class="align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              cover
            >
              <v-card-title class="text-white" text="Shit" />
            </v-img>
          </v-card>
        </v-card>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

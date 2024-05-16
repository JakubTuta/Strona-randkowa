<script setup lang="ts">
const props = defineProps<{
  valid?: boolean
  label?: string | null
}>()

const image = defineModel<string | null>('image', { default: null })

const { valid, label } = toRefs(props)

const value = ref(null)
const inputUpload: Ref<null | { click: () => void }> = ref(null)
const isSelecting = ref(false)

const labelStyle = computed(() => ((valid.value || image.value)
  ? ''
  : 'color: red'))

function toBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

function uploadImage(event: { target: any }) {
  if (!event.target?.files.length)
    return

  const file = event.target.files[0]

  const fileRun = (fileInBase64: any) => {
    // emit('setImage', { fileInBase64 })
    image.value = fileInBase64
    value.value = null
  }

  toBase64(file).then(fileRun)
}

function addDropFile(data: { dataTransfer: any }) {
  uploadImage({ target: data.dataTransfer })
}

function removeImage() {
  // emit('setImage', null)
  image.value = null
}

function onButtonClick() {
  isSelecting.value = true

  window.addEventListener(
    'focus',
    () => {
      isSelecting.value = false
    },
    { once: true },
  )

  if (inputUpload.value)
    inputUpload.value.click()
}
</script>

<template>
  <v-col class="align-center d-flex flex-column justify-center">
    <v-row
      v-if="image"
      class="pb-4"
    >
      <img
        id="imgPreview"
        :src="image"
      >
    </v-row>

    <v-row>
      <span
        v-if="label"
        class="label"
        :style="labelStyle"
      >
        {{ label }}
      </span>
    </v-row>

    <v-row>
      <div
        v-if="!image"
        v-cloak
        @dragover.prevent
        @drop.prevent="addDropFile"
      >
        <v-btn
          class="ma-1"
          color="secondary"
          float
          append-icon="mdi-camera"
          :loading="isSelecting"
          @click="onButtonClick"
        >
          {{ $t("uploadImage.uploadImage") }}
        </v-btn>
      </div>

      <div
        v-else
        v-cloak
        @dragover.prevent
        @drop.prevent="addDropFile"
      >
        <v-tooltip
          location="bottom"
          max-width="300"
        >
          <template #activator="{ 'props': propsTooltip }">
            <v-btn
              class="ma-1"
              color="secondary"
              float
              :loading="isSelecting"
              size="small"
              v-bind="propsTooltip"
              icon="mdi-image"
              @click="onButtonClick"
            />
          </template>
          {{ $t("uploadImage.uploadImage") }}
        </v-tooltip>
      </div>

      <input
        ref="inputUpload"
        accept="image/*"
        class="d-none"
        type="file"
        :value="value"
        @change="uploadImage"
      >

      <v-tooltip
        v-if="image"
        location="bottom"
        max-width="300"
      >
        <template #activator="{ 'props': propsTooltip }">
          <v-btn
            class="ma-1"
            float
            size="small"
            v-bind="propsTooltip"
            icon="mdi-minus"
            @click="removeImage"
          />
        </template>
        {{ $t("uploadImage.removeImage") }}
      </v-tooltip>
    </v-row>
  </v-col>
</template>

<style scoped>
#imgPreview {
  max-height: 250px;
  width: 100%;
  object-fit: contain;
}
</style>

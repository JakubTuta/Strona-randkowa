<script lang="ts" setup>
const props = defineProps<{
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
  (e: 'onBlock'): void
}>()

function close() {
  emit('onClose')
}
function confirmBlock() {
  emit('onClose')
  emit('onBlock')
}

const { isShow } = toRefs(props)
</script>

<template>
  <v-dialog v-model="isShow" max-width="500px">
    <v-card>
      <v-card-title class="headline">
        {{ $t("chatView.blockTitle") }}
      </v-card-title>
      <v-card-text>
        {{ $t("chatView.blockText") }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" @click="close()">
          {{ $t("chatView.cancel") }}
        </v-btn>
        <v-btn color="primary" @click="confirmBlock">
          {{ $t("chatView.confirm") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>

</style>

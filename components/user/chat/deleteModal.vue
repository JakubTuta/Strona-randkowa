<script lang="ts" setup>
import type { DocumentReference } from 'firebase/firestore'

const props = defineProps<{
  // userToDelete: DocumentReference
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
  (e: 'onDelete'): void
}>()

function close() {
  emit('onClose')
}
function confirmDelete() {
  emit('onClose')
  emit('onDelete')
}

const { isShow } = toRefs(props)
</script>

<template>
  <v-dialog v-model="isShow" max-width="500px">
    <v-card>
      <v-card-title class="headline">
        {{ $t("chatView.deleteTitle") }}
      </v-card-title>
      <v-card-text>
        {{ $t("chatView.deleteText") }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" @click="close()">
          {{ $t("chatView.cancel") }}
        </v-btn>
        <v-btn color="primary" @click="confirmDelete">
          {{ $t("chatView.confirm") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>

</style>

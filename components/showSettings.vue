<script setup lang="ts">
import {useTheme} from "vuetify";
import {toggleTheme} from "~/helpers/theme";

const props = defineProps<{
  isShow: boolean
}>()

const { isShow } = toRefs(props)

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  emit('onClose')
}

const theme = useTheme()

</script>

<template>
  <v-dialog
      max-width="900px"
      :model-value="isShow"
      @update:model-value="close"
  >
    <v-card>
      <v-card-title>
        Ustawienia
      </v-card-title>
      <v-card-text>
        <v-btn variant="text" color="white" icon="mdi-theme-light-dark" @click="toggleTheme(theme)" />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="close">
          Zamknij
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

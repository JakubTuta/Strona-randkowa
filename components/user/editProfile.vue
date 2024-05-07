<script lang="ts" setup>
import type { UserModel } from '~/models/user'

const props = defineProps<{
  isShow: boolean
  userData: UserModel | null
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
  (e: 'onSave'): UserModel
}>()

const appStore = useAppStore()
const { isShow, userData } = toRefs(props)

const newDataUser = ref<UserModel | null>(userData.value)
const isShowRef = ref<boolean>()

const description = ref<string>(newDataUser.value?.description)

function close() {
  emit('onClose')
}

function saveData() {
  if (newDataUser.value != null) {
    newDataUser.value.description = description.value
    appStore.editUser(newDataUser.value)
  }
  emit('onSave')
  emit('onClose')
}

watch(isShow, () => isShowRef.value = isShow.value)
</script>

<template>
  <v-dialog max-width="800px" :model-value="isShowRef" scrollable @update:model-value="close">
    <v-card>
      <v-card-title class="text-h5 flex-wrap">
        {{ $t("profile.editProfile") }}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="description" :label="$t('profile.description')" />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="close">
          Zamknij
        </v-btn>
        <v-btn color="success" @click="saveData">
          Zapisz
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

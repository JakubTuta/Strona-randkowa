<script lang="ts" setup>
import type { MessageModel } from '~/models/message'
import type { UserModel } from '~/models/user'

const props = defineProps<{
  pickedUser: UserModel | null
  messages: MessageModel[]
}>()

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const { pickedUser, messages } = toRefs(props)

function isFromCurrentUser(message: MessageModel) {
  return message.fromUser.id === userData?.value?.reference?.id
}
</script>

<template>
  <v-row class="mt-4" style="height: 8%;">
    <v-col cols="4" class="text-h5">
      <v-avatar
        class="ma-3"
        rounded="xl"
        size="40"
      >
        <v-img :src="pickedUser?.photos[0]" />
      </v-avatar>
      {{ pickedUser?.firstName }} {{ pickedUser?.lastName }}
    </v-col>

    <v-spacer />

    <v-col cols="1">
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props" color="" />
        </template>

        <v-list class="justify-center">
          <v-list-item prepend-icon="mdi-account" :title="$t('chatView.viewProfile')" />
          <v-list-item prepend-icon="mdi-star" :title="$t('chatView.rate')" />
          <v-list-item prepend-icon="mdi-delete-outline" :title="$t('chatView.remove')" />
          <v-list-item prepend-icon="mdi-lock" :title="$t('chatView.block')" />
        </v-list>
      </v-menu>
    </v-col>
  </v-row>

  <v-divider class="my-3" />
  <div style="height: 72%" class="mt-6 px-8 text-justify">
    <template v-for="(message, index) in messages" :key="index">
      <v-row>
        <v-spacer v-if="isFromCurrentUser(message)" />
        <v-avatar
          v-else
          class="ma-3"
          rounded="xl"
          size="40"
        >
          <v-img :src="currentUser?.photos[0]" />
        </v-avatar>
        <v-col :cols="isFromCurrentUser(message) ? 6 : 5">
          <v-card :class="isFromCurrentUser(message) ? 'bg-secondary pa-4' : 'bg-primary pa-4'">
            {{ message.text }}
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<style>

</style>

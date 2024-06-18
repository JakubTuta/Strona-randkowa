<script lang="ts" setup>
import type { ChatRoomModel } from '~/models/chatRoom'
import type { MessageModel } from '~/models/message'
import type { UserModel } from '~/models/user'

const props = defineProps<{
  pickedUser: UserModel | null
  messages: MessageModel[]
}>()

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const messagesStore = useMessageStore()
const { chatRoom } = storeToRefs(messagesStore)

const sharedStore = useSharedStore()
const { loading } = storeToRefs(sharedStore)

const { pickedUser, messages } = toRefs(props)

function isFromCurrentUser(message: MessageModel) {
  return message.fromUser.id === userData?.value?.reference?.id
}

async function load({ done }: { done: Function }) {
  setTimeout(async () => {
    try {
      const data = await messagesStore.fetchNextMessages()
      if (!data)
        done('empty')
      else
        done('ok')
    }
    catch (error) {
      console.error('Error loading messages:', error)
      done('error')
    }
  }, 100)
}
</script>

<template>
  <v-row class="my-2" style="height: 8%;">
    <v-col cols="auto" class="text-h5">
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

  <v-divider />

  <div style="height: 77%" class="mt-6 px-8 text-justify">
    <template v-if="chatRoom && !loading">
      <v-infinite-scroll
        v-if="messages.length > 0"
        class="mt-n2"
        height="655"
        side="start"
        style="overflow-x: hidden;"
        mode="intersect"
        :load-more-text="$t('chatView.loadMore')"
        :empty-text="$t('chatView.noMore')"
        @load="load"
      >
        <template v-for="message in messages" :key="message.reference.id">
          <v-row>
            <v-spacer v-if="isFromCurrentUser(message)" />
            <v-avatar
              v-else
              class="ma-3"
              rounded="xl"
              size="40"
            >
              <v-img :src="pickedUser?.photos[0]" />
            </v-avatar>
            <v-col :cols="isFromCurrentUser(message) ? 6 : 5">
              <v-card :class="isFromCurrentUser(message) ? 'bg-secondary pa-4 mr-2' : 'bg-primary pa-4'">
                {{ message.text }}
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-infinite-scroll>
    </template>

    <div v-else-if="!chatRoom && !loading && pickedUser" class="d-flex flex-column justify-center align-center" style="height: 77%;">
      <nuxt-img src="/waving-hand.webp" style="height: 60px; width: 60px;" />
      <div class="text-h5 text-center">
        {{ $t('chatView.sayHello') }}
      </div>
    </div>
  </div>
</template>

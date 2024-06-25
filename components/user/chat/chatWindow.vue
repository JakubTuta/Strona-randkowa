<script lang="ts" setup>
import { useDisplay, useTheme } from 'vuetify'
import type { ChatRoomModel } from '~/models/chatRoom'
import type { MessageModel } from '~/models/message'
import type { UserModel } from '~/models/user'

const props = defineProps<{
  pickedUser: UserModel | null
  messages: MessageModel[]
}>()

const drawer = defineModel({ default: false })

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const messagesStore = useMessageStore()
const { chatRoom } = storeToRefs(messagesStore)

const sharedStore = useSharedStore()
const { loading } = storeToRefs(sharedStore)

const { pickedUser, messages } = toRefs(props)

const { name } = useDisplay()

const vTheme = useTheme()

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

function getMessageClass(message: MessageModel) {
  let maxChars = 0
  switch (name.value) {
    case 'xs':
      maxChars = 10
      break
    case 'sm':
      maxChars = 30
      break
    case 'md':
      maxChars = 40
      break
    case 'lg':
      maxChars = 50
      break
    case 'xl':
      maxChars = 70
      break
    case 'xxl':
      maxChars = 120
      break
    default:
      maxChars = 20
  }

  const display = message.text.length > maxChars ? 'd-block' : 'd-inline-block'

  return isFromCurrentUser(message)
    ? `bg-secondary pa-4 mr-2 mr-0 mr-md-8 text-left ${display}`
    : `bg-primary pa-4 ${display}`
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
        <v-img v-if="pickedUser?.photos.length" :src="pickedUser?.photos[0]" />
        <v-img v-else-if="vTheme.current.value.dark" src="/account-dark.png" />
        <v-img v-else src="/account-white.png" />
      </v-avatar>
      {{ pickedUser?.firstName }} {{ pickedUser?.lastName }}
    </v-col>

    <v-spacer />

    <v-col cols="3" align="right">
      <v-btn
        density="comfortable"
        icon="mdi-dots-vertical"
        color=""
        size="large" class="mt-4 mr-4"
        @click="drawer = !drawer"
      />
    </v-col>
  </v-row>

  <v-divider />

  <div style="height: 70%" class="mt-6 px-8 pt-0 pb-2 text-justify">
    <template v-if="chatRoom && !loading">
      <v-infinite-scroll
        v-if="messages.length > 0"
        :key="chatRoom?.reference?.id || 0"
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
              <v-img v-if="pickedUser?.photos.length" :src="pickedUser?.photos[0]" />
              <v-img v-else-if="vTheme.current.value.dark" src="/account-dark.png" />
              <v-img v-else src="/account-white.png" />
            </v-avatar>
            <v-col :cols="isFromCurrentUser(message) ? 6 : 5" :align="isFromCurrentUser(message) ? 'right' : 'left'">
              <v-card
                :class="getMessageClass(message)"
              >
                {{ message.text }}
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-infinite-scroll>
    </template>

    <div v-else-if="!chatRoom && !loading && pickedUser" class="d-flex flex-column justify-center align-center" style="height: 77%;">
      <img src="/waving-hand.webp" style="height: 60px; width: 60px;">
      <div class="text-h5 text-center">
        {{ $t('chatView.sayHello') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.inline-block {
  display: inline-block;
}
</style>

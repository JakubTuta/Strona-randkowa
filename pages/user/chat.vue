<script lang="ts" setup>
import EmojiPicker from 'vue3-emoji-picker'
import MatchedProfileCard from '~/components/user/chat/matchedProfileCard.vue'
import 'vue3-emoji-picker/css'
import type { UserModel } from '~/models/user'
import { MessageModel } from '~/models/message'

definePageMeta({
  layout: 'user',
})

const appStore = useAppStore()
const { userMatches, userData } = storeToRefs(appStore)

const messageStore = useMessageStore()

const { chatRoom, messages } = storeToRefs(messageStore)

const isEmojiPickerVisible = ref(false)
const message = ref('')
const wrapper = ref(null)
const pickedUser: Ref<UserModel | null> = ref(null)

watch(userData, async (newValue) => {
  if (newValue) {
    await appStore.fetchLikedProfiles(userData.value?.matches || [])
    pickedUser.value = userMatches.value[0]

    if (userData.value?.reference && pickedUser.value?.reference)
      await messageStore.getChatRoom(userData.value?.reference, pickedUser.value?.reference)
  }

  if (chatRoom.value?.reference)
    await messageStore.fetchMessages(chatRoom.value.reference)
})

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await appStore.fetchLikedProfiles(userData.value?.matches || [])
  pickedUser.value = userMatches.value[0]

  if (userData.value?.reference && pickedUser.value?.reference)
    await messageStore.getChatRoom(userData.value?.reference, pickedUser.value?.reference)

  if (chatRoom.value?.reference)
    await messageStore.fetchMessages(chatRoom.value.reference)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function onSelectEmoji(emoji) {
  message.value += emoji.i
}

function showEmojiPicker() {
  setTimeout(() => {
    isEmojiPickerVisible.value = !isEmojiPickerVisible.value
  }, 0)
}

function handleClickOutside(event) {
  if (event.target.id === 'emoji')
    return

  if (wrapper.value && !wrapper.value.contains(event.target))
    isEmojiPickerVisible.value = false
}

function setCurrentUser(index: number) {
  pickedUser.value = userMatches.value[index]
}

function sendMessage() {
  if (userData.value?.reference && pickedUser.value?.reference) {
    const toUser = chatRoom.value?.usersRefs.filter(ref => ref.id !== userData.value?.reference?.id)[0]

    if (!toUser) {
      console.error('No user found')
      return
    }

    const newMessage = new MessageModel({
      fromUser: userData.value?.reference,
      toUser,
      text: message.value,
      date: new Date(),
    }, null)
    messageStore.sendMessage(newMessage)
    message.value = ''
  }
}
</script>

<template>
  <v-row class="h-100 mb-8 px-4">
    <v-col cols="3">
      <v-virtual-scroll
        height="85vh"
        :items="userMatches"
      >
        <template #default="{ item, index }">
          <MatchedProfileCard :user="item" @click="setCurrentUser(index)" />
        </template>
      </v-virtual-scroll>
    </v-col>
    <v-col cols="9">
      <UserChatWindow :picked-user="pickedUser" :messages="messages" />
      <div id="wrapper" ref="wrapper">
        <EmojiPicker
          v-if="isEmojiPickerVisible"
          :native="true"
          style="position: absolute; bottom: 140px; right: 80px;"
          :disable-skin-tones="true"
          @select="onSelectEmoji"
        />
      </div>

      <div style="height: 15%;" class="d-flex align-end pb-2">
        <v-textarea
          v-model="message"
          :label="$t('chatView.enterMessage')"
          color="primary"
          no-resize
          rows="3"
          auto-grow
          style="max-height: 180px; overflow: auto; width: 74%;"
          class="mr-4"
          @keydown.enter.prevent="sendMessage"
        >
          <template #append-inner>
            <v-icon id="emoji" style="cursor: pointer;" @click="showEmojiPicker">
              mdi-emoticon-outline
            </v-icon>
          </template>
        </v-textarea>

        <div class="h-100">
          <v-btn icon="mdi-send" :disabled="!message.length" style="width: 50px;" @click="sendMessage" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style>

</style>

<script lang="ts" setup>
import { Timestamp } from 'firebase/firestore'
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

const { messages, matchedUsersInfo, chatRoom, chatRooms } = storeToRefs(messageStore)

const isEmojiPickerVisible = ref(false)
const message = ref('')
const wrapper = ref(null)
const pickedUser: Ref<UserModel | null> = ref(null)

watch(userData, async (newValue) => {
  if (newValue) {
    await appStore.fetchLikedProfiles(userData.value?.matches || [])
    pickedUser.value = userMatches.value[0]

    if (userData.value?.reference && pickedUser.value?.reference && matchedUsersInfo.value.length === 0) {
      await messageStore.getMatchedUsersInfo(userData.value?.reference, userData.value?.matches)
      messageStore.setCurrentChatRoom(matchedUsersInfo.value[0].chatRoom)
    }
  }

  if (chatRoom.value?.reference)
    await messageStore.fetchMessages(chatRoom.value.reference)
})

watch(chatRooms, async (newValue, oldValue) => {
  if ((newValue.length > oldValue.length) && userData.value?.reference) {
    // TODO do zmiany to czyszczenie?
    matchedUsersInfo.value = []
    await messageStore.getMatchedUsersInfo(userData.value.reference, userData.value?.matches)
  }
})

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await appStore.fetchLikedProfiles(userData.value?.matches || [])
  pickedUser.value = userMatches.value[0]

  if (userData.value?.reference && pickedUser.value?.reference && matchedUsersInfo.value.length === 0) {
    await messageStore.getMatchedUsersInfo(userData.value?.reference, userData.value?.matches)
    messageStore.setCurrentChatRoom(matchedUsersInfo.value[0].chatRoom)
  }

  if (chatRoom.value?.reference)
    await messageStore.fetchMessages(chatRoom.value.reference)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const sortedByDateUserMatchesInfo = computed(() => {
  const result = [...matchedUsersInfo.value].sort((a, b) => {
    if (!a.lastMessageDate || !b.lastMessageDate)
      return 0

    return b.lastMessageDate.toMillis() - a.lastMessageDate.toMillis()
  })

  console.log(result, 'sortedByDateUserMatchesInfo')
  return result
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

function setNewChatRoom(index: number) {
  pickedUser.value = userMatches.value[index]
  // TODO usunac pickedUser i currentChatRoom, zastapic obiektem z tablicy matchedUsersInfo

  messageStore.setCurrentChatRoom(matchedUsersInfo.value[index].chatRoom)
}

function updateMatchInfo() {
  matchedUsersInfo.value = matchedUsersInfo.value.map((info) => {
    if (info?.user?.reference?.id === pickedUser.value?.reference?.id)
      return { ...info, chatRoom: chatRoom.value }

    return info
  })
}

watch(pickedUser, async () => {
  // TODO do zmiany to czyszczenie?
  messages.value = []
  if (chatRoom.value?.reference)
    await messageStore.fetchMessages(chatRoom.value.reference)
})
watch(matchedUsersInfo, () => {
  console.log('matchedUsersInfo', matchedUsersInfo.value)
})

async function sendMessage() {
  if (!chatRoom.value && pickedUser.value?.reference && userData.value?.reference) {
    await messageStore.createChatRoom(userData.value.reference, pickedUser.value?.reference)
    updateMatchInfo()
  }

  if (userData.value?.reference) {
    const toUser = chatRoom.value?.usersRefs.filter(ref => ref.id !== userData.value?.reference?.id)[0]

    if (!toUser) {
      console.error('No user found')
      return
    }

    const newMessage = new MessageModel({
      fromUser: userData.value?.reference,
      toUser,
      text: message.value,
      date: Timestamp.now(),
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
        height="100%"
        :items="sortedByDateUserMatchesInfo"
      >
        <template #default="{ item, index }">
          <MatchedProfileCard :matched-user-info="item" @click="setNewChatRoom(index)" />
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

        <div class="h-100 pt-6">
          <v-btn icon="mdi-send" :disabled="!message.length" style="width: 50px;" @click="sendMessage" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style>

</style>

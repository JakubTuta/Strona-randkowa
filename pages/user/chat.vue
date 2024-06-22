<script lang="ts" setup>
import type { DocumentReference } from 'firebase/firestore'
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

const { matchedUsersInfo, chatRoom, chatRooms } = storeToRefs(messageStore)

const isEmojiPickerVisible = ref(false)
const message = ref('')
const wrapper: Ref<HTMLDivElement | null> = ref(null)
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

  if (matchedUsersInfo.value.length) {
    const chatRoomRefs: DocumentReference[] = matchedUsersInfo.value
      .map(info => info.chatRoom?.reference)
      .filter(ref => ref !== undefined) as DocumentReference[]

    await messageStore.fetchMessagesForAllChatRooms(chatRoomRefs)
  }
})

watch(chatRooms, async (newValue, oldValue) => {
  if ((newValue.length > oldValue.length) && userData.value?.reference) {
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

  if (matchedUsersInfo.value.length) {
    const chatRoomRefs: DocumentReference[] = matchedUsersInfo.value
      .map(info => info.chatRoom?.reference)
      .filter(ref => ref !== undefined) as DocumentReference[]

    await messageStore.fetchMessagesForAllChatRooms(chatRoomRefs)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const sortedByDateUserMatchesInfo = computed(() => {
  return [...matchedUsersInfo.value].sort((a, b) => {
    if (!a.lastMessageDate)
      return 1

    if (!b.lastMessageDate)
      return -1

    return b.lastMessageDate.toMillis() - a.lastMessageDate.toMillis()
  })
})

function onSelectEmoji(emoji: { i: string }) {
  message.value += emoji.i
}

function showEmojiPicker() {
  setTimeout(() => {
    isEmojiPickerVisible.value = !isEmojiPickerVisible.value
  }, 0)
}

function handleClickOutside(event: MouseEvent) {
  if ((event?.target as HTMLElement)?.id === 'emoji')
    return

  if (wrapper.value && !wrapper.value.contains(event.target as Node))
    isEmojiPickerVisible.value = false
}

function setNewChatRoom(index: number) {
  pickedUser.value = sortedByDateUserMatchesInfo.value[index].user
  // TODO usunac pickedUser i currentChatRoom, zastapic obiektem z tablicy matchedUsersInfo

  messageStore.setCurrentChatRoom(sortedByDateUserMatchesInfo.value[index].chatRoom)
}

function updateMatchInfo() {
  matchedUsersInfo.value = matchedUsersInfo.value.map((info) => {
    if (info?.user?.reference?.id === pickedUser.value?.reference?.id)
      return { ...info, chatRoom: chatRoom.value }

    return info
  })
}

// watch(pickedUser, async () => {
//   if (chatRoom.value?.reference)
//     await messageStore.fetchMessages(chatRoom.value.reference)
// })

const currentChatRoomMessages = computed(() => {
  return matchedUsersInfo.value.find(info => info.chatRoom?.reference === chatRoom.value?.reference)?.messages || []
})

async function sendMessage() {
  if (!message.value) {
    return
  }

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
      <UserChatWindow :picked-user="pickedUser" :messages="currentChatRoomMessages" />
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

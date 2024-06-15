<script lang="ts" setup>
import EmojiPicker from 'vue3-emoji-picker'
import MatchedProfileCard from '~/components/user/chat/matchedProfileCard.vue'
import 'vue3-emoji-picker/css'
import type { UserModel } from '~/models/user'

definePageMeta({
  layout: 'user',
})

const appStore = useAppStore()
const { userMatches, userData } = storeToRefs(appStore)

const isEmojiPickerVisible = ref(false)
const message = ref('')
const wrapper = ref(null)
const currentUser: Ref<UserModel | null> = ref(null)

watch(userData, async (newValue) => {
  if (newValue) {
    await appStore.fetchLikedProfiles(userData.value?.matches || [])
    currentUser.value = userMatches.value[0]
  }
})

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await appStore.fetchLikedProfiles(userData.value?.matches || [])
  currentUser.value = userMatches.value[0]
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
  currentUser.value = userMatches.value[index]
}

watch(message, (newValue) => {
  console.log(newValue)
})
</script>

<template>
  <v-row class="h-100 mb-8 px-4">
    <v-col cols="3">
      <v-virtual-scroll
        height="100vh"
        :items="userMatches"
      >
        <template #default="{ item, index }">
          <MatchedProfileCard :user="item" @click="setCurrentUser(index)" />
        </template>
      </v-virtual-scroll>
    </v-col>
    <v-col cols="9">
      <UserChatWindow :current-user="currentUser" />
      <div id="wrapper" ref="wrapper">
        <EmojiPicker
          v-if="isEmojiPickerVisible"
          :native="true"
          style="position: absolute; bottom: 220px; right: 60px;"
          :disable-skin-tones="true"
          @select="onSelectEmoji"
        />
      </div>

      <div style="height: 15%;" class="mt-4">
        <v-form>
          <v-textarea
            v-model="message"
            :label="$t('chatView.enterMessage')"
            color="primary"
            no-resize
          >
            <template #append-inner>
              <v-icon id="emoji" style="cursor: pointer;" @click="showEmojiPicker">
                mdi-emoticon-outline
              </v-icon>
            </template>

            <template #append>
              <v-btn icon="mdi-send" :disabled="!message.length" />
            </template>
          </v-textarea>
        </v-form>
      </div>
    </v-col>
  </v-row>
</template>

<style>

</style>

<script lang="ts" setup>
import EmojiPicker from 'vue3-emoji-picker'
import MatchedProfileCard from '~/components/user/chat/matchedProfileCard.vue'
import 'vue3-emoji-picker/css'

definePageMeta({
  layout: 'user',
})

const appStore = useAppStore()
const { userMatches, userData } = storeToRefs(appStore)

const isEmojiPickerVisible = ref(false)
const message = ref('')
const wrapper = ref(null)

watch(userData, async (newValue) => {
  if (newValue)
    await appStore.fetchLikedProfiles(userData.value?.matches || [])
})

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await appStore.fetchLikedProfiles(userData.value?.matches || [])
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

watch(message, (newValue) => {
  console.log(newValue)
})
</script>

<template>
  <v-row class="h-100 mb-0 px-4">
    <v-col cols="3" style="background-color: rgb(37, 37, 27); color: white">
      <template v-for="(user, index) in userMatches" :key="index">
        <MatchedProfileCard :user="user" />
      </template>
    </v-col>
    <v-col cols="9">
      <div class="bg-secondary" style="height: 80%">
        <v-row>
          <v-spacer />
          <v-col cols="3">
            First message own
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3">
            Second message you
          </v-col>
        </v-row>
      </div>

      <div id="wrapper" ref="wrapper">
        <EmojiPicker
          v-if="isEmojiPickerVisible"
          :native="true"
          style="position: absolute; bottom: 220px; right: 60px;"
          :disable-skin-tones="true"
          @select="onSelectEmoji"
        />
      </div>

      <div style="height: 20%;" class="mt-4">
        <v-form>
          <v-textarea
            v-model="message"
            color="primary"
            no-resize
          >
            <template #append-inner>
              <v-icon id="emoji" style="cursor: pointer;" @click="showEmojiPicker">
                mdi-emoticon-outline
              </v-icon>
            </template>

            <template #append>
              <v-btn icon="mdi-send" />
            </template>
          </v-textarea>
        </v-form>
      </div>
    </v-col>
  </v-row>
</template>

<style>

</style>

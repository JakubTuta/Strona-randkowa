<script lang="ts" setup>
import MatchedProfileCard from '~/components/user/chat/matchedProfileCard.vue'

definePageMeta({
  layout: 'user',
})

const appStore = useAppStore()
const { userMatches, userData } = storeToRefs(appStore)

watch(userData, async (newValue) => {
  if (newValue)
    await appStore.fetchLikedProfiles(userData.value?.matches || [])
})

onMounted(async () => {
  await appStore.fetchLikedProfiles(userData.value?.matches || [])
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
      <div style="height: 20%;" class="mt-4">
        <v-form>
          <v-textarea
            color="primary"
            no-resize
            append-inner-icon="mdi-emoticon-outline"
            append-icon="mdi-send"
          />
        </v-form>
      </div>
    </v-col>
  </v-row>
</template>

<style>

</style>

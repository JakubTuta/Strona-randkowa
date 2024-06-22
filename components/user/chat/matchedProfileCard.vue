<script lang="ts" setup>
import { useTheme } from 'vuetify'
import type { UserModel } from '~/models/user'

const props = defineProps<{
  matchedUserInfo: MatchInfo
}>()

const { matchedUserInfo } = toRefs(props)

const vTheme = useTheme()
</script>

<template>
  <v-card style="cursor: pointer;" class=" my-1 mx-1">
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-avatar
        class="ma-3"
        rounded="xl"
        size="85"
      >
        <v-img v-if="matchedUserInfo.user?.photos.length" :src="matchedUserInfo.user?.photos[0]" />
        <v-img v-else-if="vTheme.current.value.dark" src="/account-dark.png" />
        <v-img v-else src="/account-white.png" />
      </v-avatar>

      <div>
        <v-card-title class="text-h5" align="center" justify="center">
          {{ matchedUserInfo.user?.firstName }}
          {{ matchedUserInfo.user?.lastName }}
        </v-card-title>

        <v-card-subtitle class="text-h6" align="center" justify="center">
          {{ matchedUserInfo?.lastMessage }}
          <v-icon v-if="matchedUserInfo?.isLastMessageToAnotherUser" size="x-small">
            mdi-check-circle-outline
          </v-icon>
        </v-card-subtitle>
      </div>
    </div>
  </v-card>
</template>

<style>

</style>

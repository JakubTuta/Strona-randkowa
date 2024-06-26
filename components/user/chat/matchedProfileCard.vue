<script lang="ts" setup>
import { useDisplay, useTheme } from 'vuetify'
import { format, isThisWeek, isToday } from 'date-fns'

const props = defineProps<{
  matchedUserInfo: MatchInfo
}>()

const { matchedUserInfo } = toRefs(props)

const vTheme = useTheme()
const { mdAndDown, smAndDown } = useDisplay()
const { t } = useI18n()

function formatLastMessageDate(date: Date | undefined) {
  if (!date)
    return ''

  if (isToday(date))
    return format(date, 'HH:mm')
  else if (isThisWeek(date))
    return t(`weekDays.${format(date, 'EEEE')}`)
  else
    return format(date, 'dd.MM')
}
</script>

<template>
  <v-card style="cursor: pointer;" color="background" class=" my-1 mx-1">
    <v-row>
      <v-col cols="3">
        <v-avatar
          class="ma-3"
          rounded="xl"
          :size="smAndDown ? 50 : 85"
        >
          <v-img v-if="matchedUserInfo.user?.photos.length" :src="matchedUserInfo.user?.photos[0]" />
          <v-img v-else-if="vTheme.current.value.dark" src="/account-dark.png" />
          <v-img v-else src="/account-white.png" />
        </v-avatar>
        <v-badge
          v-if="matchedUserInfo.isNewMessage && mdAndDown"
          dot
          inline
          color="secondary"
        />
      </v-col>

      <v-col v-if="!mdAndDown" cols="9">
        <v-card-title class="text-h5" align="left">
          {{ matchedUserInfo.user?.firstName }}
          {{ matchedUserInfo.user?.lastName }}
          <v-badge
            v-if="matchedUserInfo.isNewMessage"
            dot
            floating
            color="secondary"
          />
        </v-card-title>

        <v-card-subtitle>
          <v-row>
            <v-col cols="8" align="left" :class="matchedUserInfo?.isNewMessage ? 'font-weight-bold' : ''">
              {{ matchedUserInfo?.lastMessage }}
            </v-col>

            <v-col cols="4" align="right">
              <v-icon v-if="matchedUserInfo?.isLastMessageToAnotherUser" size="x-small">
                mdi-check-circle-outline
              </v-icon>
              {{ formatLastMessageDate(matchedUserInfo?.lastMessageDate?.toDate()) }}
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-col>
    </v-row>
  </v-card>
</template>

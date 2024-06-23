<script lang="ts" setup>
import { useDisplay, useTheme } from 'vuetify'
import type { UserModel } from '~/models/user'

const drawerProps = defineProps<{
  pickedUser: UserModel | null
}>()

const vTheme = useTheme()
const { name } = useDisplay()
const drawer = defineModel({ default: false })

const { pickedUser } = toRefs(drawerProps)

const userAge = computed(() => {
  const today = new Date()
  const userDate = pickedUser.value?.dateBirth || new Date()

  const yearDifference = today.getFullYear() - userDate.getFullYear()

  const monthDifference = today.getMonth() - userDate.getMonth()
  const dayDifference = today.getDate() - userDate.getDate()

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0))
    return yearDifference - 1

  return yearDifference
})

const drawerWidth = computed(() => {
  switch (name.value) {
    case 'xs':
      return 300
    case 'sm':
      return 400
    case 'md':
      return 500
    case 'lg':
      return 600
    case 'xl':
      return 700
    default:
      return 600
  }
})
</script>

<template>
  <v-navigation-drawer v-model="drawer" :width="drawerWidth" temporary location="right" class="pt-2 px-2">
    <v-row>
      <v-col cols="12" align="center">
        <v-avatar
          class="ma-3"
          rounded="xl"
          size="100"
        >
          <v-img v-if="pickedUser?.photos.length" :src="pickedUser?.photos[0]" />
          <v-img v-else-if="vTheme.current.value.dark" src="/account-dark.png" />
          <v-img v-else src="/account-white.png" />
        </v-avatar>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" align="center" class="text-h3">
        {{ pickedUser?.firstName }} {{ pickedUser?.lastName }} {{ userAge }}
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="6" align="center">
        <v-tooltip
          :text="$t('chatView.rate')"
          location="top"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              density="comfortable"
              icon="mdi-star"
              color=""
              size="large" class="mt-4 mr-6"
            />
          </template>
        </v-tooltip>

        <v-tooltip
          :text="$t('chatView.remove')"
          location="top"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              density="comfortable"
              icon="mdi-delete-outline"
              color=""
              size="large" class="mt-4 mr-6"
            />
          </template>
        </v-tooltip>

        <v-tooltip
          :text="$t('chatView.block')"
          location="top"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              density="comfortable"
              icon="mdi-lock"
              color=""
              size="large" class="mt-4 mr-6"
            />
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" align="center">
        {{ pickedUser?.description }}
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

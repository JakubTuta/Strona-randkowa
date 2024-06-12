<script lang="ts" setup>
import type { UserModel } from '~/models/user'

const props = defineProps<{
  user: UserModel | null
}>()

const emit = defineEmits(['dislike', 'like'])

const { user } = toRefs(props)
const { t } = useI18n()

const showDetails = ref(false)

const userAge = computed(() => {
  const today = new Date()
  const userDate = user.value?.dateBirth || new Date()

  const yearDifference = today.getFullYear() - userDate.getFullYear()

  const monthDifference = today.getMonth() - userDate.getMonth()
  const dayDifference = today.getDate() - userDate.getDate()

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0))
    return yearDifference - 1

  return yearDifference
})

async function dislike() {
  emit('dislike')
}
async function like() {
  emit('like')
}
</script>

<template>
  <v-card
    class="mx-auto"
  >
    <v-img
      class="align-end fill-height"
      height="400"
      weight="400"
      :src="user?.photos[0] || ''"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      cover
      :aspect-ratio="1"
      max-height="600"
    >
      <v-card-title class="text-white">
        <div style="font-weight: bold;" class="text-h4">
          {{ `${user?.firstName || ''} ${user?.lastName || ''}, ${userAge}` }}
        </div>
        <div style="font-family:sans-serif; font-style:italic;">
          {{ t(`user.sex.${user?.gender || 'other'}`) }}
        </div>
      </v-card-title>
      <v-row>
        <v-col>
          <v-btn
            append-icon="mdi-chevron-left"
            color="red-lighten-2"
            :text="t('matchingView.discard')"
            variant="outlined"
            block
            @click="dislike()"
          />
        </v-col>

        <v-col>
          <v-btn
            append-icon="mdi-chevron-right"
            color="red-lighten-2"
            :text="t('matchingView.accept')"
            variant="outlined"
            block
            @click="like()"
          />
        </v-col>
      </v-row>
    </v-img>

    <v-card-text class="pt-4 text-h4 text-center" style="font-style: italic;">
      {{ user?.description || '' }}
    </v-card-text>

    <v-card-actions>
      <v-btn append-icon="mdi-chevron-double-down" color="primary" block @click="showDetails = !showDetails" />
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showDetails">
        <v-divider />

        <v-card-text class="pt-4 text-h6 text-center">
          <v-row justify="center" cols="12">
            <v-col md="4" sm="6">
              <v-icon left>
                mdi-account-search
              </v-icon>
              <div style="margin-left: 10px;">
                {{ t(`user.sex.${user?.preferredGender || 'other'}`) }}
              </div>
            </v-col>
            <v-col md="4" sm="12">
              <v-icon left>
                mdi-magnify
              </v-icon>
              <div style="margin-left: 10px;">
                {{ t(`user.preferredRelationship.${user?.lookingFor || 'other'}`) }}
              </div>
            </v-col>
            <v-col>
              <v-icon left>
                mdi-book-open-page-variant
              </v-icon>
              <div style="margin-left: 10px;">
                {{ `${t(`fieldsOfStudies.${user?.fieldOfStudy || ''}`)}, ${user?.faculty || ''}` }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row class="justify-center">
            <v-chip-group justiy-center>
              <v-chip v-for="element in user?.hobbies || []" :key="element" size="large" draggable>
                {{ t(`user.hobbies.${element}`) }}
              </v-chip>
            </v-chip-group>
          </v-row>
          <v-row class="justify-center">
            <div v-for="(photo, index) in user?.photos.slice(1) || []" :key="index" :value="photo">
              <v-col>
                <v-img
                  class="mx-auto my-5 elevation-5" rounded="xl" :width="150" :height="150" cover
                  :src="photo"
                />
              </v-col>
            </div>
          </v-row>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

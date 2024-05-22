<script lang="ts" setup>
import type { UserModel } from '~/models/user'

const props = defineProps<{
  user: UserModel
}>()

const emit = defineEmits(['dislike'])

async function dislike() {
  emit('dislike')
}

const { user } = toRefs(props)
const { t } = useI18n()

const showDetails = ref<boolean>(false)

function countAge(dateBirth: Date) {
  const today = new Date()

  try {
    let age = today.getFullYear() - dateBirth.getFullYear()
    const m = today.getMonth() - dateBirth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dateBirth.getDate()))
      age--

    return age.toString()
  }
  catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <v-card
    class="mx-auto"
  >
    <v-img
      class="align-end"
      height="400"
      weight="400"
      src="/testPerson3.jpg"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      cover
    >
      <v-card-title class="text-white">
        <div style="font-weight: bold;" class="text-h4">
          {{ `${user?.firstName} ${user?.lastName}, ${countAge(user?.dateBirth)}` }}
        </div>
        <div style="font-family:sans-serif; font-style:italic;">
          {{ t(`user.sex.${user?.gender}`) }}
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
            @click="dislike()"
          />
        </v-col>
      </v-row>
    </v-img>

    <v-card-text class="pt-4 text-h4 text-center" style="font-style: italic;">
      {{ user?.description }}
    </v-card-text>
    <v-card-text class="pt-4 text-h6 text-center">
      <v-row justify="center" cols="12">
        <v-col md="4" sm="6">
          <v-icon left>
            mdi-account-search
          </v-icon>
          <div style="margin-left: 10px;">
            {{ t(`user.sex.${user?.preferredGender}`) }}
          </div>
        </v-col>
        <v-col md="4" sm="12">
          <v-icon left>
            mdi-magnify
          </v-icon>
          <div style="margin-left: 10px;">
            {{ t(`user.prefferedRelationship.${user?.lookingFor}`) }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn append-icon="mdi-chevron-double-down" color="primary" block @click="showDetails = !showDetails" />
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showDetails">
        <v-divider />

        <v-card-text>
          <v-row justify="center" class="justify-center">
            <v-icon left>
              mdi-book-open-page-variant
            </v-icon>
            <div style="margin-left: 10px;">
              {{ `${t(`fieldsOfStudies.${user?.fieldOfStudy}`)}, ${user?.faculty}` }}
            </div>
          </v-row>

          <v-row class="justify-center">
            <v-chip-group v-if="user?.hobbies" justiy-center>
              <v-chip v-for="element in user?.hobbies" :key="element" size="large" draggable>
                {{ t(`user.hobbies.${element}`) }}
              </v-chip>
            </v-chip-group>
          </v-row>
          <v-row class="justify-center">
            reszta zdjęć
          </v-row>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

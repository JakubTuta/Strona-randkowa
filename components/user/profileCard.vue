<script lang="ts" setup>
import type { UserModel } from '~/models/user'

const props = defineProps<{
  user: UserModel | undefined
}>()

const { user } = toRefs(props)
const { t } = useI18n()

const nameString = ref<string>()
const showDetails = ref<boolean>(false)

function setUpData() {
  if (user.value !== undefined)
    nameString.value = `${user.value?.firstName} ${user.value?.lastName}, ${countAge(user.value?.dateBirth)}`
}

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

onMounted(() => setUpData())
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
      <v-card-title class="text-white" style="font-weight: bold;">
        {{ nameString }}
      </v-card-title>
      <v-row>
        <v-col>
          <v-btn
            append-icon="mdi-chevron-left"
            color="red-lighten-2"
            :text="t('matchingView.discard')"
            variant="outlined"
            block
          />
        </v-col>

        <v-col>
          <v-btn
            append-icon="mdi-chevron-right"
            color="red-lighten-2"
            :text="t('matchingView.accept')"
            variant="outlined"
            block
          />
        </v-col>
      </v-row>
    </v-img>

    <v-card-subtitle class="pt-4">
      {{ user?.description }}
    </v-card-subtitle>

    <v-card-text>
      <v-row justify="center">
        <v-icon left>
          mdi-account
        </v-icon>
        <div style="margin-left: 10px;">
          {{ t(`user.prefferedRelationship.${user?.lookingFor}`) }}
        </div>
      </v-row>

      <v-row justify="center">
        <v-icon left>
          mdi-book-open-page-variant
        </v-icon>
        <div style="margin-left: 10px;">
          {{ t(`fieldsOfStudies.${user?.fieldOfStudy}`) }}
        </div>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-btn append-icon="mdi-chevron-double-down" color="primary" block />
    </v-card-actions>
  </v-card>
</template>

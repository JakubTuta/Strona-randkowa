<script setup lang="ts">
import type { Ref } from 'vue'
import EditEventForm from '~/components/user/events/editEventForm.vue'
import type { EventModel } from '~/models/event'

definePageMeta({
  layout: 'user',
  middleware: ['auth'],
})

const { t } = useI18n()

const eventStore = useEventsStore()
const { userEvents } = storeToRefs(eventStore)

const userStore = useAppStore()
const { userData } = storeToRefs(userStore)

const showForm = ref(false)
const showedEvent: Ref<EventModel | null> = ref(null)

function showEditForm(event: EventModel) {
  showForm.value = true
  showedEvent.value = event
}

function closeForm() {
  showedEvent.value = null
  showForm.value = false
}

onMounted(async () => {
  if (userData.value && userData.value.reference && !userEvents.value.length) {
    await eventStore.getUserEvents(userData.value.reference)
    console.log(userEvents.value)
  }
})

watch(userData, async () => {
  if (userData.value && userData.value.reference && !userEvents.value.length) {
    await eventStore.getUserEvents(userData.value.reference)
    console.log(userEvents.value)
  }
})

function convertDate(date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}
</script>

<template>
  <v-container fluid class="px-8">
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8">
        <h1>
          {{ t('events.index.myEvents') }}
        </h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8" justify="center" class="text-center">
        <v-carousel v-if="userEvents.length" class="rounded-xl" cycle :interval="5000">
          <template v-for="(item, index) in userEvents" :key="index" :item="item">
            <v-carousel-item
              :src="item.photo"
              cover
              class="text-center"
            >
              <v-row justify="center">
                <v-col>
                  <div class="d-flex justify-center align-center py-2 text-h4 bg-grey-darken-4">
                    {{ item.name }}
                  </div>
                  <div class="d-flex justify-center align-center text-h4 py-2 bg-grey-darken-4">
                    {{ convertDate(item.startDate) }}
                  </div>

                  <div class="d-flex fill-height justify-center align-center">
                    <v-btn variant="elevated" size="large" color="secondary" @click="showEditForm(item)">
                      {{ t('events.index.editEvent') }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-carousel-item>
          </template>
        </v-carousel>
        <h1 v-else>
          {{ t('events.index.noEvents') }}
        </h1>
      </v-col>
    </v-row>
  </v-container>

  <EditEventForm :event="showedEvent" :is-show="showForm" @on-close="closeForm" />
</template>

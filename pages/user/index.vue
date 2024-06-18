<script lang="ts" setup>
import type { EventModel } from '~/models/event'
import { useEventsStore } from '~/stores/eventsStore'
import ShowEventDialog from '~/components/user/events/showEventDialog.vue'
import likedCard from '~/components/user/likedCard.vue'

definePageMeta({
  layout: 'user',
  middleware: ['auth'],
})

const { t } = useI18n()
const eventStore = useEventsStore()
const { events } = storeToRefs(eventStore)

const appStore = useAppStore()
const { userData, userMatches } = storeToRefs(appStore)

const showForm = ref(false)
const showedEvent: Ref<EventModel | null> = ref(null)

function showEventForm(event: EventModel) {
  showForm.value = true
  showedEvent.value = event
}

function closeForm() {
  showedEvent.value = null
  showForm.value = false
}

async function setUserMatches() {
  if (!userData.value?.matches.length)
    await appStore.fetchLikedProfiles(userData.value?.matches || [])
}

watch(userData, (newValue) => {
  if (newValue)
    setUserMatches()
}, { immediate: true })

onMounted(async () => {
  await eventStore.getFutureEvents()
  await appStore.fetchLikedProfiles(userData.value?.matches || [])
})
</script>

<template>
  <v-container fluid class="px-8">
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8">
        <h1>
          {{ t('events.index.upcomingEvents') }}
        </h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-carousel v-if="events.length" class="rounded-xl" cycle :interval="5000">
          <template v-for="(item, index) in events" :key="index" :item="item">
            <v-carousel-item
              :src="item.photo "
              cover
              class="text-center"
            >
              <v-row justify="center">
                <v-col>
                  <div class="d-flex fill-height justify-center align-center text-h4 py-2 bg-grey-darken-4">
                    {{ item.name }}
                  </div>

                  <div class="d-flex fill-height justify-center align-center">
                    <v-btn variant="elevated" size="large" color="secondary" @click="showEventForm(item)">
                      {{ t('events.index.showEvent') }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-carousel-item>
          </template>
        </v-carousel>
      </v-col>
    </v-row>

    <div v-if="userMatches.length">
      <v-row justify="center" class="mt-12">
        <v-col cols="12" md="8">
          <h1>
            {{ t('universal.quickChat') }}
          </h1>
        </v-col>
      </v-row>
      <v-row cols="12" class="d-flex justify-center align-center">
        <v-col cols="12" md="8" class="mt-4 d-flex justify-space-around flex-wrap ">
          <liked-card v-for="(user, index) in userMatches.slice(-3)" :key="index" :user="user" />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row justify="center" class="mt-12">
        <v-col cols="12" md="8">
          <h1>
            {{ t('universal.meetNewPeople') }}
          </h1>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="8" class="mt-4 d-flex justify-space-around flex-wrap ">
          <UserCard img="/testPerson1.jpg" name="Madzia" :age="22" field-of-study="architecture" />

          <UserCard img="/testPerson2.jpg" name="Ewa" :age="21" field-of-study="computerScience" />

          <UserCard img="/testPerson3.jpg" name="Natalia" :age="24" field-of-study="logistics" />
        </v-col>
      </v-row>
    </div>
  </v-container>

  <ShowEventDialog :event="showedEvent" :is-show="showForm" @on-close="closeForm" />
</template>

<style scoped>
.grow {
  transition: all .2s ease-in-out;
}
.grow:hover {
  transform: scale(1.05);
  }
</style>

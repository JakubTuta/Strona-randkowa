<script setup lang="ts">
import {useEventsStore} from "~/stores/eventsStore";
import type {EventModel} from "~/models/event";
import type {Ref} from "vue";
import ShowEventDialog from "~/components/user/events/showEventDialog.vue";

const { t } = useI18n()
const eventStore = useEventsStore()
const { events } = storeToRefs(eventStore)

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

onMounted(async () => {
  await eventStore.getFutureEvents()
})
</script>

<template>
  <v-container fluid class="px-8 mt-10">
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8">
        <h1>
          {{ t('events.index.upcomingEvents') }}
        </h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8" justify="center" class="text-center">
        <v-carousel v-if="events.length" class="rounded-xl" cycle :interval="5000">
          <template v-for="(item, index) in events" :key="index" :item="item">
            <v-carousel-item
                src="/testEvent.jpg"
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
        <h1 v-else>
          {{ t('events.index.noEvents') }}
        </h1>
      </v-col>
    </v-row>
  </v-container>

  <ShowEventDialog :event="showedEvent" :is-show="showForm" @on-close="closeForm" />

</template>

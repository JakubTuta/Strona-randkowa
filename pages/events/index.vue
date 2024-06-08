<script setup lang="ts">
import {useEventsStore} from "~/stores/eventsStore";

const { t } = useI18n()
const eventStore = useEventsStore()
const { events } = storeToRefs(eventStore)

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
      <v-col cols="12" md="8">
        <v-carousel class="rounded-xl" cycle :interval="5000">
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

<!--                  <div class="d-flex fill-height justify-center align-center">-->
<!--                    <v-btn variant="elevated" size="large" color="secondary" @click="showEditForm(item)">-->
<!--                      {{ t('events.index.editEvent') }}-->
<!--                    </v-btn>-->
<!--                  </div>-->
                </v-col>
              </v-row>
            </v-carousel-item>
          </template>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup lang="ts">
definePageMeta({
  layout: 'user',
})

const eventStore = useEventsStore()
const {userEvents} = storeToRefs(eventStore)

const userStore = useAppStore()
const { userData } = storeToRefs(userStore)

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
</script>

<template>
  <v-container fluid class="px-8">
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8">
        <h1>
          Moje wydarzenia
        </h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8">

        <v-carousel class="rounded-xl" cycle :interval="5000">
          <template v-for="(item, index) in userEvents" :item="item" :key="index">
            <v-carousel-item
                src="/testEvent.jpg"
                cover
            >
              {{item.name}}
              <v-btn variant="elevated" size="large" color="secondary">
                Dołącz teraz!
              </v-btn>
            </v-carousel-item>
          </template>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

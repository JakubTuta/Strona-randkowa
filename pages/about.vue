<script setup lang="ts">
  const { t } = useI18n()
</script>

<template>
  <v-img
      src="/aboutOne.jpg"
      cover
      gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
      class="mt-15 text-center"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-4">
      <span class="text-h3 font-weight-bold text-white">
        {{ t('about.seeWhatGoingOn') }}
      </span>

      <p class="mt-2 text-white">
        {{ t('about.shortDescription') }}
      </p>

    </div>
  </v-img>

  <v-card
      class="mx-10 mt-10 px-4"
      elevation="0"
      min-height="400"
      rounded="xl"
      color="transparent"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2 mt-15 text-center">
      <div class="text-h4 mb-5 font-weight-bold">
        {{ t('about.relationships') }}
      </div>

      <p class="mt-3">
        {{ t('about.relationshipsDescription') }}
      </p>

    </div>
  </v-card>

  <v-img
      src="/chat.jpg"
      cover
      gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
      class="text-center"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-4">
      <span class="text-h4 font-weight-bold text-white">
        {{ t('about.chats') }}
      </span>

      <p class="mt-2 text-white">
        {{ t('about.chatsDescription') }}
      </p>

    </div>
  </v-img>

  <v-card
      class="mx-10 mt-10 px-4"
      elevation="0"
      min-height="400"
      rounded="xl"
      color="transparent"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2 my-15 text-center">
      <div class="text-h4 mb-5 font-weight-bold">
        {{ t('about.events') }}
      </div>

      <p class="my-3">
        {{ t('about.eventsDescription') }}
      </p>


      <v-btn class="mt-4" to="/events" variant="elevated" color="primary">
        {{ t('about.goToEvents') }}
      </v-btn>
    </div>
  </v-card>

  <v-img
      src="/aboutTwo.jpg"
      cover
      gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
      class="text-center"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2">
      <span class="text-h4 font-weight-bold text-white">
        {{ t('about.whatsNext') }}
      </span>

      <v-btn class="mt-4" to="/auth/register" variant="elevated" color="primary">
        {{ t('about.whatsNextDescription') }}
      </v-btn>

    </div>
  </v-img>

</template>

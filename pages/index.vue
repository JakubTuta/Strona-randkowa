<script setup lang="ts">
  const { t } = useI18n()
</script>

<template>
  <v-img
    src="/landingThree.jpg"
    cover
    gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
    class="mt-15 text-center"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-4">
      <span class="text-h3 font-weight-bold text-white">
        {{ t('landing.start') }}
      </span>

      <p class="mt-2 text-white">
        {{ t('landing.slogan') }}
      </p>

      <v-btn class="my-4" to="auth/login" variant="elevated" color="secondary">
        {{ t('landing.startNow') }}
      </v-btn>

    </div>
  </v-img>

  <v-card
    class="mx-10 my-10 px-4"
    elevation="0"
    min-height="400"
    rounded="xl"
    color="transparent"
  >
    <v-row justify="center" class="my-5">
      <v-col cols="12" sm="12" md="6">
        <v-img
          class="mx-auto my-5 elevation-5"
          rounded="xl"
          :width="466"
          aspect-ratio="16/9"
          cover
          src="/landingOmg.jpg"
        />
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <div class="d-flex flex-column align-center justify-center text-center h-100 mx-2">
          <div class="text-h4 font-weight-bold">
            {{ t('landing.howItWorks') }}
          </div>

          <p class="mt-3">
            {{ t('landing.howItWorksTutorial') }}
          </p>

          <v-btn class="my-4" to="/about" variant="elevated" color="secondary">
            {{ t('landing.goSee') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>

  <v-img
      src="/landingEvents.jpg"
      cover
      gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
      class="text-center"
  >
    <div class="d-flex flex-column align-center justify-center h-100 mx-2">
      <span class="text-h4 font-weight-bold text-white">
        {{ t('landing.eventsAndRelationships') }}
      </span>

      <p class="mt-2 text-white">
        {{ t('landing.eventsContent') }}
      </p>

      <v-btn class="mt-4" to="/events" variant="elevated" color="secondary">
        {{ t('landing.eventsButton') }}
      </v-btn>

    </div>
  </v-img>

</template>

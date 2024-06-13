<script lang="ts" setup>
const props = defineProps<{
  currentUser: UserModel | null
}>()

const { currentUser } = toRefs(props)
</script>

<template>
  <v-row class="mt-4" style="height: 8%;">
    <v-col cols="4" class="text-h5">
      <v-avatar
        class="ma-3"
        rounded="xl"
        size="40"
      >
        <v-img :src="currentUser?.photos[0]" />
      </v-avatar>
      {{ currentUser?.firstName }} {{ currentUser?.lastName }}
    </v-col>

    <v-spacer />

    <v-col cols="1">
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props" color="" />
        </template>

        <v-list class="justify-center">
          <v-list-item prepend-icon="mdi-account" :title="$t('chatView.viewProfile')" />
          <v-list-item prepend-icon="mdi-star" :title="$t('chatView.rate')" />
          <v-list-item prepend-icon="mdi-delete-outline" :title="$t('chatView.remove')" />
          <v-list-item prepend-icon="mdi-lock" :title="$t('chatView.block')" />
        </v-list>
      </v-menu>
    </v-col>
  </v-row>

  <v-divider class="my-3" />
  <div style="height: 72%" class="mt-6 px-8 text-justify">
    <v-row>
      <v-spacer />
      <v-col cols="6">
        <v-card class="bg-secondary pa-4">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo impedit eos doloribus nostrum? Ratione error magni laudantium repudiandae nisi facere distinctio possimus sunt voluptatibus. Deserunt libero perspiciatis unde delectus dolores? 😁
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-avatar
        class="ma-3"
        rounded="xl"
        size="40"
      >
        <v-img :src="currentUser?.photos[0]" />
      </v-avatar>
      <v-col cols="5">
        <v-card class="bg-primary pa-4">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer />
      <v-col cols="6">
        <v-card class="bg-secondary pa-4">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo impedit eos doloribus nostrum?
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style>

</style>

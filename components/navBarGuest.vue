<script setup lang="ts">
// import ShowSettings from "~/components/showSettings.vue";

const { t } = useI18n()

// const showForm = ref(false)
// function showEditForm() {
//   showForm.value = true
// }

// function closeForm() {
//   showForm.value = false
// }
</script>

<template>
  <v-app-bar
    class="px-2 position-fixed"
    color="rgba(0, 0, 0, 0.76)"
    elevation="0"
  >
    <v-btn variant="text" color="white" to="/">
      {{ t("appName") }}
    </v-btn>

    <v-spacer />

    <div class="hidden-sm-and-down">
      <v-btn variant="elevated" class="mx-2" color="primary" to="/about">
        {{ t("navBar.about") }}
      </v-btn>

      <v-btn variant="elevated" class="mx-2" color="primary" to="/events">
        {{ t("navBar.events") }}
      </v-btn>
    </div>

    <v-spacer />

    <div class="hidden-sm-and-down">
      <v-btn variant="elevated" class="mx-2" color="primary" to="/auth/login">
        {{ t("navBar.login") }}
      </v-btn>

      <!-- <v-btn variant="text" color="white" icon="mdi-cog" @click="showEditForm"/> -->
    </div>

    <div class="hidden-md-and-up">
      <v-btn class="rounded-xl mr-2" color="default" icon>
        <v-icon icon="mdi-menu" />
        <v-menu activator="parent">
          <v-list class="justify-center">
            <v-list-item to="/auth/login">
              <v-list-item-title> {{ t("navBar.login") }} </v-list-item-title>
            </v-list-item>

            <v-list-item to="/events">
              <v-list-item-title> {{ t("navBar.events") }} </v-list-item-title>
            </v-list-item>

            <v-list-item to="/about">
              <v-list-item-title> {{ t("navBar.about") }} </v-list-item-title>
            </v-list-item>

            <!-- <v-list-item @click="showEditForm">
              <v-list-item-title> {{ t('navBar.settings') }}</v-list-item-title>
            </v-list-item> -->
          </v-list>
        </v-menu>
      </v-btn>
    </div>
  </v-app-bar>

  <!-- <ShowSettings :is-show="showForm" @on-close="closeForm" /> -->
</template>

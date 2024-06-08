<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { toggleTheme } from '~/helpers/theme'

const theme = useTheme()
const router = useRouter()
const appStore = useAppStore()
const { userData, allUsers } = storeToRefs(appStore)
const { t } = useI18n()

const search = ref<string>()
const showSearch = ref<boolean>(false)
const drawer = defineModel({ default: false })

const eventMenuIcon = ref('mdi-menu-down')

function changeIcon() {
  eventMenuIcon.value = eventMenuIcon.value === 'mdi-menu-down' ? 'mdi-menu-up' : 'mdi-menu-down'
}

async function logOut() {
  await appStore.signOut()
  router.push('/')
}
</script>

<template>
  <v-app-bar prominent class="px-2 position-sticky" color="primary">
    <v-btn variant="text" color="default" to="/user">
      {{ t("appName") }}
    </v-btn>

    <v-text-field v-model="search" :label="t('navBar.findTextField')" single-line hide-details />
    <!-- <v-btn v-if="!showSearch" variant="text" color="default" prepend-icon="mdi-magnify" @click="showSearch = !showSearch">
      {{ t('navBar.search') }}
    </v-btn>
    <v-btn v-else density="compact" color="default" @click="showSearch = !showSearch">
      X
    </v-btn> -->
    <!-- <v-spacer /> -->

    <div class="hidden-sm-and-down" style="display: flex; justify-content: flex-end;">
      <v-btn variant="text" color="default" prepend-icon="mdi-calendar-multiple" :append-icon="eventMenuIcon">
        {{ t('navBar.user.events.events') }}
        <v-menu activator="parent" @update:model-value="changeIcon">
          <v-list class="justify-center">
            <v-list-item to="/user/events/add" prepend-icon="mdi-plus" :title="t('navBar.user.events.add')" />

            <v-list-item to="/user/events" prepend-icon="mdi-party-popper" :title="t('navBar.user.events.browse')" />
          </v-list>
        </v-menu>
      </v-btn>

      <v-btn to="/user/meet" variant="text" color="default" prepend-icon="mdi-heart">
        {{ t('navBar.user.meet') }}
      </v-btn>

      <v-btn variant="text" color="default" prepend-icon="mdi-chat">
        {{ t('navBar.user.chat') }}
      </v-btn>
    </div>

    <v-spacer />

    <div class="hidden-xs">
      <v-btn v-if="userData" class="mr-2" color="default" prepend-icon="mdi-account">
        {{ `${userData.firstName} ${userData.lastName}` }}
        <v-menu activator="parent">
          <v-list class="justify-center">
            <v-list-item to="/user/profile" prepend-icon="mdi-face-man-profile" :title="$t('navBar.user.myProfile')" />
            <v-list-item prepend-icon="mdi-theme-light-dark" title="Zmień motyw" @click="toggleTheme(theme)" />
            <v-list-item prepend-icon="mdi-logout" :title="$t('navBar.logout')" @click="logOut" />
          </v-list>
        </v-menu>
      </v-btn>
    </div>

    <div class="hidden-md-and-up">
      <v-btn class="rounded-xl mr-2" color="default" icon @click.stop="drawer = !drawer">
        <v-icon icon="mdi-menu" />
      </v-btn>
    </div>
  </v-app-bar>
</template>

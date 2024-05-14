<script setup lang="ts">
const restStore = useRestStore()
const { users } = storeToRefs(restStore)

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

function request() {
  restStore.getTopUsers(userData.value, 2)
}

function print() {
  console.log(users.value)
}
</script>

<template>
  <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  <v-btn @click="request">
    send request to python
  </v-btn>

  <br>

  <v-btn @click="print">
    print users
  </v-btn>
</template>

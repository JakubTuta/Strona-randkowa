<script setup lang="ts">
function request() {
  const url = 'http://localhost:2137/matches-api'

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reference_id: 'pierwszy' }),
  })
    .then((response) => {
      return response.json()
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))
}
</script>

<template>
  <v-btn @click="request">
    send request to python
  </v-btn>
</template>

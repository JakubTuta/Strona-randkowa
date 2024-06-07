<script lang="ts" setup>
import type { UserModel } from '~/models/user'

const props = defineProps<{
  user: UserModel
}>()

const { user } = toRefs(props)
const age = ref<string>()

function countAge(dateBirth: Date) {
  const today = new Date()

  try {
    let age = today.getFullYear() - dateBirth.getFullYear()
    const m = today.getMonth() - dateBirth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dateBirth.getDate()))
      age--

    return age.toString()
  }
  catch (e) {
    // console.log(e)
  }
}
onMounted(() => {
  age.value = countAge(user?.value.dateBirth)
})
</script>

<template>
  <v-card color="primary" height="250" width="250" class="rounded-xl  cursor-pointer grow ma-3">
    <v-img :src="user.photos[0]" class="white--text align-end" cover :aspect-ratio="1" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
      <v-card-title class="width-100 d-flex justify-space-between">
        <span>{{ user?.firstName }} {{ user?.lastName }}, {{ age }}</span>
      </v-card-title>

      <v-card-subtitle class="mt-n2 mb-2 font-weight-bold">
        <span> {{ `${$t(`fieldsOfStudies.${user?.fieldOfStudy}`)}` }}</span>
      </v-card-subtitle>
    </v-img>
  </v-card>
</template>

<style scoped>
.grow {
  transition: all .2s ease-in-out;
}

.grow:hover {
  transform: scale(1.1);
}
</style>

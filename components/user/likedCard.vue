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
    console.log(e)
  }
}
onMounted(() => {
//   age.value = countAge(user?.value.dateBirth)
})
</script>

<template>
  <v-card color="primary" max-height="300" max-width="310" class="rounded-xl pt-2 cursor-pointer grow ma-3">
    <v-card-title class="width-100 d-flex justify-space-between">
      <span>{{ user?.firstName }},</span>
      <span>{{ age }}</span>
    </v-card-title>

    <v-card-subtitle class="mt-n2 mb-2 font-weight-bold">
      <span> {{ user?.fieldOfStudy }}</span>
    </v-card-subtitle>

    <v-img src="/testPerson2.jpg" />
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

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import { useTheme } from 'vuetify'
import type { Timestamp } from 'firebase/firestore'
import { EventModel } from '~/models/event'
import { lengthRuleShort, requiredRule } from '~/helpers/rules'
import formValidation from '~/helpers/formValidation'
import '@vuepic/vue-datepicker/dist/main.css'
import { useEventsStore } from '~/stores/eventsStore'

const props = defineProps<{
  event: EventModel | null
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const { isShow, event } = toRefs(props)

const { form, valid, isValid } = formValidation()
const { t } = useI18n()
const { current } = useTheme()
const eventStore = useEventsStore()
const appStore = useAppStore()
const { userData } = storeToRefs(appStore)
const sharedStore = useSharedStore()

const isDark = computed(() => {
  return current.value.dark
})

const name = ref('')
const durationTime: Ref<(Date | Timestamp)[] | null> = ref(null)
const image = ref(event.value?.photo)

function close() {
  emit('onClose')
}

async function editEvent() {
  if (await isValid() && userData.value && userData.value.reference && durationTime.value && event.value?.reference) {
    if (image.value === undefined)
      image.value = event.value.photo
    console.log(image.value)
    await eventStore.editEvent(new EventModel({
      name: name.value,
      comments: [],
      createdBy: userData.value.reference,
      photo: image.value,
      startDate: durationTime.value[0],
      endDate: durationTime.value[1],
    }, event.value?.reference))
    close()
  }
  else {
    sharedStore.failureSnackbar({ code: String(t('events.add.error')) })
  }
}

watch(event, () => {
  if (event.value) {
    name.value = event.value.name
    durationTime.value = [event.value.startDate, event.value.endDate]
  }
})

function editPhoto(url: string) {
  image.value = url
}
</script>

<template>
  <v-dialog
    max-width="900px"
    :model-value="isShow"
    @update:model-value="close"
  >
    <v-card>
      <v-card-title>
        {{ event?.name }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="editEvent">
          <v-text-field
            v-model="name"
            :label="t('events.add.eventName')"
            :rules="[requiredRule(), lengthRuleShort()]"
            class="py-3"
          />

          <VueDatePicker
            v-model="durationTime"
            class="mb-6"
            :dark="isDark"
            auto-apply
            :range="{ partialRange: false, minRange: 0 }"
            :placeholder="t('events.add.durationTime')"
            :min-date="new Date()"
            :enable-time-picker="true"
            position="left"
            :teleport-center="true"
            required
          />

          <v-img :src="event?.photo" cover max-height="400" />

          <UploadImage class="my-2" @set-image="editPhoto" />
        </v-form>
      </v-card-text>

      <v-card-actions class="d-print-none">
        <v-spacer />

        <v-btn
          class="mr-1"
          variant="text"
          @click="close"
        >
          {{ t('universal.form.close') }}
        </v-btn>

        <v-btn
          class="mr-1"
          variant="text"
          @click="editEvent"
        >
          {{ t('universal.form.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

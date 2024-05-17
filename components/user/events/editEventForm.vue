<script setup lang="ts">
import {EventModel} from "~/models/event";
import {lengthRuleShort, requiredRule} from "~/helpers/rules";
import VueDatePicker from "@vuepic/vue-datepicker";
import formValidation from "~/helpers/formValidation";
import {useTheme} from "vuetify";
import type {Timestamp} from "firebase/firestore";
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps<{
  event: EventModel | null
  isShow: boolean
}>()

const { isShow, event } = toRefs(props)

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const { form, valid, isValid } = formValidation()
const {t} = useI18n()
const { current } = useTheme()

const isDark = computed(() => {
  return current.value.dark
})

const name = ref('')
const durationTime: Ref<(Date | Timestamp)[] | null> = ref(null)

function close() {
  emit('onClose')
}

async function editEvent() {
  if (await isValid()) {

  }
}

watch(event, () => {
  if (event.value) {
    name.value = event.value.name
    durationTime.value = [event.value.startDate, event.value.endDate]
  }
})
</script>

<template>
  <v-dialog
      max-width="900px"
      :model-value="isShow"
      @update:model-value="close"
  >
    <v-card>
      <v-card-title>
        {{event?.name}}
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

        </v-form>
      </v-card-text>

      <v-card-actions class="d-print-none">
        <v-spacer />

        <v-btn
            class="mr-1"
            variant="text"
            @click="close"
        >
          {{ $t('universal.form.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

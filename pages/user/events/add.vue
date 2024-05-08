<script setup lang="ts">
import {useEventsStore} from "~/stores/eventsStore";
import {EventModel} from "~/models/event";
import VueDatePicker from "@vuepic/vue-datepicker";
import formValidation from "~/helpers/formValidation";
import {useTheme} from "vuetify";

const { t } = useI18n()

definePageMeta({
  layout: 'user',
})

const eventStore = useEventsStore()
const appStore = useAppStore()
const { userData } = storeToRefs(appStore)
const { current } = useTheme()
const { form, valid, isValid } = formValidation()

const name = ref('')
const startDate = ref(null)
const endDate = ref(null)

const isDark = computed(() => {
  return current.value.dark
})
function addEvent() {
  // eventStore.addEvent(new EventModel( {name: name.value, comments: [], createdBy: userData.value?.reference, photo: '', startDate: new Date(), endDate: new Date() }, null))
}
</script>

<template>
  <v-container fluid>
    <v-sheet
        class="d-flex align-center justify-center flex-wrap text-center mx-auto my-10 px-4"
        elevation="4"
        max-width="1100"
        rounded
    >
      <v-row justify="center">
        <v-col cols="12" sm="12" md="10">
          <div class="d-flex flex-column align-center justify-center h-100 mx-2 py-4">
            <div class="text-h4 my-2">
              Dodaj wydarzenie
            </div>

            <v-col cols="12" md="10" lg="8">
              <v-form>
                <v-text-field
                    v-model="name"
                    :label="t('events.add.eventName')"
                />

<!--                <VueDatePicker-->
<!--                    v-model="startDate"-->
<!--                    class="mb-6"-->
<!--                    :dark="isDark"-->
<!--                    auto-apply-->
<!--                    :placeholder="t('events.add.startDate')"-->
<!--                    :enable-time-picker="false"-->
<!--                    position="left"-->
<!--                />-->

<!--                <VueDatePicker-->
<!--                    v-model="endDate"-->
<!--                    class="mb-6"-->
<!--                    :dark="isDark"-->
<!--                    auto-apply-->
<!--                    :placeholder="t('events.add.endDate')"-->
<!--                    :enable-time-picker="false"-->
<!--                    position="left"-->
<!--                />-->

              </v-form>
            </v-col>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<style scoped>
:root {
  /* Vue datepicker styling */
  --dp-font-family: Roboto, sans-serif;
  --dp-input-padding: 11px 30px 11px 12px; /*Padding in the input*/
  --dp-cell-size: 28px;   /*Width and height of calendar cell*/

}

.dp__theme_dark {
  --dp-background-color: rgba(0, 0, 0, 0.6);
  --dp-primary-color: #87CACA;
  --dp-border-color: rgb(133, 133, 133);
  --dp-disabled-color-text: #fff;
}

.dp__theme_light {
  --dp-background-color: rgba(0, 0, 0, 0.6);
  --dp-primary-color: #76A8A8;
  --dp-border-color: rgb(133, 133, 133);
}

::placeholder {
  color: white;
  opacity: 1; /* Firefox */
}
</style>
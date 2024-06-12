<script setup lang="ts">
import { useTheme} from "vuetify";
import {toggleTheme} from "~/helpers/theme";

const props = defineProps<{
  isShow: boolean
}>()

const { isShow } = toRefs(props)

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  emit('onClose')
}

const { t, locale } = useI18n()

const themes = [
  {
    name: t('settings.light'),
    value: 'light'
  },
  {
    name: t('settings.dark'),
    value: 'dark'
  }
]

const languages = [
  {
    name: t('settings.polish'),
    value: 'pl',
  },
  {
    name: t('settings.english'),
    value: 'en',
  }
]

const theme = useTheme()


const currentTheme = ref(theme.name)

const setTheme = () => {
  toggleTheme(theme)
}

const currentLanguage = ref(locale)
const changeLocale = () => {
  locale.value = currentLanguage.value
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
        {{ t('navBar.settings') }}
      </v-card-title>
      <v-card-text>
        {{ t('settings.themes') }}
        <div>
          <v-radio-group
              class="my-1"
              v-model="currentTheme"
              inline
              @update:model-value="setTheme()"
          >
            <div v-for="item in themes">
              <v-radio
                  :label="item.name"
                  :value="item.value"
              ></v-radio>
            </div>


          </v-radio-group>
        </div>
        {{ t('settings.language') }}
        <div>
          <v-radio-group
              class="my-1"
              v-model="currentLanguage"
              inline
              @update:model-value="changeLocale()"
          >
            <div v-for="item in languages">
              <v-radio
                  :label="item.name"
                  :value="item.value"
              ></v-radio>
            </div>


          </v-radio-group>
        </div>


      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="close">
          {{ t('universal.form.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

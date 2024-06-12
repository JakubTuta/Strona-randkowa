<script setup lang="ts">
import { useTheme } from 'vuetify'
import { toggleTheme } from '~/helpers/theme'

const props = defineProps<{
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

const { isShow } = toRefs(props)

function close() {
  emit('onClose')
}

const { t, locale } = useI18n()

const themes = computed(() => (
  [
    {
      name: t('settings.light'),
      value: 'light',
    },
    {
      name: t('settings.dark'),
      value: 'dark',
    },
  ]
))

const languages = computed(() => (
  [
    {
      name: t('settings.polish'),
      value: 'pl',
    },
    {
      name: t('settings.english'),
      value: 'en',
    },
  ]
))

const theme = useTheme()

const currentTheme = ref(theme.name)

function setTheme() {
  toggleTheme(theme)
}

const currentLanguage = ref(locale)
function changeLocale() {
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
            v-model="currentTheme"
            class="my-1"
            inline
            @update:model-value="setTheme()"
          >
            <div v-for="item in themes">
              <v-radio
                :label="item.name"
                :value="item.value"
              />
            </div>
          </v-radio-group>
        </div>
        {{ t('settings.language') }}
        <div>
          <v-radio-group
            v-model="currentLanguage"
            class="my-1"
            inline
            @update:model-value="changeLocale()"
          >
            <div v-for="item in languages">
              <v-radio
                :label="item.name"
                :value="item.value"
              />
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

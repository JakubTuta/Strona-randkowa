<script setup lang="ts">
import { useTheme } from 'vuetify'
import type { Ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { setMyTheme } from '~/helpers/theme'
import { changeFont } from '~/helpers/fonts'

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

const { t } = useI18n()

const appStore = useAppStore()
const { userData } = storeToRefs(appStore)

const currentLanguage = ref('pl')

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
    {
      name: t('settings.highContrast'),
      value: 'highContrast',
    },
    {
      name: t('settings.blackAndWhite'),
      value: 'blackAndWhite',
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

const fontsSizes = computed(() => (
  [
    {
      name: t('settings.small'),
      value: '10px',
    },
    {
      name: t('settings.medium'),
      value: '16px',
    },
    {
      name: t('settings.big'),
      value: '26px',
    },
  ]
))

const theme = useTheme()

const currentThemeStore = useLocalStorage('current-theme', 'dark')
const currentTheme: Ref<string> = ref(currentThemeStore.value)

function setTheme() {
  setMyTheme(theme, currentTheme.value)
  currentThemeStore.value = currentTheme.value
}

function changeLocale() {
  appStore.setLanguage(currentLanguage.value)
}

const currentFont = useLocalStorage('current-font', '16px')
const fontSize = ref(currentFont.value)

function applyFontSize() {
  changeFont(fontSize.value)
  currentFont.value = fontSize.value
}

watch(userData, (newValue) => {
  if (newValue)
    currentLanguage.value = newValue.languageCode
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
            <div v-for="item in themes" :key="item.value">
              <v-radio
                class="px-2"
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
            <div v-for="item in languages" :key="item.value">
              <v-radio
                class="px-2"
                :label="item.name"
                :value="item.value"
              />
            </div>
          </v-radio-group>
        </div>

        {{ t('settings.fontSize') }}
        <div>
          <v-radio-group
            v-model="fontSize"
            class="my-1"
            inline
            @change="applyFontSize"
          >
            <div v-for="item in fontsSizes" :key="item.value">
              <v-radio
                class="px-2"
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

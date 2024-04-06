import type { FirebaseOptions } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, browserPopupRedirectResolver, getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
  } as FirebaseOptions

  const app = initializeApp(firebaseConfig, 'primary')

  const auth = getAuth(app)
  const firestore = getFirestore(app)
  const storage = getStorage(app)

  nuxtApp.vueApp.provide('auth', auth)
  nuxtApp.provide('auth', auth)

  nuxtApp.vueApp.provide('firestore', firestore)
  nuxtApp.provide('firestore', firestore)

  nuxtApp.vueApp.provide('storage', storage)
  nuxtApp.provide('storage', storage)
})

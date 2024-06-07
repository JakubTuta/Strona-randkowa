import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'

export function useFirebase() {
  const nuxtApp = useNuxtApp()

  const firebaseApp = nuxtApp.$app as FirebaseApp
  const firestore = nuxtApp.$firestore as Firestore
  const auth = nuxtApp.$auth as Auth
  const authSecondary = nuxtApp.$authSecondary as Auth
  const storage = nuxtApp.$storage as FirebaseStorage

  return {
    firebaseApp,
    firestore,
    auth,
    authSecondary,
    storage,
  }
}

import type {
  User,
  UserCredential,
} from 'firebase/auth'

import { deleteDoc, getDoc } from 'firebase/firestore'
import type { DocumentData, DocumentReference } from 'firebase/firestore'
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import { getUserQuery } from '~/authUser'
import type { IUser } from '~/models/user'
import { useFirebase } from '~/composables/useFirebase'

export const useAppStore = defineStore('app', () => {
  const user: Ref<User | null> = ref(null)
  // const error = ref(null)
  const { firestore, auth } = useFirebase()

  const registerWithPassword = async (email: string, password: string): Promise<DocumentReference | null> => {
    let createdUser

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      user.value = response.user
      await getUserQuery(response.user.uid, firestore).then(data => createdUser = data.ref)
    }
    catch (caughtError) {
      if (auth?.currentUser)
        await deleteUser(auth.currentUser)
    }

    return createdUser || null
  }
})

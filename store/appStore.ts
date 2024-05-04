import type {
  Auth,
  User,
  UserCredential,
} from 'firebase/auth'

import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import type { DocumentData, DocumentReference } from 'firebase/firestore'
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, signOut } from 'firebase/auth'
import { useSharedStore } from './sharedStore'
import { getUserQuery } from '~/utils/authUser'
import type { IUser, UserModel } from '~/models/user'
import { useFirebase } from '~/composables/useFirebase'

export const useAppStore = defineStore('app', () => {
  const { firestore, auth } = useFirebase()
  const usersCollection = collection(firestore, 'users')

  const sharedStore = useSharedStore()

  const user: Ref<User | null> = ref(null)

  const createUser = async (newUser: UserModel) => {
    const userReference = doc(usersCollection, newUser?.reference?.id)
    await setDoc(userReference, newUser.toMap())
  }

  const registerWithPassword = async (email: string, password: string): Promise<DocumentReference | null> => {
    sharedStore.init()

    let createdUser

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      user.value = response.user
      await getUserQuery(response.user.uid, firestore).then(data => createdUser = data.ref)

      // await sendEmailVerification(auth.currentUser as User)
      // await signOut(auth)

      sharedStore.success()
    }
    catch (caughtError) {
      sharedStore.failureSnackbar({ code: String(caughtError) })
    }

    return createdUser || null
  }
  return {
    user,
    registerWithPassword,
    createUser,
  }
})

import type {
  User,

} from 'firebase/auth'

import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { DocumentReference } from 'firebase/firestore'
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut as signoutFirebase } from 'firebase/auth'
import { useSharedStore } from './sharedStore'
import { type IUser, UserModel } from '~/models/user'

export const useAppStore = defineStore('app', () => {
  const { firestore, auth } = useFirebase()
  const { fetchDocumentById } = useDatabase()
  const { getAuthError } = useError()
  const { t } = useI18n()

  const usersCollection = collection(firestore, 'users')
  const router = useRouter()

  const sharedStore = useSharedStore()

  const user: Ref<User | null> = ref(null)
  const userData: Ref<UserModel | null> = ref(null)

  const signOut = async () => {
    sharedStore.init()

    await signoutFirebase(auth)
    user.value = null
    userData.value = null

    sharedStore.success()
  }

  const createUser = async (newUser: UserModel) => {
    const userReference = doc(usersCollection, newUser?.reference?.id)
    await setDoc(userReference, newUser.toMap())
  }

  const registerWithPassword = async (email: string, password: string): Promise<DocumentReference | null> => {
    sharedStore.init()

    let createdUserRef: DocumentReference | null = null

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      user.value = response.user

      await fetchDocumentById<IUser>(response.user.uid, Collections.USERS)
        .then(data => createdUserRef = data.ref)

      await sendEmailVerification(auth.currentUser as User)
      await signOut()

      sharedStore.success()

      return createdUserRef
    }
    catch (caughtError) {
      sharedStore.failureSnackbar({ code: String(t('universal.emailExists')),
      })
      return null
    }
  }

  const logInWithPassword = async (email: string, password: string) => {
    try {
      sharedStore.init()

      const response = await signInWithEmailAndPassword(auth, email, password)
      user.value = response.user

      const { data, ref } = await fetchDocumentById<IUser>(response.user.uid, Collections.USERS)

      if (!data) {
        router.push('/auth/register')
        sharedStore.success()
        return
      }

      userData.value = new UserModel(data, ref)
      router.push('/user')

      sharedStore.success()
    }
    catch (caughtError: any) {
      sharedStore.failureSnackbar({ code: getAuthError(caughtError.code) })
    }
  }

  const logIn = async (userArg: User) => {
    user.value = userArg
    sharedStore.init()
    try {
      const { data, ref } = await fetchDocumentById<IUser>(userArg.uid, Collections.USERS)

      if (!data) {
        router.push('/')
        sharedStore.success()
        return
      }

      userData.value = new UserModel(data, ref)

      sharedStore.success()
    }
    catch (error) {
      sharedStore.failureSnackbar({ code: String(error) })
      signOut()
    }
  }

  const currentUser = () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
        auth,
        async (userNew) => {
          if (userNew) {
            user.value = userNew
            await logIn(userNew)
          }

          resolve(user)
        },
        e => reject(e),
      )
    })
  }

  const editUser = (newUser: UserModel) => {
    const data = {
      description: newUser?.description,
    }

    if (newUser.reference)
      updateDoc(newUser.reference, data)
  }

  return {
    user,
    userData,
    registerWithPassword,
    logInWithPassword,
    signOut,
    createUser,
    currentUser,
    editUser,
  }
})

import type {
  User,

} from 'firebase/auth'

import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import type { DocumentReference } from 'firebase/firestore'
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut as signoutFirebase } from 'firebase/auth'
import { useSharedStore } from './sharedStore'
import { type IUser, UserModel, mapUser } from '~/models/user'

export const useAppStore = defineStore('app', () => {
  const { firestore, auth } = useFirebase()
  const { fetchDocumentById } = useDatabase()
  const { getAuthError } = useError()
  const { t, setLocale } = useI18n()

  const usersCollection = collection(firestore, 'users')
  const router = useRouter()

  const sharedStore = useSharedStore()
  const uploadImageStore = useUploadImageStore()

  const messageStore = useMessageStore()

  const user: Ref<User | null> = ref(null)
  const userData: Ref<UserModel | null> = ref(null)

  const allUsers: Ref<UserModel[]> = ref([])
  const userMatches: Ref<UserModel[]> = ref([])

  const signOut = async () => {
    sharedStore.init()

    await signoutFirebase(auth)
    user.value = null
    userData.value = null

    messageStore.reset()

    sharedStore.success()
  }

  const createUser = async (newUser: UserModel) => {
    const userReference = doc(usersCollection, newUser?.reference?.id)

    const imageUrl = (await uploadImageStore.createAndUploadImage(userReference, newUser.photos[0])).imageUrl

    newUser.photos[0] = imageUrl

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
      sharedStore.failureSnackbar({
        code: String(t('universal.emailExists')),
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
      firstName: newUser?.firstName,
      lastName: newUser?.lastName,
      description: newUser?.description,
      faculty: newUser?.faculty,
      fieldOfStudy: newUser?.fieldOfStudy,
      gender: newUser?.gender,
      lookingFor: newUser?.lookingFor,
      preferredGender: newUser?.preferredGender,
      hobbies: newUser?.hobbies,
    }

    if (newUser.reference)
      updateDoc(newUser.reference, data)
  }

  const addImage = async (user: UserModel, photoUrl: string) => {
    try {
      const userReference = doc(usersCollection, user?.reference?.id)

      const imageUrl = (await uploadImageStore.createAndUploadImage(userReference, photoUrl)).imageUrl

      const index = user.photos.length
      if (index < 4) { user.photos.push(imageUrl) }
      else {
        user.photos.unshift(imageUrl)
        user.photos.pop()
      }

      await setDoc(userReference, user.toMap())
    }
    catch (e) {
      // console.log(e)
    }
  }

  const removeImage = async (user: UserModel, photoUrl: string) => {
    try {
      const userReference = doc(usersCollection, user?.reference?.id)

      const index = user.photos.indexOf(photoUrl)

      if (index > -1) {
        user.photos.splice(index, 1)

        await setDoc(userReference, user.toMap())
        const photoPath = appStore.getPhotoPath(photoUrl)
        await uploadImageStore.deleteImage(userReference, photoPath)
      }
    }
    catch (e) {
      // console.log(e)
    }
  }

  const editMainPhoto = async (user: UserModel, targetImageUrl: string) => {
    try {
      const userReference = doc(usersCollection, user?.reference?.id)

      const index = user.photos.indexOf(targetImageUrl)
      if (index > -1) {
        user.photos.splice(index, 1)

        user.photos.unshift(targetImageUrl)

        await setDoc(userReference, user.toMap())
      }
    }
    catch (e) {
    // console.log(e)
    }
  }

  const getAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'))
      const users = querySnapshot.docs.map(mapUser)
      return users
    }
    catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  const fetchAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'users'))
      const users = querySnapshot.docs.map(doc => new UserModel(doc.data() as IUser, doc.ref))
      allUsers.value = users
      // return users
    }
    catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  const fetchLikedProfiles = async (likedUserRefs: DocumentReference[]) => {
    try {
      const likedUsers = []
      for (const ref of likedUserRefs) {
        const docSnapshot = await getDoc(ref)
        if (docSnapshot.exists()) {
          const user = new UserModel(docSnapshot.data() as IUser, docSnapshot.ref)
          likedUsers.push(user)
        }
      }
      userMatches.value = likedUsers
    }
    catch (error) {
      console.error('Error fetching liked users:', error)
    }
  }

  const getPhotoPath = (photoUrl: string) => {
    const url = new URL(photoUrl)

    let path = url.pathname

    if (path.startsWith('/'))
      path = path.substring(1)

    const prefix = 'v0/b/strona-randkowa.appspot.com/o/'
    if (path.startsWith(prefix))
      path = path.substring(prefix.length)

    return decodeURIComponent(path)
  }

  const setLanguage = (language: string) => {
    if (!userData.value?.reference || userData.value?.languageCode === language)
      return

    setLocale(language)
    localStorage.setItem('current-lang', language)

    userData.value.languageCode = language
    updateDoc(userData.value.reference, userData.value.toMap())
  }

  return {
    user,
    userData,
    allUsers,
    userMatches,
    registerWithPassword,
    logInWithPassword,
    signOut,
    createUser,
    currentUser,
    editUser,
    getAllUsers,
    fetchAllUsers,
    fetchLikedProfiles,
    addImage,
    removeImage,
    getPhotoPath,
    editMainPhoto,
    setLanguage,
  }
})

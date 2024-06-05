import type { DocumentReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from 'firebase/firestore'
import axios from 'axios'
import type { UserModel } from '~/models/user'
import { mapUser } from '~/models/user'
import type { LikeModel } from '~/models/like'

export const useRestStore = defineStore('rest', () => {
  const { firestore } = useFirebase()

  const users = ref<UserModel[]>([])

  const collectionUsers = collection(firestore, 'users')

  const baseURL = 'https://europe-central2-strona-randkowa.cloudfunctions.net'
  const HEADERS_FIREBASE = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Origin': '*',
  }

  function getAxiosFirebase(userReference: DocumentReference) {
    return axios.create({
      baseURL,
      headers: {
        ...HEADERS_FIREBASE,
        collection: 'users',
        uid: userReference.id,
      },
    })
  }

  const mapIdsToUsers = async (referenceIds: string[]) => {
    try {
      const documents = await getDocs(query(collectionUsers, where('__name__', 'in', referenceIds)))
      const mappedUsers = documents.docs.map(mapUser)

      return mappedUsers as UserModel[]
    }
    catch (error) {
      console.error(error)

      return []
    }
  }

  const getTopUsers = async (userData: UserModel | null, maxUsers: number = 1000) => {
    if (!userData || !userData.reference)
      return

    const requestData = {
      reference_id: userData.reference.id,
      max_users: maxUsers,
    }

    try {
      const data = await getAxiosFirebase(userData.reference)
        .post('/get_matches', requestData)

      users.value = await mapIdsToUsers(data.data)
    }
    catch (error) {
      console.error(error)
    }
  }

  const checkMatches = async (like: LikeModel) => {
    if (!like || !like.reference)
      return

    const requestData = {
      whoLiked: like.whoLiked.id,
      likedProfile: like.likedProfile.id,
    }

    try {
      const data = await getAxiosFirebase(like.reference)
        .post('/is_match', requestData)

      return data.data.is_match
    }
    catch (error) {
      console.error(error)
    }
  }

  return {
    users,
    getTopUsers,
    checkMatches,
  }
})

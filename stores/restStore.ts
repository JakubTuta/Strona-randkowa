import type { DocumentReference } from 'firebase/firestore'
import { collection, getDocs, query, where } from 'firebase/firestore'
import axios from 'axios'
import { httpsCallable } from 'firebase/functions'
import type { UserModel } from '~/models/user'
import { mapUser } from '~/models/user'

export const useRestStore = defineStore('rest', () => {
  const { firestore } = useFirebase()

  const users = ref<UserModel[]>([])

  const collectionUsers = collection(firestore, 'users')

  const mapIdsToUsers = async (referenceIds: string[]) => {
    try {
      const documents = await getDocs(query(collectionUsers, where('__name__', 'in', referenceIds)))
      const mappedUsers = documents.docs.map(mapUser)

      return mappedUsers
    }
    catch (error) {
      console.error(error)

      return []
    }
  }

  const getTopUsers = (userData: UserModel | null, maxUsers: number = 1000) => {
    if (!userData)
      return

    const matchesFunctionUrl = 'https://get-matches-2akj7aa2pq-lm.a.run.app'

    const HEADERS_FIREBASE = {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Content-Type': 'application/json',
    }

    fetch(matchesFunctionUrl, {
      method: 'POST',
      headers: HEADERS_FIREBASE,
      mode: 'cors',
      body: JSON.stringify({ reference_id: userData.reference?.id || '', max_users: maxUsers }),
    })
      .then((response) => {
        if (response.ok)
          return response.json()
      })
      .then(async data => users.value = await mapIdsToUsers(data))
      .catch(error => console.error(error))
  }

  return {
    users,
    getTopUsers,
  }
})

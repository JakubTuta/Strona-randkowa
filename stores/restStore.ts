import { collection, getDocs, query, where } from 'firebase/firestore'
import type { UserModel } from '~/models/user'
import { mapUser } from '~/models/user'

export const useRestStore = defineStore('rest', () => {
  const { firestore } = useFirebase()

  const users = ref<UserModel[]>([])

  const collectionUsers = collection(firestore, 'users')
  const serverUrl = 'http://localhost:2137'

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

    fetch(`${serverUrl}/matches-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

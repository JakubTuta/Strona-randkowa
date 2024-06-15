import { type DocumentReference, collection, query, where } from 'firebase/firestore'
import { defineStore } from 'pinia'
import type { IChatRoom } from '~/models/chatRoom'
import type { MessageModel } from '~/models/message'

export const useMessageStore = defineStore('message', () => {
  const messages = ref<MessageModel[]>([])
  const chatRoom = ref<IChatRoom | null>(null)

  const { fetchDocumentByRef, getFirebaseCollection, fetchDocumentByQuery } = useDatabase()

  const chatRoomsCollection = getFirebaseCollection(Collections.CHAT_ROOMS)

  const getChatRoomQuery = (userRef1: DocumentReference, userRef2: DocumentReference) => query(chatRoomsCollection, where('users', 'array-contains', [userRef1, userRef2]))

  const fetchMessages = async (chatRoomRef: DocumentReference) => {
    fetchDocumentByRef<IChatRoom>(chatRoomRef)
      .then(doc => console.log(doc.data, doc.ref))
  }

  const getChatRoom = async (userRef1: DocumentReference, userRef2: DocumentReference) => {
    const result = await fetchDocumentByQuery<IChatRoom>(getChatRoomQuery(userRef1, userRef2))

    if (!result.data)
      return

    chatRoom.value = result.data

    return result.data
  }

  return {
    messages,
    chatRoom,
    fetchMessages,
    getChatRoom,
  }
})

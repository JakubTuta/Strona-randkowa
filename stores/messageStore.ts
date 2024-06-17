import { type CollectionReference, type DocumentReference, type QueryDocumentSnapshot, type QuerySnapshot, type Unsubscribe, addDoc, limit, onSnapshot, orderBy, query, startAfter, where } from 'firebase/firestore'
import { defineStore } from 'pinia'
import type { ChatRoomModel } from '~/models/chatRoom'
import { mapChatRoom } from '~/models/chatRoom'
import type { MessageModel } from '~/models/message'
import { mapMessageModel } from '~/models/message'

const PAGINATION_LIMIT = 10
const getMessagesQuery = (collection: CollectionReference) => query(collection, orderBy('date', 'desc'), limit(PAGINATION_LIMIT))
const getNextMessageQuery = (collection: CollectionReference, lastMessageLoaded: QueryDocumentSnapshot) => query(collection, orderBy('date', 'desc'), startAfter(lastMessageLoaded), limit(PAGINATION_LIMIT))

export const useMessageStore = defineStore('message', () => {
  const messages = ref<MessageModel[]>([])
  const chatRoom = ref<ChatRoomModel | null>(null)
  const unsubscribe: Ref<Unsubscribe | null> = ref(null)
  const lastMessageLoaded: Ref<QueryDocumentSnapshot | null> = ref(null)

  const sharedStore = useSharedStore()

  const {
    getFirebaseCollection,
    getFirebaseSubCollection,
    fetchDocumentsByQuery,
  } = useDatabase()

  const chatRoomsCollection = getFirebaseCollection(Collections.CHAT_ROOMS)

  const reset = () => {
    messages.value = []
    chatRoom.value = null
    if (unsubscribe.value) {
      unsubscribe.value()
      unsubscribe.value = null
    }
  }

  const fetchMessages = async (chatRoomRef: DocumentReference) => {
    const messagesCollection = getFirebaseSubCollection(chatRoomRef, 'messages')

    if (unsubscribe.value)
      unsubscribe.value()

    const onSuccess = (arg: QuerySnapshot) => {
      messages.value = arg.docs.map(mapMessageModel).reverse()
      lastMessageLoaded.value = arg.docs[arg.docs.length - 1] || null
      sharedStore.success()
    }

    const onError = (err: IError) => {
      sharedStore.failureSnackbar(err)
    }

    unsubscribe.value = onSnapshot(getMessagesQuery(messagesCollection), onSuccess, onError)
  }

  const fetchNextMessages = async () => {
    if (!chatRoom.value?.reference)
      return

    const messagesCollection = getFirebaseSubCollection(chatRoom.value.reference, 'messages')

    if (lastMessageLoaded.value) {
      const data = await fetchDocumentsByQuery(getNextMessageQuery(messagesCollection, lastMessageLoaded.value))

      lastMessageLoaded.value = data?.docs[data.docs.length - 1] || null

      if (!lastMessageLoaded.value)
        return null

      messages.value.unshift(...data?.docs.map(mapMessageModel).reverse() || [])
      return data
    }
  }

  const sendMessage = async (message: MessageModel) => {
    if (!chatRoom.value?.reference) {
      console.error('Chat room is not defined')
      return
    }

    const messagesCollection = getFirebaseSubCollection(chatRoom.value?.reference, 'messages')

    try {
      await addDoc(messagesCollection, message.toMap())
      sharedStore.success()
    }
    catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const getChatRoom = async (userRef1: DocumentReference, userRef2: DocumentReference) => {
    sharedStore.init()

    const q = query(chatRoomsCollection, where('usersIds', 'array-contains', userRef1.id))

    try {
      const result = await fetchDocumentsByQuery(q)

      if (!result)
        return

      if (result.docs.length === 1) {
        chatRoom.value = result.docs.map(mapChatRoom)[0]
        return
      }

      const filteredResult = result.docs.map(mapChatRoom)
        .filter(data =>
          (data?.usersIds[0] === userRef1?.id && data?.usersIds[1] === userRef2?.id)
          || (data?.usersIds[0] === userRef2?.id && data?.usersIds[1] === userRef1?.id),
        )

      chatRoom.value = filteredResult[0]
      sharedStore.success()
    }
    catch (error) {
      console.error('Error fetching chat room:', error)
    }
  }

  return {
    messages,
    chatRoom,
    fetchMessages,
    fetchNextMessages,
    getChatRoom,
    sendMessage,
    reset,
  }
})

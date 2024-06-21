import { type CollectionReference, type DocumentReference, type QueryDocumentSnapshot, type QuerySnapshot, type Timestamp, type Unsubscribe, addDoc, limit, onSnapshot, orderBy, query, startAfter, where } from 'firebase/firestore'

import { defineStore } from 'pinia'
import { ChatRoomModel, mapChatRoom } from '~/models/chatRoom'

import type { MessageModel } from '~/models/message'
import { mapMessageModel } from '~/models/message'
import type { UserModel } from '~/models/user'
import { mapUser } from '~/models/user'

export interface MatchInfo {
  chatRoom: ChatRoomModel | null
  user: UserModel | null
  lastMessage: string | null
  lastMessageDate: Timestamp | null
  toAnotherUser: boolean
  unreadMessages: number
}

const PAGINATION_LIMIT = 10
const getMessagesQuery = (collection: CollectionReference) => query(collection, orderBy('date', 'desc'), limit(PAGINATION_LIMIT))
const getNextMessageQuery = (collection: CollectionReference, lastMessageLoaded: QueryDocumentSnapshot) => query(collection, orderBy('date', 'desc'), startAfter(lastMessageLoaded), limit(PAGINATION_LIMIT))

export const useMessageStore = defineStore('message', () => {
  const messages = ref<MessageModel[]>([])
  const chatRoom = ref<ChatRoomModel | null>(null)
  const chatRooms = ref<(ChatRoomModel | null)[]>([])

  const matchedUsersInfo = ref<MatchInfo[]>([])

  const unsubscribe: Ref<Unsubscribe | null> = ref(null)
  const lastMessageLoaded: Ref<QueryDocumentSnapshot | null> = ref(null)

  const sharedStore = useSharedStore()

  const {
    getFirebaseCollection,
    getFirebaseSubCollection,
    fetchDocumentsByQuery,
    fetchDocumentByRef,
  } = useDatabase()

  const chatRoomsCollection = getFirebaseCollection(Collections.CHAT_ROOMS)

  const reset = () => {
    messages.value = []
    matchedUsersInfo.value = []
    chatRooms.value = []
    chatRoom.value = null
    if (unsubscribe.value) {
      unsubscribe.value()
      unsubscribe.value = null
    }
  }

  const updateLastMessage = (message: MessageModel) => {
    const info = matchedUsersInfo.value.find(match => match.chatRoom?.reference?.id === chatRoom.value?.reference?.id)

    if (info) {
      info.lastMessage = message.text
      info.lastMessageDate = message.date
      info.toAnotherUser = message.fromUser.id === useAppStore().userData?.reference?.id
    }
  }

  const fetchMessages = async (chatRoomRef: DocumentReference) => {
    const messagesCollection = getFirebaseSubCollection(chatRoomRef, 'messages')

    if (unsubscribe.value)
      unsubscribe.value()

    const onSuccess = (arg: QuerySnapshot) => {
      messages.value = arg.docs.map(mapMessageModel).reverse()
      lastMessageLoaded.value = arg.docs[arg.docs.length - 1] || null

      const message = messages.value[messages.value.length - 1]
      updateLastMessage(message)

      // TODO do osobnej funkcji
      // const q = query()

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

  const setCurrentChatRoom = (newChatRoom: ChatRoomModel | null) => {
    chatRoom.value = newChatRoom
  }

  const createChatRoom = async (userRef1: DocumentReference, userRef2: DocumentReference) => {
    sharedStore.init()

    const chatRoomData = new ChatRoomModel({
      usersIds: [userRef1.id, userRef2.id],
      usersRefs: [userRef1, userRef2],
    }, null)

    const docRef = await addDoc(chatRoomsCollection, chatRoomData.toMap())

    chatRoom.value = new ChatRoomModel(chatRoomData, docRef)
    chatRooms.value.push(chatRoom.value)
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

  const getMatchedUsersInfo = async (loggedUserRef: DocumentReference, matchedUsersRefs: DocumentReference[]) => {
    sharedStore.init()

    const q = query(chatRoomsCollection, where('usersIds', 'array-contains', loggedUserRef.id))

    let result
    try {
      result = await fetchDocumentsByQuery(q)
    }
    catch (error) {
      console.error('Error fetching chat room:', error)
      return
    }

    if (!result)
      return

    const usersPromises = matchedUsersRefs.map(ref => fetchDocumentByRef(ref))
    const usersResults = await Promise.all(usersPromises)

    for (const userResult of usersResults) {
      const userRef = matchedUsersRefs[usersResults.indexOf(userResult)]
      if (!userResult?.exists())
        continue

      const filteredResult = result.docs.map(mapChatRoom)
        .filter(data =>
          (data?.usersIds[0] === loggedUserRef?.id && data?.usersIds[1] === userRef?.id)
          || (data?.usersIds[0] === userRef?.id && data?.usersIds[1] === loggedUserRef?.id),
        )

      if (!filteredResult[0]) {
        matchedUsersInfo.value.push({
          chatRoom: null,
          user: mapUser(userResult),
          lastMessage: null,
          lastMessageDate: null,
          toAnotherUser: false,
          unreadMessages: 0,
        })
      }
      else {
        chatRooms.value.push(filteredResult[0])
        matchedUsersInfo.value.push({
          chatRoom: filteredResult[0],
          user: mapUser(userResult),
          lastMessage: null,
          lastMessageDate: null,
          toAnotherUser: false,
          unreadMessages: 0,
        })
      }
    }

    sharedStore.success()
  }

  return {
    messages,
    chatRoom,
    chatRooms,
    matchedUsersInfo,
    createChatRoom,
    setCurrentChatRoom,
    fetchMessages,
    fetchNextMessages,
    getChatRoom,
    getMatchedUsersInfo,
    sendMessage,
    reset,
  }
})

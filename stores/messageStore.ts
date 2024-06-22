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
  lastMessageLoaded: QueryDocumentSnapshot | null
  lastMessageDate: Timestamp | null
  isLastMessageToAnotherUser: boolean
  unreadMessages: number
  messages: MessageModel[]
}

const PAGINATION_LIMIT = 10
const getMessagesQuery = (collection: CollectionReference) => query(collection, orderBy('date', 'desc'), limit(PAGINATION_LIMIT))
const getNextMessageQuery = (collection: CollectionReference, lastMessageLoaded: QueryDocumentSnapshot) => query(collection, orderBy('date', 'desc'), startAfter(lastMessageLoaded), limit(PAGINATION_LIMIT))

export const useMessageStore = defineStore('message', () => {
  // const messages = ref<MessageModel[]>([])
  const chatRoom = ref<ChatRoomModel | null>(null)
  const chatRooms = ref<(ChatRoomModel | null)[]>([])

  const matchedUsersInfo = ref<MatchInfo[]>([])

  // const unsubscribe: Ref<Unsubscribe | null> = ref(null)
  const unsubscribesArr: Ref<Unsubscribe[]> = ref([])
  const lastMessageLoaded: Ref<QueryDocumentSnapshot | null> = ref(null)

  const sharedStore = useSharedStore()
  const appStore = useAppStore()

  const {
    getFirebaseCollection,
    getFirebaseSubCollection,
    fetchDocumentsByQuery,
    fetchDocumentByRef,
  } = useDatabase()

  const chatRoomsCollection = getFirebaseCollection(Collections.CHAT_ROOMS)

  const reset = () => {
    // messages.value = []
    matchedUsersInfo.value = []
    chatRooms.value = []
    chatRoom.value = null
    // if (unsubscribe.value) {
    //   unsubscribe.value()
    //   unsubscribe.value = null
    // }

    unsubscribesArr.value.forEach((unsubscribe) => {
      unsubscribe()
    })
    unsubscribesArr.value = []
  }

  const updateLastMessage = (message: MessageModel) => {
    const info = matchedUsersInfo.value.find(match => match.chatRoom?.reference?.id === chatRoom.value?.reference?.id)

    if (info) {
      info.lastMessage = message.text
      info.lastMessageDate = message.date
      info.isLastMessageToAnotherUser = message.fromUser.id === appStore.userData?.reference?.id
    }
  }

  const fetchMessages = async (chatRoomRef: DocumentReference | null) => {
    if (!chatRoomRef)
      return

    const messagesCollection = getFirebaseSubCollection(chatRoomRef, 'messages')

    const onSuccess = (arg: QuerySnapshot) => {
      if (!appStore.userData || !appStore.userData.reference) {
        console.error('User is not defined')
        return
      }

      const messages = arg.docs.map(mapMessageModel).reverse()
      const lastMessageLoaded = arg.docs[arg.docs.length - 1] || null

      const anotherUser = messages[0].fromUser.id !== appStore.userData.reference.id ? messages[0].fromUser.id : messages[0].toUser.id

      const userId = appStore.userData.reference.id
      const lastMessage = messages[messages.length - 1]

      matchedUsersInfo.value.map((match) => {
        if (match.chatRoom?.usersIds.includes(anotherUser) && match.chatRoom?.usersIds.includes(userId)) {
          match.messages = messages
          match.lastMessage = lastMessage.text.length > 33 ? `${lastMessage.text.substring(0, 33)}...` : lastMessage.text
          match.lastMessageDate = lastMessage.date
          match.lastMessageLoaded = lastMessageLoaded
          match.isLastMessageToAnotherUser = lastMessage.fromUser.id === userId
        }
        return match
      })

      // updateLastMessage(lastMessage)

      // TODO do osobnej funkcji
      // const q = query()

      sharedStore.success()
    }

    const onError = (err: IError) => {
      sharedStore.failureSnackbar(err)
    }

    unsubscribesArr.value.push(onSnapshot(getMessagesQuery(messagesCollection), onSuccess, onError))
  }

  const fetchMessagesForAllChatRooms = async (chatRoomRefs: DocumentReference[]) => {
    try {
      unsubscribesArr.value.forEach((unsubscribe) => {
        unsubscribe()
      })
      unsubscribesArr.value = []
      await Promise.all(chatRoomRefs.map(ref => fetchMessages(ref)))
    }
    catch (err) {
      console.error('Error fetching messages', err)
    }
  }

  const fetchNextMessages = async () => {
    if (!chatRoom.value?.reference)
      return

    const messagesCollection = getFirebaseSubCollection(chatRoom.value.reference, 'messages')

    const index = matchedUsersInfo.value.findIndex(match => match.chatRoom?.reference?.id === chatRoom.value?.reference?.id)

    if (index === -1) {
      console.error('Match not found')
      return
    }

    const currentMatchInfo = matchedUsersInfo.value[index]

    if (currentMatchInfo.lastMessageLoaded) {
      const data = await fetchDocumentsByQuery(getNextMessageQuery(messagesCollection, currentMatchInfo.lastMessageLoaded))

      currentMatchInfo.lastMessageLoaded = data?.docs[data.docs.length - 1] || null

      if (!currentMatchInfo.lastMessageLoaded)
        return null

      currentMatchInfo.messages.unshift(...data?.docs.map(mapMessageModel).reverse() || [])

      matchedUsersInfo.value[index] = currentMatchInfo

      return data
    }
  }

  const setCurrentChatRoom = (newChatRoom: ChatRoomModel | null) => {
    chatRoom.value = newChatRoom
  }

  const createChatRoom = async (loggedUserRef: DocumentReference, anotherUserRef: DocumentReference) => {
    sharedStore.init()

    const chatRoomData = new ChatRoomModel({
      usersIds: [loggedUserRef.id, anotherUserRef.id],
      usersRefs: [loggedUserRef, anotherUserRef],
    }, null)

    const newChatRoomRef = await addDoc(chatRoomsCollection, chatRoomData.toMap())

    const anotherUser = await fetchDocumentByRef(newChatRoomRef)

    if (!anotherUser || !anotherUser.exists()) {
      console.error('Another user is not defined')
      return
    }

    chatRoom.value = new ChatRoomModel(chatRoomData, newChatRoomRef)
    chatRooms.value.push(chatRoom.value)
    matchedUsersInfo.value.push({
      chatRoom: chatRoom.value,
      user: mapUser(anotherUser),
      lastMessage: null,
      lastMessageLoaded: null,
      lastMessageDate: null,
      isLastMessageToAnotherUser: false,
      unreadMessages: 0,
      messages: [],
    })
    await fetchMessages(newChatRoomRef)
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
          lastMessageLoaded: null,
          lastMessageDate: null,
          isLastMessageToAnotherUser: false,
          unreadMessages: 0,
          messages: [],
        })
      }
      else {
        chatRooms.value.push(filteredResult[0])
        matchedUsersInfo.value.push({
          chatRoom: filteredResult[0],
          user: mapUser(userResult),
          lastMessage: null,
          lastMessageLoaded: null,
          lastMessageDate: null,
          isLastMessageToAnotherUser: false,
          unreadMessages: 0,
          messages: [],
        })
      }
    }

    sharedStore.success()
  }

  return {
    // messages,
    chatRoom,
    chatRooms,
    matchedUsersInfo,
    unsubscribesArr,
    createChatRoom,
    setCurrentChatRoom,
    fetchMessagesForAllChatRooms,
    fetchMessages,
    fetchNextMessages,
    getChatRoom,
    getMatchedUsersInfo,
    sendMessage,
    reset,
  }
})

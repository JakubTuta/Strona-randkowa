import { update } from 'firebase/database'
import { type CollectionReference, type DocumentReference, type QueryDocumentSnapshot, type QuerySnapshot, type Timestamp, type Unsubscribe, addDoc, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where } from 'firebase/firestore'

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
  isNewMessage: boolean
  messages: MessageModel[]
}

const USER_LAST_READ_MESSAGES_SUB_COLLECTION = 'userLastReadMessages'
const MESSAGES_SUB_COLLECTION = 'messages'
const PAGINATION_LIMIT = 10
const getMessagesQuery = (collection: CollectionReference) => query(collection, orderBy('date', 'desc'), limit(PAGINATION_LIMIT))
const getNextMessageQuery = (collection: CollectionReference, lastMessageLoaded: QueryDocumentSnapshot) => query(collection, orderBy('date', 'desc'), startAfter(lastMessageLoaded), limit(PAGINATION_LIMIT))

export const useMessageStore = defineStore('message', () => {
  const chatRoom = ref<ChatRoomModel | null>(null)

  const matchedUsersInfo = ref<MatchInfo[]>([])

  const unsubscribesArr: Ref<Unsubscribe[]> = ref([])

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
    matchedUsersInfo.value = []
    chatRoom.value = null

    unsubscribesArr.value.forEach((unsubscribe) => {
      unsubscribe()
    })
    unsubscribesArr.value = []
  }

  const updateLastReadMessage = async (chatRoomRef: DocumentReference, messageRef: DocumentReference) => {
    const userLastReadMessagesSubCollection = getFirebaseSubCollection(chatRoomRef, USER_LAST_READ_MESSAGES_SUB_COLLECTION)

    const q = query(userLastReadMessagesSubCollection, where('user', '==', appStore.userData?.reference))

    const data = await fetchDocumentsByQuery(q)

    if (!data || !data.docs[0]?.ref)
      return

    updateDoc(data.docs[0].ref, { lastReadMessage: messageRef })
  }

  const fetchMessages = async (chatRoomRef: DocumentReference | null) => {
    if (!chatRoomRef)
      return

    const messagesCollection = getFirebaseSubCollection(chatRoomRef, MESSAGES_SUB_COLLECTION)

    const onSuccess = async (arg: QuerySnapshot) => {
      if (!appStore.userData || !appStore.userData.reference) {
        console.error('User is not defined')
        return
      }

      const messages = arg.docs.map(mapMessageModel).reverse()
      const lastMessageLoaded = arg.docs[arg.docs.length - 1] || null

      const anotherUserId = messages[0].fromUser.id !== appStore.userData.reference.id ? messages[0].fromUser.id : messages[0].toUser.id

      const loggedUserId = appStore.userData.reference.id
      const lastMessage = messages[messages.length - 1]

      matchedUsersInfo.value.map((match) => {
        if (match.chatRoom?.usersIds.includes(anotherUserId) && match.chatRoom?.usersIds.includes(loggedUserId)) {
          match.messages = messages
          match.lastMessage = lastMessage.text.length > 33 ? `${lastMessage.text.substring(0, 33)}...` : lastMessage.text
          match.lastMessageDate = lastMessage.date
          match.lastMessageLoaded = lastMessageLoaded
          match.isLastMessageToAnotherUser = lastMessage.fromUser.id === loggedUserId
        }
        return match
      })

      const currentChatRoomIndex = matchedUsersInfo.value.findIndex(
        match => match.chatRoom?.usersIds.includes(anotherUserId) && match.chatRoom?.usersIds.includes(loggedUserId),
      )

      if (matchedUsersInfo.value[currentChatRoomIndex]
        && matchedUsersInfo.value[currentChatRoomIndex].chatRoom?.reference?.id !== chatRoom.value?.reference?.id
        && chatRoom.value) {
        if (lastMessage.toUser.id === loggedUserId && lastMessage?.reference) {
          const newInfo = await processLastReadAndUnreadMessages(matchedUsersInfo.value[currentChatRoomIndex].chatRoom, appStore.userData.reference, matchedUsersInfo.value[currentChatRoomIndex])

          if (newInfo)
            matchedUsersInfo.value[currentChatRoomIndex] = newInfo
        }
      }

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

    const messagesCollection = getFirebaseSubCollection(chatRoom.value.reference, MESSAGES_SUB_COLLECTION)

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

  const setCurrentChatRoom = async (newChatRoom: ChatRoomModel | null) => {
    chatRoom.value = newChatRoom

    if (!newChatRoom?.reference)
      return

    const lastMessageQuery = query(getFirebaseSubCollection(newChatRoom.reference, MESSAGES_SUB_COLLECTION), orderBy('date', 'desc'), where('toUser', '==', appStore.userData?.reference))

    const messages = await fetchDocumentsByQuery(lastMessageQuery)

    if (!messages || !messages.docs[0]?.ref)
      return

    updateLastReadMessage(newChatRoom.reference, messages.docs[0].ref)

    matchedUsersInfo.value.map((match) => {
      if (match.chatRoom?.reference?.id === newChatRoom?.reference?.id)
        match.isNewMessage = false

      return match
    })
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

    const unreadMessagesSubCollection = getFirebaseSubCollection(newChatRoomRef, USER_LAST_READ_MESSAGES_SUB_COLLECTION)

    try {
      await Promise.all([
        addDoc(unreadMessagesSubCollection, { user: loggedUserRef, lastReadMessage: null }),
        addDoc(unreadMessagesSubCollection, { user: anotherUserRef, lastReadMessage: null }),
      ])

      sharedStore.success()
    }
    catch (error) {
      console.error('Error adding last read messages:', error)
    }

    chatRoom.value = new ChatRoomModel(chatRoomData, newChatRoomRef)

    const matchInfoIndex = matchedUsersInfo.value.findIndex(match => match.user?.reference?.id === anotherUserRef.id)

    if (matchInfoIndex === -1) {
      console.error('Match not found')
      return
    }

    matchedUsersInfo.value[matchInfoIndex].chatRoom = chatRoom.value

    await fetchMessages(newChatRoomRef)
  }

  const sendMessage = async (message: MessageModel) => {
    if (!chatRoom.value?.reference) {
      console.error('Chat room is not defined')
      return
    }

    const messagesCollection = getFirebaseSubCollection(chatRoom.value?.reference, MESSAGES_SUB_COLLECTION)

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

  async function processLastReadAndUnreadMessages(filteredChatRoom: ChatRoomModel | null, loggedUserRef: DocumentReference, baseInfoObj: MatchInfo) {
    if (!filteredChatRoom?.reference)
      return null

    const userLastReadMessagesSubCollection = getFirebaseSubCollection(filteredChatRoom.reference, USER_LAST_READ_MESSAGES_SUB_COLLECTION)
    const q = query(userLastReadMessagesSubCollection, where('user', '==', loggedUserRef))
    const data = await fetchDocumentsByQuery(q)
    const lastReadMessageRef = data?.docs[0].data().lastReadMessage

    if (!lastReadMessageRef) {
      baseInfoObj.chatRoom = filteredChatRoom
      baseInfoObj.isNewMessage = false
      return baseInfoObj
    }

    const messageSnapshot = await fetchDocumentByRef(lastReadMessageRef)

    if (messageSnapshot && messageSnapshot.exists()) {
      const unreadMessagesQuery = query(
        getFirebaseSubCollection(filteredChatRoom.reference, 'messages'),
        orderBy('date', 'asc'),
        startAfter(messageSnapshot),
        where('toUser', '==', loggedUserRef),
      )

      const unreadMessages = await fetchDocumentsByQuery(unreadMessagesQuery)

      if (unreadMessages?.docs.length)
        baseInfoObj.isNewMessage = unreadMessages.docs.length > 0 || false
    }

    baseInfoObj.chatRoom = filteredChatRoom

    return baseInfoObj
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

      let baseInfoObj: MatchInfo = {
        user: mapUser(userResult),
        lastMessage: null,
        lastMessageLoaded: null,
        lastMessageDate: null,
        chatRoom: null,
        isNewMessage: false,
        isLastMessageToAnotherUser: false,
        messages: [],
      }

      const filteredChatRoom = filteredResult[0]

      if (filteredChatRoom && filteredChatRoom.reference) {
        const finalizeBaseInfoObj = await processLastReadAndUnreadMessages(filteredChatRoom, loggedUserRef, baseInfoObj)

        if (finalizeBaseInfoObj)
          baseInfoObj = finalizeBaseInfoObj
      }

      matchedUsersInfo.value.push(baseInfoObj)
    }

    sharedStore.success()
  }

  return {
    chatRoom,
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

import type { DocumentData, DocumentReference, DocumentSnapshot } from 'firebase/firestore'

export interface IChatRoom {
  usersIds: string[]
  usersRefs: DocumentReference[]
}

export class ChatRoomModel implements IChatRoom {
  usersIds: string[]
  usersRefs: DocumentReference[]

  reference: DocumentReference | null

  constructor(data: IChatRoom, reference: DocumentReference | null) {
    this.usersIds = data.usersIds || []
    this.usersRefs = data.usersRefs || []

    this.reference = reference
  }

  toMap() {
    return {
      usersIds: this.usersIds,
      usersRefs: this.usersRefs,
    }
  }
}

export function mapChatRoom(chatRoom: DocumentSnapshot<DocumentData>) {
  const data = chatRoom.data()

  if (!data)
    return null

  return new ChatRoomModel(
    data as IChatRoom,
    chatRoom.ref,
  )
}

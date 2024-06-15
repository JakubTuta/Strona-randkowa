import type { DocumentData, DocumentReference } from 'firebase/firestore'
import type { IMessage } from './message'

export interface IChatRoom {
  users: DocumentReference[]
}

export class ChatRoomModel implements IChatRoom {
  users: DocumentReference[]

  reference: DocumentReference | null

  constructor(data: IChatRoom, reference: DocumentReference | null) {
    this.users = data.users || []

    this.reference = reference
  }

  toMap() {
    return {
      users: this.users,
    }
  }
}

export function mapChatRoom(chatRoom: DocumentData) {
  return new ChatRoomModel(
    chatRoom.data(),
    chatRoom.ref,
  )
}

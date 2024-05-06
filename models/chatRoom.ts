import type { DocumentData, DocumentReference } from 'firebase/firestore'
import type { IMessage } from './message'

export interface IChatRoom {
  users: DocumentReference[]
  messages: IMessage[]
}

export class ChatRoomModel implements IChatRoom {
  users: DocumentReference[]
  messages: IMessage[]

  reference: DocumentReference | null

  constructor(data: IChatRoom, reference: DocumentReference | null) {
    this.users = data.users || []
    this.messages = data.messages || []

    this.reference = reference
  }

  toMap() {
    return {
      users: this.users,
      messages: this.messages,
    }
  }
}

export function mapChatRoom(chatRoom: DocumentData) {
  return new ChatRoomModel(
    chatRoom.data(),
    chatRoom.ref,
  )
}

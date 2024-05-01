import type { DocumentReference } from 'firebase/firestore'

export interface IMessage {
  text: string
  toUser: DocumentReference
  fromUser: DocumentReference
}

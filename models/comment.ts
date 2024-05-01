import type { DocumentReference, Timestamp } from 'firebase/firestore'

export interface IComment {
  content: string
  fromUser: DocumentReference
  date: Date | Timestamp
}

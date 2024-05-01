import type { DocumentReference, Timestamp } from 'firebase/firestore'

export interface IComment {
  content: string
  from: DocumentReference
  date: Date | Timestamp
}

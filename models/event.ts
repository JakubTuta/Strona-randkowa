import type { DocumentData, DocumentReference } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import type { IComment } from './comment'

export interface IEvent {
  name: string
  photo: string
  startDate: Date | Timestamp
  endDate: Date | Timestamp
  createdBy: DocumentReference
  comments: IComment[]
}

export class EventModel implements IEvent {
  name: string
  photo: string
  startDate: Date | Timestamp
  endDate: Date | Timestamp
  createdBy: DocumentReference
  comments: IComment[]

  reference: DocumentReference | null

  constructor(data: IEvent, reference: DocumentReference | null) {
    this.name = data.name || ''
    this.photo = data.photo || ''
    this.startDate = data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate
    this.endDate = data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate
    this.createdBy = data.createdBy
    this.comments = data.comments || []

    this.reference = reference
  }

  toMap() {
    return {
      name: this.name,
      photo: this.photo,
      startDate: this.startDate,
      endDate: this.endDate,
      createdBy: this.createdBy,
      comments: this.comments,
    }
  }
}

export function mapEvent(event: DocumentData) {
  return new EventModel(
    event.data(),
    event.ref,
  )
}

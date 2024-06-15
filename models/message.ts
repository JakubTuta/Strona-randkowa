import { type DocumentData, type DocumentReference, Timestamp } from 'firebase/firestore'

export interface IMessage {
  text: string
  toUser: DocumentReference
  fromUser: DocumentReference
  date: Timestamp | Date
}

export class MessageModel implements IMessage {
  text: string
  toUser: DocumentReference
  fromUser: DocumentReference
  date: Timestamp | Date
  reference: DocumentReference | null

  constructor(data: IMessage, reference: DocumentReference | null) {
    this.text = data.text
    this.toUser = data.toUser
    this.fromUser = data.fromUser
    this.date = data.date instanceof Timestamp ? data.date.toDate() : data.date

    this.reference = reference
  }

  toMap() {
    return {
      text: this.text,
      toUser: this.toUser,
      fromUser: this.fromUser,
      date: this.date,
    }
  }
}

export function mapMessageModel(message: DocumentData) {
  return new MessageModel(
    message.data(),
    message.ref,
  )
}

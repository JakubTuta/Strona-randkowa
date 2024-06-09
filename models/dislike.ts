import { type DocumentData, type DocumentReference, Timestamp } from 'firebase/firestore'

export interface IDislike {
  whoDisliked: DocumentReference | null
  dislikedProfile: DocumentReference | null
  date: Timestamp | Date
}

export class DislikeModel implements IDislike {
  whoDisliked: DocumentReference | null
  dislikedProfile: DocumentReference | null
  date: Timestamp | Date

  reference: DocumentReference | null

  constructor(data: IDislike, reference: DocumentReference | null) {
    this.whoDisliked = data.whoDisliked || null
    this.dislikedProfile = data.dislikedProfile || null
    this.date = data.date instanceof Timestamp ? data.date.toDate() : data.date

    this.reference = reference
  }

  toMap() {
    return {
      whoDisliked: this.whoDisliked,
      dislikedProfile: this.dislikedProfile,
      date: this.date,
    }
  }
}

export function mapDislike(like: DocumentData) {
  return new DislikeModel(
    like.data(),
    like.ref,
  )
}

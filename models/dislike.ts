import type { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore'

export interface IDislike {
  whoDisliked: DocumentReference
  dislikedProfile: DocumentReference
  date: Timestamp
}

export class DislikeModel implements IDislike {
  whoDisliked: DocumentReference
  dislikedProfile: DocumentReference
  date: Timestamp

  reference: DocumentReference | null

  constructor(data: IDislike, reference: DocumentReference | null) {
    this.whoDisliked = data.whoDisliked
    this.dislikedProfile = data.dislikedProfile
    this.date = data.date

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

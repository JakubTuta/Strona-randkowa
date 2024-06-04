import type { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore'

export interface ILike {
  whoLiked: DocumentReference
  likedProfile: DocumentReference
  date: Timestamp
}

export class LikeModel implements ILike {
  whoLiked: DocumentReference
  likedProfile: DocumentReference
  date: Timestamp

  reference: DocumentReference | null

  constructor(data: ILike, reference: DocumentReference | null) {
    this.whoLiked = data.whoLiked || null
    this.likedProfile = data.likedProfile || null
    this.date = data.date || null

    this.reference = reference || null
  }

  toMap() {
    return {
      whoLiked: this.whoLiked,
      likedProfile: this.likedProfile,
      date: this.date,
    }
  }
}

export function mapLike(like: DocumentData) {
  return new LikeModel(
    like.data(),
    like.ref,
  )
}

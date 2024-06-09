import type { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore'

export interface ILike {
  whoLiked: DocumentReference | null
  likedProfile: DocumentReference | null
}

export class LikeModel implements ILike {
  whoLiked: DocumentReference | null
  likedProfile: DocumentReference | null

  reference: DocumentReference | null

  constructor(data: ILike, reference: DocumentReference | null) {
    this.whoLiked = data.whoLiked || null
    this.likedProfile = data.likedProfile || null

    this.reference = reference || null
  }

  toMap() {
    return {
      whoLiked: this.whoLiked,
      likedProfile: this.likedProfile,
    }
  }
}

export function mapLike(like: DocumentData) {
  return new LikeModel(
    like.data(),
    like.ref,
  )
}

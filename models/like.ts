import type { DocumentData, DocumentReference } from 'firebase/firestore'

export interface ILike {
  whoLiked: DocumentReference
  likedProfile: DocumentReference
}

export class LikeModel implements ILike {
  whoLiked: DocumentReference
  likedProfile: DocumentReference

  reference: DocumentReference | null

  constructor(data: ILike, reference: DocumentReference | null) {
    this.whoLiked = data.whoLiked
    this.likedProfile = data.likedProfile

    this.reference = reference
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

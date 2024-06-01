import type { DocumentData, DocumentReference, DocumentSnapshot } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import type { TGender } from '~/types/gender'
import type { THobby } from '~/types/hobby'
import type { TLookingFor } from '~/types/lookingFor'
import type { TPreferredGender } from '~/types/preferredGender'
import type { TRole } from '~/types/role'

export interface IUser {
  photos: string[]
  firstName: string
  email: string
  description: string
  faculty: string
  fieldOfStudy: string
  lastName: string
  dateBirth: Date
  gender: TGender
  index: number
  role: TRole
  score: number
  elo: number
  preferredGender: TPreferredGender
  lookingFor: TLookingFor
  blockedProfiles: DocumentReference[]
  hobbies: THobby[]
  verifiedImages: number
}

export class UserModel implements IUser {
  photos: string[]
  firstName: string
  email: string
  description: string
  faculty: string
  fieldOfStudy: string
  lastName: string
  dateBirth: Date
  gender: TGender
  index: number
  role: TRole
  score: number
  elo: number
  preferredGender: TPreferredGender
  lookingFor: TLookingFor
  blockedProfiles: DocumentReference[]
  hobbies: THobby[]
  verifiedImages: number

  reference: DocumentReference | null

  constructor(data: IUser, reference: DocumentReference | null) {
    this.photos = data.photos || ''
    this.firstName = data.firstName || ''
    this.email = data.email || ''
    this.description = data.description || ''
    this.faculty = data.faculty || ''
    this.fieldOfStudy = data.fieldOfStudy || ''
    this.lastName = data.lastName || ''
    this.dateBirth = data.dateBirth instanceof Timestamp ? data.dateBirth.toDate() : data.dateBirth
    this.gender = data.gender || ''
    this.index = data.index || 0
    this.role = data.role || ''
    this.score = data.score || 0
    this.elo = data.elo || 0
    this.preferredGender = data.preferredGender || ''
    this.lookingFor = data.lookingFor || ''
    this.blockedProfiles = data.blockedProfiles || []
    this.hobbies = data.hobbies || []
    this.verifiedImages = data.verifiedImages || 0

    this.reference = reference
  }

  toMap() {
    return {
      photos: this.photos,
      firstName: this.firstName,
      email: this.email,
      faculty: this.faculty,
      fieldOfStudy: this.fieldOfStudy,
      description: this.description,
      lastName: this.lastName,
      dateBirth: this.dateBirth,
      gender: this.gender,
      index: this.index,
      role: this.role,
      score: this.score,
      elo: this.elo,
      preferredGender: this.preferredGender,
      lookingFor: this.lookingFor,
      blockedProfiles: this.blockedProfiles,
      hobbies: this.hobbies,
      verifiedImages: this.verifiedImages,
    }
  }
}

export function mapUser(user: DocumentSnapshot<DocumentData>) {
  const data = user.data()

  if (!data)
    return null

  return new UserModel(
    data as IUser,
    user.ref,
  )
}

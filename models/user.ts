import type { DocumentData, DocumentReference } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import type { TGender } from '~/types/gender'
import type { THobby } from '~/types/hobby'
import type { TLookingFor } from '~/types/lookingFor'
import type { TPreferredGender } from '~/types/preferredGender'
import type { TRole } from '~/types/role'

export interface IUser {
  userName: string
  photos: string[]
  firstName: string
  faculty: string
  lastName: string
  dateBirth: Date | Timestamp
  gender: TGender
  index: number
  role: TRole
  score: number
  elo: number
  preferred_gender: TPreferredGender
  looking_for: TLookingFor
  blocked_profiles: DocumentReference[]
  hobbies: THobby[]
}

export class UserModel implements IUser {
  userName: string
  photos: string[]
  firstName: string
  faculty: string
  lastName: string
  dateBirth: Date | Timestamp
  gender: TGender
  index: number
  role: TRole
  score: number
  elo: number
  preferred_gender: TPreferredGender
  looking_for: TLookingFor
  blocked_profiles: DocumentReference[]
  hobbies: THobby[]

  reference: DocumentReference | null

  constructor(data: IUser, reference: DocumentReference | null) {
    this.userName = data.userName || ''
    this.photos = data.photos || ''
    this.firstName = data.firstName || ''
    this.faculty = data.faculty || ''
    this.lastName = data.lastName || ''
    this.dateBirth = data.dateBirth instanceof Timestamp ? data.dateBirth.toDate() : data.dateBirth
    this.gender = data.gender || ''
    this.index = data.index || 0
    this.role = data.role || ''
    this.score = data.score || 0
    this.elo = data.elo || 0
    this.preferred_gender = data.preferred_gender || ''
    this.looking_for = data.looking_for || ''
    this.blocked_profiles = data.blocked_profiles || []
    this.hobbies = data.hobbies || []

    this.reference = reference
  }

  toMap() {
    return {
      userName: this.userName,
      photos: this.photos,
      firstName: this.firstName,
      faculty: this.faculty,
      lastName: this.lastName,
      dateBirth: this.dateBirth,
      gender: this.gender,
      index: this.index,
      role: this.role,
      score: this.score,
      elo: this.elo,
      preferred_gender: this.preferred_gender,
      looking_for: this.looking_for,
      blocked_profiles: this.blocked_profiles,
      hobbies: this.hobbies,
    }
  }
}

export function mapUser(user: DocumentData) {
  return new UserModel(
    user.data(),
    user.ref,
  )
}

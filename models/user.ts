import type { DocumentData, DocumentReference } from 'firebase/firestore'

export interface IUser {
  userName: string // username
  name: string
  lastName: string
  email: string
  dateBirth: string
  gender: string // male female other
  index: string
  faculty: string
  description: string
  role: UserRole
  score: number
  elo: number
  // photos: string // tymczasowo

  preferred_gender: string
  looking_for: string
}

export class UserModel implements IUser {
  userName: string // username
  name: string
  lastName: string
  email: string
  dateBirth: string
  gender: string
  index: string
  faculty: string
  description: string
  role: UserRole
  score: number
  elo: number
  // photos

  preferred_gender: string
  looking_for: string

  reference: DocumentReference | null

  constructor(data: IUser, reference: DocumentReference | null) {
    this.userName = data.userName
    this.name = data.name || ''
    this.lastName = data.lastName
    this.email = data.email
    this.dateBirth = data.dateBirth || ''
    this.gender = data.gender || ''
    this.index = data.index
    this.faculty = data.faculty || ''
    this.description = data.description || ''
    this.role = data.role
    this.score = data.score || 0
    this.elo = data.elo || 0
    // this.photos = data.photos || []

    this.preferred_gender = data.preferred_gender || ''
    this.looking_for = data.looking_for || ''

    this.reference = reference
  }

  toMap() {
    return {
      userName: this.userName,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      dateBirth: this.dateBirth,
      gender: this.gender,
      faculty: this.faculty,
      index: this.index,
      description: this.description,
      role: this.role,
      score: this.score,
      elo: this.elo,
      // photos: this.photos,
      preferred_gender: this.preferred_gender,
      looking_for: this.looking_for,
    }
  }
}

export const mapUser = (user: DocumentData) => new UserModel(user.data(), user.ref)

export type UserRole = 'admin' | 'user'

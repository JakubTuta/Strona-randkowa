import type { DocumentData, DocumentReference } from 'firebase/firestore'

export interface IUser {
    name: string // name last-name
    age: number
    gender: string // male female other
    index: string
    faculty: string
    description: string
    score: number
    elo: number
    // photos

    preferred_gender: string
    looking_for: string
}

export class UserModel implements IUser {
    name: string
    age: number
    gender: string
    index: string
    faculty: string
    description: string
    score: number
    elo: number
    // photos

    preferred_gender: string
    looking_for: string

    reference: DocumentReference | null

    constructor(data: IUser, reference: DocumentReference | null) {
        this.name = data.name || ''
        this.age = data.age || 0
        this.gender = data.gender || ''
        this.index = data.index
        this.faculty = data.faculty || ''
        this.description = data.description || ''
        this.score = data.score || 0
        this.elo = data.elo || 0
        // this.photos = data.photos || []

        this.preferred_gender = data.preferred_gender || ''
        this.looking_for = data.looking_for || ''

        this.reference = reference
    }

    toMap() {
        return {
            name: this.name,
            age: this.age,
            gender: this.gender,
            faculty: this.faculty,
            index: this.index,
            description: this.description,
            // photos: this.photos,
            preferred_gender: this.preferred_gender,
            looking_for: this.looking_for,
        }
    }
}

export const mapUser = (user: DocumentData) => new UserModel(user.data(), user.ref)
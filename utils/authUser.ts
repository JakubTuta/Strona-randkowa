import type { Firestore } from 'firebase/firestore'
import { collection, doc, getDoc } from 'firebase/firestore'

const USERS = 'users'

function collectionUsers(firestore: Firestore) {
  return collection(firestore, USERS)
}

export function getUserQuery(uid: string, firestore: Firestore) {
  return getDoc(doc(collectionUsers(firestore), uid))
}

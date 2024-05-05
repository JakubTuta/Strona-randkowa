import type { DocumentReference, Firestore } from 'firebase/firestore'
import { collection, doc, getDoc } from 'firebase/firestore'

export function useDatabase() {
  const nuxtApp = useNuxtApp()

  const firestore = nuxtApp.$firestore as Firestore

  const getFirebaseCollection = (collectionName: Collections) => {
    return collection(firestore, collectionName)
  }

  const fetchDocumentById = async <T>(uid: string, collectionName: Collections) => {
    const documentSnapshot = await getDoc(doc(getFirebaseCollection(collectionName), uid))

    if (!documentSnapshot.exists())
      return { data: null, ref: documentSnapshot.ref }

    return { data: (documentSnapshot.data()) as T, ref: documentSnapshot.ref }
  }

  const fetchDocumentByRef = async <T>(ref: DocumentReference) => {
    const documentSnapshot = await getDoc(ref)

    if (!documentSnapshot.exists())
      return { data: null, ref: documentSnapshot.ref }

    return { data: (documentSnapshot.data()) as T, ref: documentSnapshot.ref }
  }

  return {
    fetchDocumentByRef,
    fetchDocumentById,
  }
}

export enum Collections {
  USERS = 'users',
}

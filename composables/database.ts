import type { get } from 'firebase/database'
import type { DocumentData, DocumentReference, Firestore, Query } from 'firebase/firestore'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

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

  const fetchDocumentByQuery = async <T>(query: Query<DocumentData, DocumentData>) => {
    const documentSnapshot = await getDocs(query)

    if (documentSnapshot.empty)
      return { data: null, ref: null }

    return { data: (documentSnapshot.docs[0].data()) as T, ref: documentSnapshot.docs[0].ref }
  }

  return {
    getFirebaseCollection,
    fetchDocumentByRef,
    fetchDocumentById,
    fetchDocumentByQuery,
  }
}

export enum Collections {
  USERS = 'users',
  CHAT_ROOMS = 'chatRooms',
}

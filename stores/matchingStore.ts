import type {
  DocumentReference,
  QuerySnapshot,
} from 'firebase/firestore'
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { Ref } from 'vue'
import type { EventModel } from '~/models/event'
import { mapEvent } from '~/models/event'
import { useSharedStore } from '~/stores/sharedStore'
import { type DislikeModel, mapDislike } from '~/models/dislike'
import { type ILike, type LikeModel, mapLike } from '~/models/like'

export const useMatchingStore = defineStore('matches', () => {
  // const sharedStore = useSharedStore()

  const { firestore } = useFirebase()

  const allLikes: Ref<LikeModel[]> = ref([])
  const allDislikes: Ref<DislikeModel[]> = ref([])

  const likesCollection = collection(firestore, 'likes')
  const dislikesCollection = collection(firestore, 'dislikes')

  const getAllLikes = async () => {
    const querySnapshot = await getDocs(likesCollection)
    const articlesData = querySnapshot.docs.map(mapLike)
    allLikes.value = articlesData
  }

  const getAllDislikes = async () => {
    const querySnapshot = await getDocs(dislikesCollection)
    const articlesData = querySnapshot.docs.map(mapDislike)
    allDislikes.value = articlesData
  }

  const addLike = async (newLike: LikeModel) => {
    await addDoc(likesCollection, newLike.toMap())
    allLikes.value.push(newLike)
  }

  return {
    allLikes,
    getAllLikes,
    getAllDislikes,
    addLike,
  }
})

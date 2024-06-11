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
import { useUploadImageStore } from './uploadImageStore'
import type { EventModel } from '~/models/event'
import { mapEvent } from '~/models/event'
import { useSharedStore } from '~/stores/sharedStore'

export const useEventsStore = defineStore('events', () => {
  const events: Ref<EventModel[]> = ref([])
  const userEvents: Ref<EventModel[]> = ref([])

  const sharedStore = useSharedStore()
  const uploadImageStore = useUploadImageStore()

  const { firestore } = useFirebase()
  const eventsCollection = collection(firestore, 'events')

  const addEvent = async (newEvent: EventModel) => {
    sharedStore.init()

    const onSuccess = () => {
      userEvents.value = [...userEvents.value, newEvent]
      sharedStore.success()
    }

    const imageUrl = (await uploadImageStore.createAndUploadEventPhoto(newEvent.photo)).imageUrl
    newEvent.photo = imageUrl

    await addDoc(eventsCollection, newEvent.toMap())
      .then(onSuccess)
      .catch(sharedStore.failureSnackbar)
  }

  const editEvent = async (editEvent: EventModel) => {
    sharedStore.init()

    const onSuccess = () => {
      userEvents.value = [...userEvents.value, editEvent]
      sharedStore.success()
    }

    if (editEvent.reference) {
      await updateDoc(editEvent.reference, editEvent.toMap())
        .then(onSuccess)
        .catch(sharedStore.failureSnackbar)
    }
    else { sharedStore.failure({ code: String('Wrong event') }) }
  }

  const getFutureEvents = async () => {
    sharedStore.init()

    const onSuccess = (data: QuerySnapshot) => {
      events.value = data.docs.map(mapEvent)
      sharedStore.success()
    }

    getDocs(query(eventsCollection, where('endDate', '>', new Date())))
      .then(onSuccess)
      .catch(sharedStore.failureSnackbar)
  }

  const getUserEvents = async (userRef: DocumentReference) => {
    sharedStore.init()

    const onSuccess = (data: QuerySnapshot) => {
      userEvents.value = data.docs.map(mapEvent)
      sharedStore.success()
    }

    getDocs(query(eventsCollection, where('createdBy', '==', userRef), where('endDate', '>', new Date())))
      .then(onSuccess)
      .catch(sharedStore.failureSnackbar)
  }

  return {
    events,
    userEvents,
    addEvent,
    editEvent,
    getUserEvents,
    getFutureEvents,
  }
})

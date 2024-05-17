import {EventModel, mapEvent} from "~/models/event";
import {useSharedStore} from "~/stores/sharedStore";
import {addDoc, collection, DocumentReference, getDocs, QuerySnapshot, where, query} from 'firebase/firestore';
import type {Ref} from "vue";

export const useEventsStore = defineStore("events", () => {
    const events: Ref<EventModel[]> = ref([])
    const userEvents: Ref<EventModel[]> = ref([])

    const sharedStore = useSharedStore()

    const { firestore } = useFirebase()
    const eventsCollection = collection(firestore, 'events')

    const addEvent = async (newEvent: EventModel) => {
        sharedStore.init()
        await addDoc(eventsCollection, newEvent.toMap())
            .then(sharedStore.successSnackbar)
            .catch(sharedStore.failureSnackbar)
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

        getDocs(query(eventsCollection,
            where('createdBy', '==', userRef),
            where('endDate', '>', new Date())))
            .then(onSuccess)
            .catch(sharedStore.failureSnackbar)
    }

    return {
        events,
        userEvents,
        addEvent,
        getUserEvents,
        getFutureEvents,
    }
})
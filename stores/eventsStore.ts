import {EventModel, mapEvent} from "~/models/event";
import {useSharedStore} from "~/stores/sharedStore";
import {
    addDoc,
    collection,
    DocumentReference,
    getDocs,
    QuerySnapshot,
    where,
    query,
    updateDoc
} from 'firebase/firestore';
import type {Ref} from "vue";

export const useEventsStore = defineStore("events", () => {
    const events: Ref<EventModel[]> = ref([])
    const userEvents: Ref<EventModel[]> = ref([])

    const sharedStore = useSharedStore()

    const { firestore } = useFirebase()
    const eventsCollection = collection(firestore, 'events')

    const addEvent = async (newEvent: EventModel) => {
        sharedStore.init()

        const onSuccess = () => {
            userEvents.value = [...userEvents.value, newEvent]
            sharedStore.success()
        }

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

        if (editEvent.reference)
            await updateDoc(editEvent.reference, editEvent.toMap())
                .then(onSuccess)
                .catch(sharedStore.failureSnackbar)
        else
            sharedStore.failure({code: String("Wrong event")})
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
        editEvent,
        getUserEvents,
        getFutureEvents,
    }
})
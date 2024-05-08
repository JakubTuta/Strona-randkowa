import type {EventModel} from "~/models/event";
import {useSharedStore} from "~/stores/sharedStore";
import {addDoc, collection} from 'firebase/firestore';
import type {Ref} from "vue";

export const useEventsStore = defineStore("events", () => {
    const events: Ref<EventModel[]> = ref([])

    const sharedStore = useSharedStore()

    const { firestore } = useFirebase()
    const eventsCollection = collection(firestore, 'events')

    const addEvent = async (newEvent: EventModel) => {
        sharedStore.init()
        await addDoc(eventsCollection, newEvent.toMap()).then(sharedStore.successSnackbar).catch(sharedStore.failureSnackbar)
    }

    return {
        events,
        addEvent,
    }
})
import dataclasses

from google.cloud import firestore


@dataclasses.dataclass(order=False, frozen=True)
class Like:
    who_liked: firestore.DocumentReference = None
    liked_profile: firestore.DocumentReference = None

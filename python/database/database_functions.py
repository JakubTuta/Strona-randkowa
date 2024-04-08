import typing

from google.cloud import firestore

from .database_init import firestore_client as fc

users_collection = fc.collection("users")


def getUserDoc(reference: typing.Optional[firestore.DocumentReference]):
    pass

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from src.models.user import UserModel

from .database_init import collections


def get_user_data(reference: firestore.DocumentReference) -> UserModel:
    document = reference.get()

    user = UserModel.from_dict({**document.to_dict(), "reference": document.reference})

    return user


def get_reference_from_id(doc_id: str) -> firestore.DocumentReference:
    doc_ref = collections["users"].document(doc_id)

    return doc_ref


def add_verified_image(user_data: UserModel):
    current_verified_images = user_data.verifiedImages

    update_data = {"verifiedImages": current_verified_images + 1}

    user_data.reference.update(update_data)

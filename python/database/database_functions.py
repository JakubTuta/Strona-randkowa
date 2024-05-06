import typing

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from models.user import UserModel

from .database_init import firestore_client as fc

collection_users = fc.collection("users")


def get_user(
    reference: typing.Optional[firestore.DocumentReference],
) -> typing.Optional[UserModel]:
    if not reference:
        return None

    document = reference.get()
    user = UserModel(**document.to_dict(), reference=document.reference)

    return user


def get_user_data(reference: firestore.DocumentReference) -> UserModel:
    document_data = reference.get()

    user = UserModel(**document_data.to_dict(), reference=document_data.reference)

    return user


def get_all_users() -> typing.List[firestore.DocumentReference]:
    docs = collection_users.stream()

    users = [UserModel(**doc.to_dict(), reference=doc.reference) for doc in docs]

    return users


def get_other_users(user: UserModel) -> typing.List[firestore.DocumentReference]:
    query = collection_users.where(filter=FieldFilter("__name__", "!=", user.reference))
    docs = query.stream()

    users = [UserModel(**doc.to_dict(), reference=doc.reference) for doc in docs]

    return users


def get_reference_from_id(doc_id: str) -> firestore.DocumentReference:
    doc_ref = collection_users.document(doc_id)

    return doc_ref

import typing

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from models.user import UserModel

from .database_init import firestore_client as fc

collection_users = fc.collection("users")


# def ignore_warnings(function):
#     def wrapper(*args, **kwargs):
#         with warnings.catch_warnings():
#             warnings.simplefilter("ignore")
#             reference = args[0]
#             result = function(reference)
#             return result

#     return wrapper


def get_user(
    reference: typing.Optional[firestore.DocumentReference],
) -> typing.Optional[UserModel]:
    if not reference:
        return None

    document = reference.get()
    user = UserModel(document.to_dict(), document.reference)

    return user


def get_all_users() -> typing.List[firestore.DocumentReference]:
    docs = collection_users.stream()

    users = [UserModel(doc.to_dict(), doc.reference) for doc in docs]

    return users


def get_other_users(
    user_ref: firestore.DocumentReference,
) -> typing.List[firestore.DocumentReference]:
    user_doc = user_ref.get()
    user = UserModel(user_doc.to_dict(), user_doc.reference)

    query = collection_users.where(
        filter=FieldFilter("gender", "==", user.preferred_gender)
    )
    docs = query.stream()

    users = [UserModel(doc.to_dict(), doc.reference) for doc in docs]

    return users


def get_reference_from_id(doc_id: str) -> firestore.DocumentReference:
    doc_ref = collection_users.document(doc_id)

    return doc_ref

import typing
import warnings

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from ..models.user import UserModel
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


def get_user_doc(
    reference: typing.Optional[firestore.DocumentReference],
) -> typing.Optional[UserModel]:
    if not reference:
        return None

    # document = reference.get()
    # user = UserModel(document.to_dict(), document.reference)
    # return user

    doc_ref = collection_users.document("pierwszy")
    document = doc_ref.get()
    user = UserModel(document.to_dict(), document.reference)
    return user


def get_all_users() -> typing.List[firestore.DocumentReference]:
    # query = collection_users.where(filter=FieldFilter("name", "!=", ""))
    # docs = query.stream()

    docs = collection_users.stream()

    users = [UserModel(doc.to_dict(), doc.id) for doc in docs]

    return users


# print(get_user_doc("pierwszy"))
print(get_all_users())

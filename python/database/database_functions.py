import typing

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from models.like import LikeModel
from models.user import UserModel

from .database_init import firestore_client as fc

collection_users = fc.collection("users")
collection_likes = fc.collection("likes")


def get_user(
    reference: typing.Optional[firestore.DocumentReference],
) -> typing.Optional[UserModel]:
    if not reference:
        return None

    document = reference.get()

    user = UserModel.from_dict({**document.to_dict(), "reference": document.reference})

    return user


def get_user_data(reference: firestore.DocumentReference) -> UserModel:
    document = reference.get()

    user = UserModel.from_dict({**document.to_dict(), "reference": document.reference})

    return user


def get_all_users() -> typing.List[firestore.DocumentReference]:
    docs = collection_users.stream()

    users = [
        UserModel.from_dict({**doc.to_dict(), "reference": doc.reference})
        for doc in docs
    ]

    return users


def get_other_users(user: UserModel) -> typing.List[firestore.DocumentReference]:
    query = collection_users.where(
        filter=FieldFilter(
            "__name__", "not-in", [user.reference, *user.blockedProfiles]
        )
    )

    if user.lookingFor == "relationship":
        query = query.where(filter=FieldFilter("gender", "==", user.preferredGender))

    docs = query.stream()

    users = [
        UserModel.from_dict({**doc.to_dict(), "reference": doc.reference})
        for doc in docs
    ]

    return users


def get_reference_from_id(doc_id: str) -> firestore.DocumentReference:
    doc_ref = collection_users.document(doc_id)

    return doc_ref


def get_likes_for_user(
    user_ref: firestore.DocumentReference,
) -> typing.Iterable[LikeModel]:
    query = collection_likes.where(filter=FieldFilter("likedProfile", "==", user_ref))
    docs = query.stream()

    likes = [
        LikeModel.from_dict({**doc.to_dict(), "reference": doc.reference})
        for doc in docs
    ]

    return likes


def check_if_other_likes_user(
    user_ref: firestore.DocumentReference, other_ref: firestore.DocumentReference
) -> bool:
    query = collection_likes.where(
        filter=FieldFilter("whoLiked", "==", other_ref)
    ).where(filter=FieldFilter("likedProfile", "==", user_ref))
    docs = query.stream()

    is_like = len(list(docs)) > 0

    return is_like

import datetime
import typing

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from src.models.like import LikeModel
from src.models.user import UserModel

from .database_init import collections


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
    docs = collections["users"].stream()

    users = [
        UserModel.from_dict({**doc.to_dict(), "reference": doc.reference})
        for doc in docs
    ]

    return users


def get_other_users(user: UserModel) -> typing.List[firestore.DocumentReference]:
    query = collections["users"].where(
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
    doc_ref = collections["users"].document(doc_id)

    return doc_ref


def get_likes_for_user(
    user_ref: firestore.DocumentReference,
) -> typing.Iterable[LikeModel]:
    query = collections["likes"].where(
        filter=FieldFilter("likedProfile", "==", user_ref)
    )
    docs = query.stream()

    likes = [
        LikeModel.from_dict({**doc.to_dict(), "reference": doc.reference})
        for doc in docs
    ]

    return likes


def check_if_other_likes_user(
    user_ref: firestore.DocumentReference, other_ref: firestore.DocumentReference
) -> bool:
    query = (
        collections["likes"]
        .where(filter=FieldFilter("whoLiked", "==", other_ref))
        .where(filter=FieldFilter("likedProfile", "==", user_ref))
    )
    docs = query.stream()

    is_like = len(list(docs)) > 0

    return is_like


def delete_older_dislikes():
    cutout_date = datetime.datetime.now() - datetime.timedelta(weeks=1)

    query = collections["dislikes"].where("date", "<", cutout_date)

    docs = query.stream()

    for doc in docs:
        doc.reference.delete()


def add_verified_image(user_data: UserModel):
    current_verified_images = user_data.verifiedImages

    update_data = {"verifiedImages": current_verified_images + 1}

    user_data.reference.update(update_data)

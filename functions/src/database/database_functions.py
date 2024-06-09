import datetime
import typing

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from src.models.dislike import DislikeModel
from src.models.like import LikeModel
from src.models.user import UserModel

from .database_init import collections


def get_user_data(
    reference: typing.Optional[firestore.DocumentReference],
) -> typing.Optional[UserModel]:
    if not reference:
        return None

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
            "__name__", "not-in", [user.reference, *user.blockedProfiles, *user.matches]
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
) -> typing.Optional[LikeModel]:
    query = (
        collections["likes"]
        .where(filter=FieldFilter("whoLiked", "==", other_ref))
        .where(filter=FieldFilter("likedProfile", "==", user_ref))
    )
    docs = list(query.stream())

    if len(docs):
        like_model = LikeModel.from_dict(
            {**docs[0].to_dict(), "reference": docs[0].reference}
        )

        return like_model


def delete_older_dislikes():
    cutout_date = datetime.datetime.now() - datetime.timedelta(weeks=1)

    query = collections["dislikes"].where("date", "<", cutout_date)

    docs = query.stream()

    for doc in docs:
        doc.reference.delete()


def delete_older_likes():
    cutout_date = datetime.datetime.now() - datetime.timedelta(weeks=1)

    query = collections["likes"].where("date", "<", cutout_date)

    docs = query.stream()

    for doc in docs:
        doc.reference.delete()


def add_new_like(
    user_ref: firestore.DocumentReference, other_ref: firestore.DocumentReference
):
    like_data = {
        "whoLiked": user_ref,
        "likedProfile": other_ref,
        "date": datetime.datetime.now(),
    }

    collections["likes"].add(like_data)


def get_user_likes(user_ref: firestore.DocumentReference) -> typing.List[LikeModel]:
    query = collections["likes"].where("whoLiked", "==", user_ref)

    docs = query.stream()

    likes = [
        LikeModel.from_dict({**doc.to_dict(), "reference": doc.reference})
        for doc in docs
    ]

    return likes


def get_user_dislikes(
    user_ref: firestore.DocumentReference,
) -> typing.List[DislikeModel]:
    query = collections["dislikes"].where("whoDisliked", "==", user_ref)

    docs = query.stream()

    dislikes = [
        DislikeModel.from_dict({**doc.to_dict(), "reference": doc.reference})
        for doc in docs
    ]

    return dislikes


def get_filtered_users(
    users: typing.List[UserModel],
    user_likes: typing.List[LikeModel],
    user_dislikes: typing.List[DislikeModel],
):
    user_likes_id = map(lambda user: user.likedProfile.id, user_likes)
    user_dislikes_id = map(lambda user: user.dislikedProfile.id, user_dislikes)

    filtered_users = filter(
        lambda user: user.reference.id not in user_likes_id
        and user.reference.id not in user_dislikes_id,
        users,
    )

    return filtered_users

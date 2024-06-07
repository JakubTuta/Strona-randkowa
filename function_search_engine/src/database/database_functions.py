import typing

from google.cloud import firestore
from src.models.user import UserModel

from .database_init import collections


def get_all_users() -> typing.List[firestore.DocumentReference]:
    docs = collections["users"].stream()

    users = [
        UserModel.from_dict({**doc.to_dict(), "reference": doc.reference})
        for doc in docs
    ]

    return users

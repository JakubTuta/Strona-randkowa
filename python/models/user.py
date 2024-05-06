import dataclasses
import datetime
import typing

from google.cloud import firestore


@dataclasses.dataclass(kw_only=True, frozen=True)
class UserModel:
    userName: str = ""
    photos: typing.List[str] = dataclasses.field(
        default_factory=list, compare=False, hash=False, repr=False
    )
    firstName: str = ""
    faculty: str = ""
    lastName: str = ""
    dateBirth: datetime.datetime = datetime.datetime.now()
    gender: str = ""
    index: int = 0
    role: str = ""
    score: float = 0
    elo: int = 0
    preferredGender: str = ""
    lookingFor: str = ""
    blockedProfiles: typing.List[firestore.DocumentReference] = dataclasses.field(
        default_factory=list, compare=False, hash=False, repr=False
    )
    hobbies: typing.List[str] = dataclasses.field(default_factory=list)

    reference: firestore.DocumentReference = dataclasses.field(
        default=None, compare=False, hash=False, repr=False
    )

    def to_map(self):
        data = dataclasses.asdict(self)
        del data["reference"]

        return data

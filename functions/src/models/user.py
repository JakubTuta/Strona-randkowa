import dataclasses
import datetime
import inspect
import typing

from google.cloud import firestore


@dataclasses.dataclass(kw_only=True, frozen=True)
class UserModel:
    photos: typing.List[str] = dataclasses.field(
        default_factory=list, compare=False, hash=False, repr=False
    )
    firstName: str = ""
    email: str = ""
    faculty: str = ""
    fieldOfStudy: str = ""
    lastName: str = ""
    dateBirth: datetime.datetime = datetime.datetime.now()
    gender: str = ""
    index: int = 0
    role: str = ""
    score: float = 0
    elo: int = 0
    preferredGender: str = ""
    lookingFor: str = ""
    description: str = ""
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

    @classmethod
    def from_dict(cls, data):
        return cls(
            **{
                key: value
                for key, value in data.items()
                if key in inspect.signature(cls).parameters
            }
        )

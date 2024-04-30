import dataclasses
import typing

from google.cloud import firestore


@dataclasses.dataclass
class UserModel:
    user_name: str = ""
    photos: typing.List[str] = dataclasses.field(default_factory=list, repr=False)
    first_name: str = ""
    faculty: str = ""
    last_name: str = ""
    date_birth: str = ""
    gender: str = ""
    index: int = 0
    role: str = ""
    score: float = 0
    elo: int = 0
    preferred_gender: str = ""
    looking_for: str = ""
    blocked_profiles: typing.List[firestore.DocumentReference] = dataclasses.field(
        default_factory=list, compare=False, hash=False, repr=False
    )
    hobbies: typing.List[str] = dataclasses.field(default_factory=list)

    reference: firestore.DocumentReference = dataclasses.field(
        default=None, compare=False, hash=False, repr=False
    )

    def __init__(self, data, reference):
        for key, value in data.items():
            setattr(self, key, value)
        setattr(self, "reference", reference)

    def to_map(self):
        data = dataclasses.asdict(self)
        del data["reference"]

        return data

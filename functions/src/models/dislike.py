import dataclasses
import datetime
import inspect
import typing

from google.cloud import firestore


@dataclasses.dataclass(kw_only=True, frozen=True, repr=False)
class DislikeModel:
    whoDisliked: typing.Optional[firestore.DocumentReference] = None
    dislikedProfile: typing.Optional[firestore.DocumentReference] = None
    date: datetime.datetime = datetime.datetime.now()

    reference: typing.Optional[firestore.DocumentReference] = None

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

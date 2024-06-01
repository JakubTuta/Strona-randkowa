import dataclasses
import inspect
import typing

from google.cloud import firestore


@dataclasses.dataclass(kw_only=True, frozen=True, repr=False)
class LikeModel:
    whoLiked: typing.Optional[firestore.DocumentReference] = None
    likedProfile: typing.Optional[firestore.DocumentReference] = None

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

import dataclasses
import datetime
import typing

from google.cloud import firestore


@dataclasses.dataclass
class CommentModel:
    content: str = ""
    from_user: firestore.DocumentReference = None
    date: datetime.datetime = datetime.datetime.now()

    reference: typing.Optional[firestore.DocumentReference]

    def to_map(self):
        data = dataclasses.asdict(self)
        del data["reference"]

        return data

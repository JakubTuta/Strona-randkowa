import dataclasses
import datetime
import typing

from google.cloud import firestore

from .comment import CommentModel


@dataclasses.dataclass(kw_only=True)
class EventModel:
    name: str = ""
    photo: str = ""
    start_date: datetime.datetime = datetime.datetime.now()
    end_date: datetime.datetime = datetime.datetime.now()
    createdBy: firestore.DocumentReference = None
    comments: typing.List[CommentModel] = dataclasses.field(default_factory=list)

    reference: typing.Optional[firestore.DocumentReference]

    def to_map(self):
        data = dataclasses.asdict(self)
        del data["reference"]

        return data

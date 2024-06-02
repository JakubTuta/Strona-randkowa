# https://firebase.google.com/docs/functions/organize-functions?gen=2nd#python

import datetime
import io
import pathlib

import numpy as np
import src.database.database_functions as db_functions
import src.database.database_init as db_init
import src.FacialRecognition as FacialRecognition
from firebase_admin import storage
from firebase_functions import storage_fn
from PIL import Image

db_init.initialize_app()


def get_image_from_bucket(bucket, image_path):
    image_blob = bucket.blob(str(image_path))
    image_bytes = image_blob.download_as_bytes()
    image = Image.open(io.BytesIO(image_bytes))

    numpy_image = np.array(image)[..., :3]

    return numpy_image


def compare_image_with_user(user_data, facial_recognition_result):
    user_birth = user_data.dateBirth.replace(tzinfo=datetime.timezone.utc)
    current_time = datetime.datetime.now(datetime.timezone.utc)
    difference_in_days = (current_time - user_birth).days

    user_age = int(difference_in_days / 365)
    user_gender = user_data.gender

    predicted_age = facial_recognition_result["age"]
    predicted_gender = facial_recognition_result["dominant_gender"]

    return user_gender == predicted_gender and -5 <= predicted_age - user_age <= 5


@storage_fn.on_object_finalized(
    region="europe-central2", bucket="strona-randkowa.appspot.com", memory=512
)
def facial_recognition(event: storage_fn.CloudEvent[storage_fn.StorageObjectData]):
    content_type = event.data.content_type

    if not content_type or not content_type.startswith("image/"):
        return

    bucket_name = event.data.bucket
    bucket = storage.bucket(bucket_name)
    file_path = pathlib.PurePath(event.data.name)

    user_reference_id = str(file_path).split("\\")[0]
    user_reference = db_functions.get_reference_from_id(user_reference_id)
    user_data = db_functions.get_user_data(user_reference)

    image = get_image_from_bucket(bucket, file_path)

    facial_recognition_result = FacialRecognition.is_human_in_image(image)

    if not facial_recognition_result:
        return

    is_same_user = compare_image_with_user(user_data, facial_recognition_result)

    if is_same_user:
        db_functions.add_verified_image(user_data)

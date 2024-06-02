# https://firebase.google.com/docs/functions/organize-functions?gen=2nd#python

import datetime
import io
import json
import pathlib

import numpy as np
import src.database.database_functions as db_functions
import src.database.database_init as db_init
import src.FacialRecognition as FacialRecognition
from firebase_admin import storage
from firebase_functions import https_fn, options, scheduler_fn, storage_fn
from PIL import Image
from src.RecommendationAlgorithm import RecommendationAlgorithm

db_init.initialize_app()

cors_options = options.CorsOptions(
    cors_methods=["POST", "OPTIONS"],
    cors_origins="*",
)


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


@https_fn.on_request(region="europe-central2", cors=cors_options, memory=1024)
def get_matches(req: https_fn.Request) -> https_fn.Response:
    if req.method.lower() != "post":
        return https_fn.Response("", 200)

    try:
        data = req.get_json(force=True)

        user_reference_id = data["reference_id"]
        max_users = data.get("max_users", 1000)

    except KeyError:
        return https_fn.Response(
            json.dumps({"Error": "Nie podano reference_id"}),
            status=400,
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"Error": str(e)}),
            status=400,
        )

    user_reference = db_functions.get_reference_from_id(user_reference_id)
    user_data = db_functions.get_user_data(user_reference)

    other_users = db_functions.get_other_users(user_data)
    ranked_users = RecommendationAlgorithm.score_all_users(user_data, other_users)

    users_references_ids = [user.reference.id for user in ranked_users]
    users_references_ids = users_references_ids[:max_users]

    return https_fn.Response(
        json.dumps(users_references_ids),
        status=200,
    )


@scheduler_fn.on_schedule(
    region="europe-central2", schedule="every day 00:00", memory=1024
)
def delete_old_dislikes(event: scheduler_fn.ScheduledEvent) -> None:
    db_functions.delete_older_dislikes()


@storage_fn.on_object_finalized(
    region="europe-central2", bucket="strona-randkowa.appspot.com", memory=1024
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

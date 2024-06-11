import json

import src.database.database_functions as db_functions
import src.database.database_init as db_init
from firebase_functions import firestore_fn, https_fn, options, scheduler_fn
from src.RecommendationAlgorithm import RecommendationAlgorithm

db_init.initialize_app()

cors_options = options.CorsOptions(
    cors_methods=["POST", "OPTIONS"],
    cors_origins="*",
)


@https_fn.on_request(region="europe-central2", cors=cors_options)
def get_matches(req: https_fn.Request) -> https_fn.Response:
    try:
        data = req.get_json(force=True)

        user_reference_id = data["reference_id"]
        max_users = data.get("max_users", 1000)

    except Exception as e:
        return https_fn.Response(
            json.dumps({"Error": str(e)}),
            status=400,
        )

    user_reference = db_functions.get_reference_from_id(user_reference_id)
    user_data = db_functions.get_user_data(user_reference)

    user_likes = db_functions.get_user_likes(user_reference)
    user_dislikes = db_functions.get_user_dislikes(user_reference)

    other_users = db_functions.get_other_users(user_data)
    filtered_users = db_functions.get_filtered_users(
        other_users, user_likes, user_dislikes
    )

    ranked_users = RecommendationAlgorithm.score_all_users(user_data, filtered_users)

    users_references_ids = [user.reference.id for user in ranked_users]
    users_references_ids = users_references_ids[:max_users]

    return https_fn.Response(
        json.dumps(users_references_ids),
        status=200,
    )


@https_fn.on_request(region="europe-central2", cors=cors_options)
def is_match(req: https_fn.Request) -> https_fn.Response:
    try:
        data = req.get_json(force=True)

        user_id = data["whoLiked"]
        other_id = data["likedProfile"]

    except Exception as e:
        return https_fn.Response(
            json.dumps({"Error": str(e)}),
            status=400,
        )

    user_reference = db_functions.get_reference_from_id(user_id)
    other_reference = db_functions.get_reference_from_id(other_id)

    like_model = db_functions.check_if_other_likes_user(user_reference, other_reference)

    if not like_model:
        db_functions.add_new_like(user_reference, other_reference)

        return https_fn.Response(json.dumps({"is_match": False}), 200)

    like_model.reference.delete()

    user_data = db_functions.get_user_data(user_reference)
    other_data = db_functions.get_user_data(other_reference)

    user_data_new_matches = {"matches": [*user_data.matches, other_reference]}
    other_data_new_matches = {"matches": [*other_data.matches, user_reference]}

    user_reference.update(user_data_new_matches)
    other_reference.update(other_data_new_matches)

    return https_fn.Response(json.dumps({"is_match": True}), 200)


@https_fn.on_request(region="europe-central2", cors=cors_options)
def add_score(req: https_fn.Request) -> https_fn.Response:
    try:
        data = req.get_json(force=True)

        who_scored_id = data["whoScoredId"]
        scored_profile_id = data["scoredProfileId"]
        score = data["score"]

    except Exception as e:
        return https_fn.Response(
            json.dumps({"Error": str(e)}),
            status=400,
        )

    who_scored_reference = db_functions.get_reference_from_id(who_scored_id)

    scored_profile_reference = db_functions.get_reference_from_id(scored_profile_id)
    scored_profile_data = db_functions.get_user_data(scored_profile_reference)

    if db_functions.has_reference_scored(scored_profile_data, who_scored_reference):
        return https_fn.Response("User has already scored", status=200)

    db_functions.add_new_score(scored_profile_data, who_scored_reference, score)

    return https_fn.Response("ok", status=200)


@scheduler_fn.on_schedule(
    region="europe-central2", schedule="every day 00:00", memory=128
)
def delete_old_dislikes(event: scheduler_fn.ScheduledEvent) -> None:
    db_functions.delete_older_dislikes()


@scheduler_fn.on_schedule(
    region="europe-central2", schedule="every day 00:00", memory=128
)
def delete_old_likes(event: scheduler_fn.ScheduledEvent) -> None:
    db_functions.delete_older_likes()


@firestore_fn.on_document_created(region="europe-central2", document="likes/{likeId}")
def on_like_create(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]) -> None:
    document_data = event.data.to_dict()

    liked_profile = document_data["likedProfile"]
    profile_data = db_functions.get_user_data(liked_profile)

    new_elo = profile_data.elo + 10
    if new_elo > 2000:
        new_elo = 2000

    update_data = {
        "elo": new_elo,
    }

    liked_profile.update(update_data)


@firestore_fn.on_document_created(
    region="europe-central2", document="dislikes/{dislikeId}"
)
def on_dislike_create(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]) -> None:
    document_data = event.data.to_dict()

    disliked_profile = document_data["dislikedProfile"]
    profile_data = db_functions.get_user_data(disliked_profile)

    new_elo = profile_data.elo - 10
    if new_elo < 500:
        new_elo = 500

    update_data = {
        "elo": new_elo,
    }

    disliked_profile.update(update_data)

import json

import src.database.database_functions as db_functions
import src.database.database_init as db_init
from firebase_functions import https_fn, options, scheduler_fn
from src.RecommendationAlgorithm import RecommendationAlgorithm

db_init.initialize_app()

cors_options = options.CorsOptions(
    cors_methods=["POST", "OPTIONS"],
    cors_origins="*",
)


@https_fn.on_request(region="europe-central2", cors=cors_options)
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
    region="europe-central2", schedule="every day 00:00", memory=128
)
def delete_old_dislikes(event: scheduler_fn.ScheduledEvent) -> None:
    db_functions.delete_older_dislikes()

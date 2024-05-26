import src.database.database_functions as db_functions
import src.database.database_init as db_init
import src.RecommendationAlgorithm as RecommendationAlgorithm
from firebase_functions import https_fn

db_init.initialize_app()


@https_fn.on_request(region="europe-central2")
def get_matches(req: https_fn.Request) -> https_fn.Response:
    try:
        data = req.json()

        user_reference_id = data["reference_id"]
        max_users = data.get("max_users", 1000)

    except KeyError:
        return https_fn.Response("Nie podano reference_id", status=400)

    except Exception as e:
        print(e)
        return https_fn.Response(f"Error:\n{str(e)}", status=400)

    user_reference = db_functions.get_reference_from_id(user_reference_id)
    user_data = db_functions.get_user_data(user_reference)

    other_users = db_functions.get_other_users(user_data)
    ranked_users = RecommendationAlgorithm.score_all_users(user_data, other_users)

    users_references_ids = [user.reference.id for user in ranked_users]
    users_references_ids = users_references_ids[:max_users]

    return https_fn.Response(users_references_ids, status=200)

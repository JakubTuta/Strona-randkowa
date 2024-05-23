import database.database_functions as db_functions
import database.database_init as db_init
import FaceRecognitionAlgorithm
import flask
import flask_cors
import numpy as np
from RecommendationAlgorithm import RecommendationAlgorithm

app = flask.Flask(__name__)
flask_cors.CORS(
    app,
    origins=[
        "http://localhost:3000",
        "https://strona-randkowa.web.app",
        "https://strona-randkowa.firebaseapp.com",
    ],
)


@app.route("/matches-api", methods=["POST"])
def matches():
    try:
        data = flask.request.get_json(force=True)

        user_reference_id = data["reference_id"]
        max_users = data.get("max_users", 1000)

    except KeyError:
        return flask.jsonify({"error": "Nie podano reference_id"}), 400

    except Exception as e:
        print(e)
        return flask.jsonify({"error": str(e)}), 400

    user_reference = db_functions.get_reference_from_id(user_reference_id)
    user_data = db_functions.get_user_data(user_reference)

    other_users = db_functions.get_other_users(user_data)
    ranked_users = RecommendationAlgorithm.score_all_users(user_data, other_users)

    users_references_ids = [user.reference.id for user in ranked_users]
    users_references_ids = users_references_ids[:max_users]

    return flask.jsonify(users_references_ids), 200


@app.route("/verify-image", methods=["POST"])
def verify_image():
    try:
        data = flask.request.get_json(force=True)

        image_url = data["image_url"]

    except KeyError:
        return flask.jsonify({"error": "Nie podano image_url"}), 400

    except Exception as e:
        print(e)
        return flask.jsonify({"error": str(e)}), 400

    blob = db_init.storage_bucket(image_url)
    image = np.frombuffer(blob.download_as_string(), np.uint8)

    print(image)

    print(FaceRecognitionAlgorithm.analyze_image(image))


if __name__ == "__main__":
    app.run(port=2137, debug=True)

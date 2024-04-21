import database.database_functions as db_functions
import flask
import flask_cors

app = flask.Flask(__name__)
flask_cors.CORS(app)


@app.route("/matches-api", methods=["POST"])
def matches():
    try:
        data = flask.request.get_json(force=True)

        user_reference_id = data["reference_id"]

    except KeyError:
        return flask.jsonify({"error": "Nie podano reference_id"}), 400

    except Exception as e:
        print(e)
        return flask.jsonify({"error": str(e)}), 400

    user_reference = db_functions.get_reference_from_id(user_reference_id)
    users = db_functions.get_other_users(user_reference)
    users_references_ids = [user.reference.id for user in users]

    return flask.jsonify(users_references_ids), 200


if __name__ == "__main__":
    app.run(port=2137, debug=True)

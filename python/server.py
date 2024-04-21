import database.database_functions as db_functions
import flask

app = flask.Flask(__name__)


@app.route("/matches_api", methods=["POST"])
def matches():
    try:
        data = flask.request.get_json(force=True)

        user_reference = data["reference"]
    except Exception as e:
        print(e)
        return flask.Response(flask.jsonify({"error": str(e)}), 400)

    users = db_functions.get_other_users(user_reference)
    users_references = [user["reference"] for user in users]

    return flask.Response(flask.jsonify(users_references), 200)


if __name__ == "__main__":
    app.run(port=2137, debug=True)

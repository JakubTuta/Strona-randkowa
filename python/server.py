# import flask

# app = flask.Flask(__name__)


# @app.route("/")
# def index():
#     pass


# if __name__ == "__main__":
#     app.run(port=2137)

import database.database_functions as db_functions

# db_functions.get_all_users()
user_ref = db_functions.get_reference_from_id("pierwszy")
user = db_functions.get_user(user_ref)

print(user)

import firebase_admin
from firebase_functions import https_fn

firebase_admin.initialize_app()


@https_fn.on_request(region="europe-central2")
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello world!")

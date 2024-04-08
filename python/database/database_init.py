import json
import os

import dotenv
import firebase_admin

dotenv.load_dotenv()

config = {
    "type": os.getenv("type"),
    "project_id": os.getenv("project_id"),
    "private_key_id": os.getenv("private_key_id"),
    "private_key": os.getenv("private_key").replace(r"\n", "\n"),
    "client_email": os.getenv("client_email"),
    "client_id": os.getenv("client_id"),
    "auth_uri": os.getenv("auth_uri"),
    "token_uri": os.getenv("token_uri"),
    "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
    "client_x509_cert_url": os.getenv("client_x509_cert_url"),
    "universe_domain": os.getenv("universe_domain"),
}

credentials_file = "python/firebase_credentials.json"

with open(credentials_file, "w") as file:
    file.write(json.dumps(config, indent=2))

credentials = firebase_admin.credentials.Certificate(credentials_file)
firebase_admin.initialize_app(credentials)

firestore_client = firebase_admin.firestore.client()

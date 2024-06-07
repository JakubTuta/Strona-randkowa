import src.database.database_functions as db_functions
import src.database.database_init as db_init
from firebase_functions import firestore_fn, https_fn, scheduler_fn
from src.models.user import UserModel
from src.SearchEngine import SearchEngine

db_init.initialize_app()


@scheduler_fn.on_schedule(
    region="europe-central2", schedule="every day 00:00", memory=128
)
def get_all_users(event: scheduler_fn.ScheduledEvent) -> None:
    users = db_functions.get_all_users()

    SearchEngine.build_trie(users)


@https_fn.on_call(region="europe-central2")
def search_engine(req: https_fn.CallableRequest):
    try:
        text = req.data["text"]

    except KeyError:
        return "Nie podano 'text'"

    except Exception as e:
        return f"Error1: {str(e)}"

    try:
        result = SearchEngine.search_user_in_trie(text)

        return result

    except Exception as e:
        return f"Error2: {str(e)}"


@firestore_fn.on_document_created(
    region="europe-central2", document="users/{userId}", memory=128
)
def on_user_create(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]) -> None:
    document_data = event.data.to_dict()
    document_reference = event.data.reference

    user = UserModel.from_dict({**document_data, "reference": document_reference})

    SearchEngine.add_user_to_trie(user)

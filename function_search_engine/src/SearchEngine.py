import typing

import pygtrie
from src.models.user import UserModel


class SearchEngine:
    trie = pygtrie.Trie()

    @staticmethod
    def build_trie(users: typing.List[UserModel]):
        SearchEngine.trie = pygtrie.Trie()

        for user in users:
            SearchEngine.trie[user.firstName.lower()] = user
            SearchEngine.trie[user.lastName.lower()] = user

    @staticmethod
    def add_user_to_trie(user: UserModel):
        SearchEngine.trie[user.firstName.lower()] = user
        SearchEngine.trie[user.lastName.lower()] = user

    @staticmethod
    def search_user_in_trie(text: str) -> typing.List[UserModel]:
        return [user for _, user in SearchEngine.trie.items(text.lower())]

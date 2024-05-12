import typing

import database.database_functions as db_functions
from models.user import UserModel


class RecommendationAlgorithm:
    # elo mieści się od 500 do 2000
    __ELO_SCORE = {
        "MIN_ORIGINAL_SCORE": 500,
        "MAX_ORIGINAL_SCORE": 2000,
        "MIN_NORMALIZED_SCORE": 0.0,
        "MAX_NORMALIZED_SCORE": 1.0,
    }

    # rating może być od 0 do 5
    __RATING_SCORE = {
        "MIN_ORIGINAL_SCORE": 0.0,
        "MAX_ORIGINAL_SCORE": 5.0,
        "MIN_NORMALIZED_SCORE": 0.0,
        "MAX_NORMALIZED_SCORE": 1.0,
    }

    # punkty z każdej kategorii mają się mieścić od 0 do 1
    __SCORING = {
        "IS_PREFERRED_GENDER": 1.0,
        "IS_PHOTO": 1.0,
        "IS_DESCRIPTION": 1.0,
        "IS_LIKE": 1.0,
    }

    __MAX_PHOTOS = 9

    @staticmethod
    def score_one_user(user: UserModel, other: UserModel) -> float:
        other_score = 0

        other_score += RecommendationAlgorithm.__calculate_preferred_gender(user, other)
        other_score += RecommendationAlgorithm.__calculate_elo_score(other)
        other_score += RecommendationAlgorithm.__calculate_rating_score(other)
        other_score += RecommendationAlgorithm.__check_if_is_photo(other)
        other_score += RecommendationAlgorithm.__check_if_is_description(other)
        other_score += RecommendationAlgorithm.__check_if_likes(user, other)

        return other_score

    @staticmethod
    def score_all_users(
        user: UserModel, others: typing.Iterable[UserModel]
    ) -> typing.Iterable[float]:
        ranking = [
            (
                other,
                RecommendationAlgorithm.score_one_user(user, other),
            )
            for other in others
        ]

        sorted_ranking = sorted(ranking, key=lambda item: item[1], reverse=True)
        sorted_users = [item[0] for item in sorted_ranking]

        return sorted_users

    @staticmethod
    def __calculate_preferred_gender(user: UserModel, other: UserModel) -> float:
        score = 0

        if user.lookingFor == "relationship":
            if user.preferredGender == other.gender:
                score += RecommendationAlgorithm.__SCORING["IS_PREFERRED_GENDER"]
            else:
                score -= RecommendationAlgorithm.__SCORING["IS_PREFERRED_GENDER"]

        return score

    @staticmethod
    def __calculate_elo_score(user: UserModel) -> float:
        user_elo = user.elo

        normalized_elo = (
            (user_elo - RecommendationAlgorithm.__ELO_SCORE["MIN_ORIGINAL_SCORE"])
            / (
                RecommendationAlgorithm.__ELO_SCORE["MAX_ORIGINAL_SCORE"]
                - RecommendationAlgorithm.__ELO_SCORE["MIN_ORIGINAL_SCORE"]
            )
        ) * (
            RecommendationAlgorithm.__ELO_SCORE["MAX_NORMALIZED_SCORE"]
            - RecommendationAlgorithm.__ELO_SCORE["MIN_NORMALIZED_SCORE"]
        )
        +RecommendationAlgorithm.__ELO_SCORE["MIN_NORMALIZED_SCORE"]

        return normalized_elo

    @staticmethod
    def __calculate_rating_score(user: UserModel) -> float:
        user_score = user.score

        normalized_score = (
            (user_score - RecommendationAlgorithm.__RATING_SCORE["MIN_ORIGINAL_SCORE"])
            / (
                RecommendationAlgorithm.__RATING_SCORE["MAX_ORIGINAL_SCORE"]
                - RecommendationAlgorithm.__RATING_SCORE["MIN_ORIGINAL_SCORE"]
            )
        ) * (
            RecommendationAlgorithm.__RATING_SCORE["MAX_NORMALIZED_SCORE"]
            - RecommendationAlgorithm.__RATING_SCORE["MIN_NORMALIZED_SCORE"]
        )
        +RecommendationAlgorithm.__RATING_SCORE["MIN_NORMALIZED_SCORE"]

        return normalized_score

    @staticmethod
    def __check_if_is_photo(user: UserModel) -> float:
        score = (
            len(user.photos) / RecommendationAlgorithm.__MAX_PHOTOS
        ) * RecommendationAlgorithm.__SCORING["IS_PHOTO"]

        return score

    @staticmethod
    def __check_if_is_description(user: UserModel) -> float:
        score = (len(user.description) > 0) * RecommendationAlgorithm.__SCORING[
            "IS_DESCRIPTION"
        ]

        return score

    @staticmethod
    def __check_if_likes(user: UserModel, other: UserModel) -> float:
        score = (
            db_functions.check_if_other_likes_user(user.reference, other.reference)
            * RecommendationAlgorithm.__SCORING["IS_LIKE"]
        )

        return score

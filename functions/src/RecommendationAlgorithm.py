import statistics
import typing

import src.database.database_functions as db_functions
from src.models.user import UserModel


class RecommendationAlgorithm:
    # elo może być od 0 do 2000
    __ELO_SCORE = {
        "MIN_ORIGINAL_SCORE": 500,
        "MAX_ORIGINAL_SCORE": 2000,
        "MIN_NORMALIZED_SCORE": 0.0,
        "MAX_NORMALIZED_SCORE": 2.0,
    }

    # rating może być od 0 do 5
    __RATING_SCORE = {
        "MIN_ORIGINAL_SCORE": 0.0,
        "MAX_ORIGINAL_SCORE": 5.0,
        "MIN_NORMALIZED_SCORE": 0.0,
        "MAX_NORMALIZED_SCORE": 2.0,
    }

    __SCORING = {
        "IS_PREFERRED_GENDER": 3.0,
        "VERIFIED_PHOTO": 0.25,
        "IS_DESCRIPTION": 0.5,
        "IS_LIKE": 3.0,
        "SAME_HOBBY": 0.5,
    }

    @staticmethod
    def score_one_user(user: UserModel, other: UserModel) -> float:
        other_score = 0

        other_score += RecommendationAlgorithm.__calculate_preferred_gender(user, other)
        other_score += RecommendationAlgorithm.__calculate_elo_score(other)
        other_score += RecommendationAlgorithm.__calculate_rating_score(other)
        other_score += RecommendationAlgorithm.__check_verified_photos(other)
        other_score += RecommendationAlgorithm.__check_if_is_description(other)
        other_score += RecommendationAlgorithm.__check_if_is_liked(user, other)
        other_score += RecommendationAlgorithm.__check_hobbies(user, other)

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
        scores = list(map(lambda score: score["score"], user.score))

        if not len(scores):
            return 0

        user_score = statistics.mean(scores)

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
    def __check_verified_photos(user: UserModel) -> float:
        score = (
            user.verifiedImages * RecommendationAlgorithm.__SCORING["VERIFIED_PHOTO"]
        )

        return score

    @staticmethod
    def __check_if_is_description(user: UserModel) -> float:
        score = (len(user.description) > 0) * RecommendationAlgorithm.__SCORING[
            "IS_DESCRIPTION"
        ]

        return score

    @staticmethod
    def __check_if_is_liked(user: UserModel, other: UserModel) -> float:
        score = (
            bool(
                db_functions.check_if_other_likes_user(user.reference, other.reference)
            )
            * RecommendationAlgorithm.__SCORING["IS_LIKE"]
        )

        return score

    @staticmethod
    def __check_hobbies(user: UserModel, other: UserModel) -> float:
        user_hobbies = set(user.hobbies)
        other_hobbies = set(other.hobbies)

        common_hobbies = user_hobbies.intersection(other_hobbies)

        score = len(common_hobbies) * RecommendationAlgorithm.__SCORING["SAME_HOBBY"]

        return score

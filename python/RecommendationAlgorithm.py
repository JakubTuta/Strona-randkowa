import typing

from models.user import UserModel

# zakładając elo mieści się od 500 do 2000
ELO_SCORE = {
    "MIN_ORIGINAL_SCORE": 500,
    "MAX_ORIGINAL_SCORE": 2000,
    "MIN_NORMALIZED_SCORE": 0.0,
    "MAX_NORMALIZED_SCORE": 1.0,
}

# zakładając że rating może być od 0 do 5
RATING_SCORE = {
    "MIN_ORIGINAL_SCORE": 0.0,
    "MAX_ORIGINAL_SCORE": 5.0,
    "MIN_NORMALIZED_SCORE": 0.0,
    "MAX_NORMALIZED_SCORE": 1.0,
}

# punkty z każdej kategorii mają się mieścić od 0 do 1
SCORING = {
    "IS_PREFERRED_GENDER": 1.0,
    "IS_PHOTO": 1.0,
    "IS_DESCRIPTION": 1.0,
}


class RecommendationAlgorithm:
    @staticmethod
    def score_one_user(user: UserModel, other: UserModel) -> float:
        other_score = 0

        other_score += RecommendationAlgorithm.__calculate_preferred_gender(user, other)
        other_score += RecommendationAlgorithm.__calculate_elo_score(other.elo)
        other_score += RecommendationAlgorithm.__calculate_rating_score(other.rating)
        other_score += RecommendationAlgorithm.__check_if_is_photo(other)
        other_score += RecommendationAlgorithm.__check_if_is_description(other)

        return other_score

    @staticmethod
    def score_all_users(
        user: UserModel, others: typing.Iterable[UserModel]
    ) -> typing.Iterable[float]:
        pass

    @staticmethod
    def __calculate_preferred_gender(user: UserModel, other: UserModel) -> float:
        score = (user.preferred_gender == other.gender) * SCORING["IS_PREFERRED_GENDER"]

        return score

    @staticmethod
    def __calculate_elo_score(original_score: int) -> float:
        normalized_score = (
            (original_score - ELO_SCORE["MIN_ORIGINAL_SCORE"])
            / (ELO_SCORE["MAX_ORIGINAL_SCORE"] - ELO_SCORE["MIN_ORIGINAL_SCORE"])
        ) * (ELO_SCORE["MAX_NORMALIZED_SCORE"] - ELO_SCORE["MIN_NORMALIZED_SCORE"])
        +ELO_SCORE["MIN_NORMALIZED_SCORE"]

        return normalized_score

    @staticmethod
    def __calculate_rating_score(original_score: float) -> float:
        normalized_score = (
            (original_score - RATING_SCORE["MIN_ORIGINAL_SCORE"])
            / (RATING_SCORE["MAX_ORIGINAL_SCORE"] - RATING_SCORE["MIN_ORIGINAL_SCORE"])
        ) * (
            RATING_SCORE["MAX_NORMALIZED_SCORE"] - RATING_SCORE["MIN_NORMALIZED_SCORE"]
        )
        +RATING_SCORE["MIN_NORMALIZED_SCORE"]

        return normalized_score

    @staticmethod
    def __check_if_is_photo(other: UserModel) -> float:
        score = (len(other.photos) != 0) * SCORING["IS_PHOTO"]

        return score

    @staticmethod
    def __check_if_is_description(other: UserModel) -> float:
        score = (len(other.description) != 0) * SCORING["IS_DESCRIPTION"]

        return score

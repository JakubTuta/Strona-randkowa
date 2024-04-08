import dataclasses


@dataclasses.dataclass
class UserModel:
    name: str
    age: int
    gender: str
    faculty: str
    description: str
    score: float
    elo: int
    photos: list[str] = dataclasses.field(
        default_factory=list, hash=False, compare=False
    )
    preferred_gender: str
    looking_for: str

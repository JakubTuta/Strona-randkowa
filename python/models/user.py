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
    photos: list[str]
    preferred_gender: str
    looking_for: str

    def __init__(self, data, reference):
        for key, value in data.items():
            setattr(self, key, value)
        setattr(self, "reference", reference)

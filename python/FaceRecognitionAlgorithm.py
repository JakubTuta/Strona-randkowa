from deepface import DeepFace


def analyze_image(image: str) -> dict:
    result = DeepFace.analyze(image, ["age", "gender"])[0]

    data = {
        "gender": result["dominant_gender"],
        "age": result["age"],
    }

    return data

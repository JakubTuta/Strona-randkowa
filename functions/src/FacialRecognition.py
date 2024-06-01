from deepface import DeepFace


def is_human_in_image(image):
    result = DeepFace.analyze(
        image,
        actions=["age", "gender"],
        enforce_detection=False,
    )

    if len(result) != 1:
        return

    result = result[0]
    if result["face_confidence"] > 0.75:
        if result["dominant_gender"] == "Woman":
            result["dominant_gender"] = "female"
        elif result["dominant_gender"] == "Man":
            result["dominant_gender"] = "male"

        return result

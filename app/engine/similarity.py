# app/engine/similarity.py
import numpy as np

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    """
    Similaridade correta para vetores JÁ normalizados.
    """
    if v1 is None or v2 is None:
        return 0.0

    return float(np.dot(v1, v2))

# app/core/ranking.py

import numpy as np
from app.engine.embeddings import embed
from .vocabulary import VOCABULARY


def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def build_ranking(secret_word):

    secret_vec = embed(secret_word)

    scores = []

    for word in VOCABULARY:
        vec = embed(word)
        sim = cosine_similarity(secret_vec, vec)
        scores.append((word, sim))

    # ordena por similaridade
    scores.sort(key=lambda x: x[1], reverse=True)

    # 🔥 transforma em dict de ranking
    ranking = {
        word: rank
        for rank, (word, _) in enumerate(scores, start=1)
    }

    return ranking

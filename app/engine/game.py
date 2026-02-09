# engine/game.py 
import random

from app.core.vocabulary import VOCABULARY
from app.engine.cache import EmbeddingCache
from app.engine.normalizer import normalize
from app.engine.similarity import cosine_similarity


class ContextoGame:
    def __init__(self):
        # inicializa cache de embeddings
        self.cache = EmbeddingCache()

        # carrega e normaliza palavras do vocabulário central
        self.words = list({
            normalize(w)
            for w in VOCABULARY
            if normalize(w)
        })

        # escolhe palavra secreta
        self.secret = random.choice(self.words)

        # embedding da palavra secreta
        self.secret_vector = self.cache.get(self.secret)

        # constrói ranking global
        self._build_ranking()

    def _build_ranking(self):
        self.ranking = []

        for word in self.words:
            vector = self.cache.get(word)
            similarity = cosine_similarity(
                vector,
                self.secret_vector
            )
            self.ranking.append((word, similarity))

        self.ranking.sort(
            key=lambda x: x[1],
            reverse=True
        )

    def guess(self, word: str) -> int:
        word = normalize(word)

        vector = self.cache.get(word)
        similarity = cosine_similarity(
            vector,
            self.secret_vector
        )

        for index, (_, sim) in enumerate(self.ranking):
            if similarity >= sim:
                return index + 1

        return len(self.ranking) + 1

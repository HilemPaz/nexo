# engine/cache.py 
from app.engine.embeddings import EmbeddingModel


class EmbeddingCache:
    """
    Cache em memória para embeddings.
    Cada palavra é convertida em vetor apenas uma vez.
    """

    def __init__(self):
        self.embedder = EmbeddingModel()
        self.cache = {}

    def get(self, word: str):
        """
        Retorna o embeddings da palavra.
        Se não existir no cache, calcula e armazena.
        """
        if word not in self.cache:
            self.cache[word] = self.embedder.encode(word)
        return self.cache[word]

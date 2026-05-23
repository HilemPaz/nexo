# engine/cache.py

import numpy as np
from pathlib import Path

VECTORS_PATH = Path(__file__).parent.parent / "resources" / "vectors.npz"


class EmbeddingCache:
    """
    Cache em memória para embeddings pré-computados.
    Carrega todos os vetores uma vez e serve instantaneamente.
    """

    _vectors = None

    def __init__(self):
        if EmbeddingCache._vectors is None:
            print("⚡ Carregando vetores pré-computados...")

            data = np.load(VECTORS_PATH, allow_pickle=True)

            # formato: {"palavra": vetor}
            EmbeddingCache._vectors = data["vectors"].item()

            print(f"✅ {len(EmbeddingCache._vectors)} vetores carregados")

        self.vectors = EmbeddingCache._vectors

    def get(self, word: str):
        try:
            return self.vectors[word]
        except KeyError:
            raise ValueError(f"Embedding não encontrado para '{word}'")

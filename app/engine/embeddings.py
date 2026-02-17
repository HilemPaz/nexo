# engine/embeddings.py

import numpy as np
from pathlib import Path

EMBEDDINGS_PATH = Path(__file__).parent.parent / "resources" / "embeddings.npz"

_vectors = {}
_loaded = False


def preload_vocab():
    global _loaded, _vectors

    if _loaded:
        return

    if not EMBEDDINGS_PATH.exists():
        raise FileNotFoundError(
            f"Embeddings não encontrados em {EMBEDDINGS_PATH}"
        )

    print("⚡ Carregando embeddings pré-computados...")

    data = np.load(EMBEDDINGS_PATH, allow_pickle=True)
    _vectors = data["vectors"].item()

    _loaded = True
    print(f"✅ {len(_vectors)} vetores carregados!")


def embed(word: str):
    if not _loaded:
        preload_vocab()

    try:
        return _vectors[word]
    except KeyError:
        raise ValueError(f"Palavra '{word}' não está no VOCABULARY")

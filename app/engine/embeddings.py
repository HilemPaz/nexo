# engine/embeddings.py

import fasttext
import os
from app.core.vocabulary import VOCABULARY

MODEL_PATH = os.getenv("FASTTEXT_MODEL", "/models/cc.pt.300.bin")

_model = None
_vectors = {}
_loaded = False


def get_model():
    global _model

    if _model is None:
        print("🧠 Carregando modelo fastText (isso pode levar alguns segundos)...")

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Modelo fastText não encontrado em {MODEL_PATH}"
            )

        _model = fasttext.load_model(MODEL_PATH)

        print("✅ fastText carregado com sucesso!")

    return _model


def preload_vocab():
    """
    Carrega os vetores do VOCABULARY inteiro na RAM.
    Isso transforma o ranking em pura matemática (muito rápido).
    """

    global _loaded

    if _loaded:
        return

    model = get_model()

    print("⚡ Pré-carregando vetores do vocabulário...")

    for word in VOCABULARY:
        _vectors[word] = model.get_word_vector(word)

    _loaded = True

    print(f"✅ {len(_vectors)} vetores carregados na memória!")


def embed(word: str):
    """
    Retorna o vetor já em RAM.
    Extremamente rápido.
    """

    if not _loaded:
        preload_vocab()

    try:
        return _vectors[word]
    except KeyError:
        raise ValueError(f"Palavra '{word}' não está no VOCABULARY")



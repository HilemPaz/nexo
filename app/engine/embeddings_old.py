# engine/embeddings.py

import fasttext
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent / "resources" / "cc.pt.300.bin"


class EmbeddingModel:
    _model = None

    def __init__(self):
        if EmbeddingModel._model is None:
            EmbeddingModel._model = fasttext.load_model(str(MODEL_PATH))

        self.model = EmbeddingModel._model

    def encode(self, word: str) -> np.ndarray:
        return self.model.get_word_vector(word)


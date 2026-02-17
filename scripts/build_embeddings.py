# script/build_embeddings.py
import fasttext
import numpy as np
from pathlib import Path

from app.core.vocabulary import VOCABULARY

MODEL_PATH = Path("app/models/cc.pt.300.bin")
OUTPUT = Path("app/resources/embeddings.npz")

print("Carregando fastText...")
model = fasttext.load_model(str(MODEL_PATH))

vectors = {}

for word in VOCABULARY:
    vectors[word] = model.get_word_vector(word)

print("Salvando embeddings...")
np.savez_compressed(
    OUTPUT,
    vectors=vectors
)

print(f"✅ Arquivo salvo em {OUTPUT}")

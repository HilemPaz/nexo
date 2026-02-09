# core/vocabulary.py 
from pathlib import Path
from app.engine.normalizer import normalize

VOCAB_PATH = Path(__file__).parent.parent / "resources" / "pt_words.txt"

def load_vocabulary() -> set[str]:
    vocab = set()

    with open(VOCAB_PATH, encoding="utf-8") as f:
        for line in f:
            word = normalize(line)
            if word:
                vocab.add(word)

    return vocab

VOCABULARY = load_vocabulary()

def is_valid_word(word: str) -> bool:
    return normalize(word) in VOCABULARY

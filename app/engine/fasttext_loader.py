# app/engine/fasttext_loader.py 
import fasttext
from pathlib import Path

_model = None


def load_fasttext_model(model_path: Path):
    global _model
    if _model is None:
        _model = fasttext.load_model(str(model_path))
    return _model

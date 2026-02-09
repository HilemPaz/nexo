# app/engine/normalizer.py
import re


def normalize(word: str) -> str:
    """
    Normalização LEVE:
    - lowercase
    - remove espaços
    - mantém acentos (CRÍTICO para semântica)
    - apenas letras do português
    """

    if not word or not isinstance(word, str):
        return ""

    word = word.strip().lower()

    # rejeita frases
    if " " in word:
        return ""

    # mantém letras + acentos do português
    word = re.sub(r"[^a-záàâãéêíóôõúç]", "", word)

    return word


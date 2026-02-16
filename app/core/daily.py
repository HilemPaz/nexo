# core/daily.py
import random
import hashlib
from datetime import datetime, timezone

from app.core.vocabulary import VOCABULARY


def get_daily_seed():
    """
    Gera uma seed baseada na data UTC.
    Garante que o mundo inteiro receba a mesma palavra.
    """
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    seed = int(hashlib.sha256(today.encode()).hexdigest(), 16)

    return seed, today


def get_daily_word():
    seed, today = get_daily_seed()

    rng = random.Random(seed)

    word = rng.choice(list(VOCABULARY))

    return word, today

